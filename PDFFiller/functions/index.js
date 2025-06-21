const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});
const {PDFDocument} = require("pdf-lib");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const {userInfo} = require("./pass");
const {formatDate} = require("./formatter");


admin.initializeApp();

// Setup email transport using a Gmail account
const transporter = nodemailer.createTransport(userInfo);


exports.generateJobCardPDF = functions.https.onRequest(async (req, res) => {
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
        path.join(__dirname, "assets", "JobsheetTemplateUpdate.pdf");
      const formPdfBytes = fs.readFileSync(templatePath);
      const pdfDoc = await PDFDocument.load(formPdfBytes);
      const form = pdfDoc.getForm();

      // Customer Details
      form.getTextField("customer").setText(data.customerName || "");
      form.getTextField("address").setText(data.customerAddress || "");
      form.getTextField("suburb").setText(data.customerAddressSuburb || "");
      form.getTextField("town").setText(data.customerAddressTown || "");
      form.getTextField("contact").setText(data.siteContact || "");
      form.getTextField("phone").setText(data.siteContactPhone || "");

      // Job Details
      form.getTextField("job").setText(data.job || "");
      form.getTextField("fleet").setText(data.fleet || "");
      form.getTextField("order").setText(data.description.orderNo || "");


      const mach = data.machine;

      const makemodel = `${mach.make} ${mach.model} ${mach.serialNumber}`;
      form.getTextField("make").setText(makemodel || "");
      form.getTextField("hours").setText(data.description.hours || "");

      // Report
      const chargeable = data.description.chargeable ? "Yes" : "No";
      form.getTextField("chargeable").setText(chargeable || "");
      form.getTextField("reason").setText(data.description.chargeableComment ||
        "");
      form.getTextField("report").setText(data.description.report || "");

      // Client Signature
      const clientDateF = formatDate(data.signed.clientDate);
      form.getTextField("clientName").setText(data.signed.clientName || "");
      form.getTextField("clientDate").setText(clientDateF || "");


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
        form.getTextField(`qty${index + 1}`).setText(element.quantityValue ||
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
            const boxX = 5.5064 * 72;
            const boxY = (11.6929 - 10.8718) * 72;
            const targetWidth = 2.2627 * 72;
            const targetHeight = 0.8449 * 72;

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

      // Email the PDF as an attachment
      await transporter.sendMail({
        from: "jobcard@liftrucksservice@gmail.com", // sender address
        to: "liftrucksservice@gmail.com", // recipient (could be a list!)
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

const {onSchedule} = require("firebase-functions/v2/scheduler");

// Runs every day at midnight UTC
exports.scheduledJobStatusUpdate =
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
