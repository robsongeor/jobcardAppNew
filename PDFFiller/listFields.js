const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

async function listPdfFields(pdfPath) {
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();

    const fields = form.getFields();
    fields.forEach(field => {
        const type = field.constructor.name;
        const name = field.getName();
        console.log(`${name} (${type})`);
    });
}

listPdfFields('Jobsheet Template Update.pdf');
