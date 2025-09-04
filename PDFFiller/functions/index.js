import admin from "firebase-admin";
import corsMiddleware from "cors";
import {PDFDocument, StandardFonts} from "pdf-lib";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import {google} from "googleapis";
import {formatDate} from "./formatter.js";

const cors = corsMiddleware({origin: true});

import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


import {onRequest} from "firebase-functions/v2/https";
import {defineSecret} from "firebase-functions/params";

const gmailClientSecret = defineSecret("GMAIL_CLIENT_SECRET");
const gmailRefreshToken = defineSecret("GMAIL_REFRESH_TOKEN");

admin.initializeApp();


export const generateJobCardPDF = onRequest(
    {
      region: "us-central1",
      secrets: [gmailClientSecret, gmailRefreshToken],
      timeoutSeconds: 300,
    },
    async (req, res) => {
    // Get the Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).send("Unauthorized: No token provided");
      }
      const idToken = authHeader.split("Bearer ")[1];

      try {
      // Verify the token with Firebase Admin
        await admin.auth().verifyIdToken(idToken);
      // Optional: You can check for specific UID or email here
      // e.g., if (decodedToken.uid !== "yourAppUserId") { ... }
      } catch (err) {
        return res.status(401).send("Unauthorized: Invalid token");
      }

      cors(req, res, async () => {
        try {
        // Only allow POST
          if (req.method !== "POST") {
            return res.status(405).send("Method Not Allowed");
          }

          // Parse incoming data
          const data = req.body;

          // Load your template PDF
          const templatePath =
          path.join(__dirname, "assets", "Final.pdf");

          const formPdfBytes = fs.readFileSync(templatePath);
          const pdfDoc = await PDFDocument.load(formPdfBytes);
          const form = pdfDoc.getForm();

          const helveticaBold =
          await pdfDoc.embedFont(StandardFonts.HelveticaBold);


          const technicianField = form.getTextField("technician");
          technicianField.setText(data.techName || "");
          technicianField.updateAppearances(helveticaBold);

          form.getTextField("technicianEmail").setText(
              data.techPhone || "");
          form.getTextField("technicianPhone").setText(
              data.techEmail || "");

          // Customer Details
          const customerField = form.getTextField("customer");
          customerField.setText(data.customerName || "");
          customerField.updateAppearances(helveticaBold);


          const ca = data.customerAddress;
          const cas = data.customerAddressSuburb;
          const cat = data.customerAddressTown;

          const add = `${ca}, ${cas}, ${cat}`;

          form.getTextField("address").setText(add || "");

          const contactField = form.getTextField("contact");
          contactField.setText(data.siteContact || "");
          contactField.updateAppearances(helveticaBold);


          form.getTextField("contactEmail").setText(
              data.siteContactEmail || "");
          form.getTextField("contactPhone").setText(
              data.siteContactPhone || "");

          // Job Details
          // Job number field
          const jobField = form.getTextField("jobnumber");
          jobField.setText(data.job || "");
          jobField.updateAppearances(helveticaBold);

          // Fleet field
          const fleetField = form.getTextField("fleet");
          fleetField.setText(data.fleet || "");
          fleetField.updateAppearances(helveticaBold);

          // Order field
          const orderField = form.getTextField("order");
          orderField.setText(data.description?.orderNo || "");
          orderField.updateAppearances(helveticaBold);


          const mach = data.machine;

          const makemodel = `${mach.make} ${mach.model} `;
          const makeField = form.getTextField("make");
          makeField.setText(makemodel || "");
          makeField.updateAppearances(helveticaBold);

          form.getTextField("serial").setText(
              String(mach.serialNumber) || "");

          const hoursField = form.getTextField("hours");
          hoursField.setText(data.description?.hours || "");
          hoursField.updateAppearances(helveticaBold);


          // Report
          // const chargeable = data.description.chargeable ? "Yes" : "No";
          // form.getTextField("chargeable").setText(chargeable || "");
          // form.getTextField("reason").setText(
          //   data.description.chargeableComment ||
          //   "");
          form.getTextField("report").setText(data.description.report || "");

          // Client Signature
          const clientDateF =
          data.signed.clientDate ? formatDate(data.signed.clientDate) : "";

          const customerSignNameField = form.getTextField("customerSignName");
          customerSignNameField.setText(data.signed?.clientName || "");
          customerSignNameField.updateAppearances(helveticaBold);

          const customerSignDateField = form.getTextField("customerSignDate");
          customerSignDateField.setText(clientDateF || "");
          customerSignDateField.updateAppearances(helveticaBold);


          // Hours & Mileage
          data.activity.forEach((element, index) => {
            const dateF = formatDate(element.date);

            form.getTextField(`date${index + 1}`).setText(dateF || "");
            form.getTextField(`hour${index + 1}`).setText(element.hours || "");
            form.getTextField(`mile${index + 1}`).setText(element.kms || "");
          });

          // Parts
          data.parts.forEach((element, index) => {
            form.getTextField(`part${index + 1}`).setText(element.descValue ||
            "");
            form.getTextField(`qty${index + 1}`).setText(
                element.quantityValue ||
            "");
          });

          if (data.signed && data.signed.signature &&
          data.signed.signature.trim() !== "") {
            try {
            // 1. Get the signature base64 data (strip the prefix)
              const signatureBase64 =
              data.signed.signature.replace(/^data:image\/png;base64,/, "");
              if (signatureBase64) {
              // 2. Convert it to a Uint8Array (binary buffer)
                const page = pdfDoc.getPages()[0];
                const signatureBytes = Buffer.from(signatureBase64, "base64");

                // Box dimensions (same as before)
                const boxX = 3.1208 * 72;
                const boxY = (11.6929 - 10.8391) * 72;
                const targetWidth = 4.763 * 72;
                const targetHeight = 0.861 * 72;

                // Embed signature and get dimensions
                const signatureImage = await pdfDoc.embedPng(signatureBytes);
                const pngWidth = signatureImage.width;
                const pngHeight = signatureImage.height;

                // Calculate scale and position
                const widthScale = targetWidth / pngWidth;
                const heightScale = targetHeight / pngHeight;
                const scale = Math.min(widthScale, heightScale, 1);

                const drawnWidth = pngWidth * scale;
                const drawnHeight = pngHeight * scale;

                const signatureX = boxX + (targetWidth - drawnWidth) / 2;
                const signatureY = boxY + (targetHeight - drawnHeight) / 2;

                // Draw the image
                page.drawImage(signatureImage, {
                  x: signatureX,
                  y: signatureY,
                  width: drawnWidth,
                  height: drawnHeight,
                });
              }
            } catch (err) {
              console.warn("Could not embed signature (may be missing):", err);
            // Optionally, continue without failing
            }
          }

          // Generate the PDF buffer
          form.flatten();
          const pdfBytes = await pdfDoc.save();


          const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
          const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
          const REDIRECT_URI = process.env.GMAIL_REDIRECT_URI;
          const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
          const SENDER_EMAIL = process.env.GMAIL_SENDER_EMAIL;

          console.log("ALL ENV VARS:", JSON.stringify(process.env, null, 2));

          const oAuth2Client = new google.auth.OAuth2(
              CLIENT_ID,
              CLIENT_SECRET,
              REDIRECT_URI,
          );

          oAuth2Client.setCredentials({
            refresh_token: REFRESH_TOKEN,
          });

          const accessToken = (await oAuth2Client.getAccessToken()).token;

          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              type: "OAuth2",
              user: SENDER_EMAIL,
              clientId: CLIENT_ID,
              clientSecret: CLIENT_SECRET,
              refreshToken: REFRESH_TOKEN,
              accessToken: accessToken, // shortcut for accessToken: accessToken
            },
          });

          // Email the PDF as an attachment
          await transporter.sendMail({
            from: SENDER_EMAIL, // sender address
            to: SENDER_EMAIL, // recipient (could be a list!)
            subject: `Job Card Submitted: ${data.jobId || "No ID"}`,
            text: `A new job card has been submitted by ${data.technician ||
            "a technician"}.`,
            attachments: [
              {
                filename: `JobCard-${data.jobId || "unknown"}.pdf`,
                content: Buffer.from(pdfBytes),
                contentType: "application/pdf",
              },
            ],
          });

          res.status(200).json({
            success: true,
            message: "Job card emailed successfully!",
          });
        } catch (error) {
          console.error(error);
          res.status(500).send("Error generating PDF");
        }
      });
    });

import {onSchedule} from "firebase-functions/v2/scheduler";

// Runs every day at midnight UTC
export const scheduledJobStatusUpdate =
  onSchedule("every day 00:00", async (event) => {
    const db = admin.firestore();
    const jobsRef = db.collection("jobs");

    // Query jobs with status "assigned"
    const snapshot = await jobsRef.where("status", "==", "assigned").get();

    if (snapshot.empty) {
      console.log("No assigned jobs found.");
      return;
    }

    const now = Date.now();
    const twoWeeks = 2 * 7 * 24 * 60 * 60 * 1000;
    const batch = db.batch();

    snapshot.forEach((doc) => {
      const job = doc.data();

      if (job.assignedDate && typeof job.assignedDate === "object") {
        let isOverdue = false;
        Object.keys(job.assignedDate).forEach((uid) => {
          const isoStr = job.assignedDate[uid];
          const assignedTime = Date.parse(isoStr);
          if (assignedTime && assignedTime + twoWeeks < now) {
            isOverdue = true;
          }
        });

        if (isOverdue) {
          batch.update(doc.ref, {status: "overdue"});
        }
      }
    });

    await batch.commit();
    console.log("Checked and updated overdue jobs.");
  });


// npx eslint . --fix
// firebase deploy --only functions
