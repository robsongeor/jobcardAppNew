const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const { PDFDocument } = require("pdf-lib");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const { userInfo } = require("./pass");


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

      const makemodel = `${mach.make} ${mach.model}${mach.serialNumber}`;
      form.getTextField("make").setText(makemodel || "");
      form.getTextField("hours").setText(data.description.hours || "");

      // Report
      const chargeable = data.description.chargeable ? "yes" : "no";
      form.getTextField("chargeable").setText(chargeable || "");
      form.getTextField("reason").setText(data.description.chargeableComment ||
        "");
      form.getTextField("report").setText(data.description.report || "");

      // Client Signature
      if (data.signed) {
        form.getTextField("clientName").setText(data.signed.name || "");
        form.getTextField("clientDate").setText(data.signed.date || "");
      }


      // Hours & Mileage
      data.activity.forEach((element, index) => {
        form.getTextField(`date${index + 1}`).setText(element.date || "");
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

console.log("generateJobCardPDF function loaded!");


