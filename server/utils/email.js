const nodemailer = require("nodemailer");

const sendResetEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.APP_PASSWORD, // Your app password
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset",
    html: `<p>You requested a password reset. Click this <a href="${`http://localhost:5173/password-reset/${token}`}">link</a> to reset your password.</p>`,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Reset email sent successfully.");
  } catch (error) {
    console.error("Error sending reset email:", error);
  }
};

module.exports = { sendResetEmail };
