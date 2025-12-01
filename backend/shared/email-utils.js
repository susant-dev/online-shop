const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_PASSWORD,
  },
});

async function sendEmail(to, subject, message) {
  if (!to) throw new Error("Receiver email id is required to send email");
  if (!subject) throw new Error("Email subject is requried to send email");
  if (!message) throw new Error("Email message is requried to send email");
  try {
    const info = await transporter.sendMail({
      from: process.env.GOOGLE_EMAIL,
      to: to,
      subject: subject,
      text: message,
    });
    return info;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = sendEmail;
