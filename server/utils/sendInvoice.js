const nodemailer = require("nodemailer");

const sendInvoice = async (to, subject, text, attachmentPath) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or any other service
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.APP_PASSWORD, // Your app password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    text,
    attachments: [
      {
        filename: "invoice.pdf",
        path: attachmentPath,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendInvoice;
