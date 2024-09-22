const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

exports.generateInvoice = (req, res) => {
  const doc = new PDFDocument();

  const filePath = path.join(
    __dirname,
    "../invoices",
    `invoice_${Date.now()}.pdf`
  );

  const writeStream = fs.createWriteStream(filePath);

  doc.pipe(writeStream);

  doc.fontSize(20).text("Invoice", { align: "center" });
  doc.fontSize(14).text(`Amount: $${req.body.amount}`, { align: "left" });
  doc.end();

  writeStream.on("finish", () => {
    res.status(200).sendFile(filePath);
  });
};
