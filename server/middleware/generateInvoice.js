const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoice = (invoiceData) => {
  const invoicesDir = path.join(__dirname, "invoices");

  // Create the invoices directory if it doesn't exist
  if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir, { recursive: true });
  }

  const invoicePath = path.join(invoicesDir, `invoice_${invoiceData.id}.pdf`);

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(invoicePath));
  doc.fontSize(25).text("Invoice", { align: "center" });
  doc.text(`Invoice ID: ${invoiceData.id}`);
  doc.text(`Amount: $${invoiceData.amount}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);
  // Add more details as needed

  doc.end();

  return invoicePath; // Return path of the generated PDF
};

module.exports = generateInvoice;
