const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

async function fillJobCard(data) {
    const formPdfBytes = fs.readFileSync('Jobsheet Template Update.pdf');
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    const form = pdfDoc.getForm();

    // Fill the fields with your data
    form.getTextField('job').setText(data.job || '');
    form.getTextField('fleet').setText(data.fleet || '');
    form.getTextField('orderNo').setText(data.orderNo || '');
    form.getTextField('technician').setText(data.technician || '');
    form.getTextField('customer').setText(data.customer || '');
    form.getTextField('customer-address').setText(data.customerAddress || '');
    form.getTextField('site-contact').setText(data.siteContact || '');
    form.getTextField('site-contact-phone').setText(data.siteContactPhone || '');
    form.getTextField('machine-make').setText(data.machineMake || '');
    form.getTextField('machine-model').setText(data.machineModel || '');
    form.getTextField('machine-serial').setText(data.machineSerial || '');
    form.getTextField('hours').setText(data.hours || '');
    form.getTextField('description').setText(data.report || '');
    form.getTextField('chargeable').setText(data.chargeable ? 'Yes' : 'No');
    // Add more fields as needed...

    // Save the filled PDF
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync('FilledJobCard.pdf', pdfBytes);
}

const jobData = {
    job: '103509',
    fleet: "FN1245",
    orderNo: '107345',
    technician: 'George Robson',
    customer: 'Acme Forklifts',
    customerAddress: '123 Warehouse Rd',
    siteContact: 'Jane Doe',
    siteContactPhone: '021123456',
    machineMake: 'Toyota',
    machineModel: '8FG25',
    machineSerial: '1234567',
    hours: '1235',
    report: 'Damaged fork',
    chargeable: true,
};

fillJobCard(jobData);
