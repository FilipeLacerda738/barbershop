const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com', 
  port: 465,              
  secure: true,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

async function sendEmail({ to, subject, body }) {
  await transport.sendMail({
    from: `"Equipe Barbearia" <${process.env.MAILTRAP_USER}>`, 
    to,
    subject,
    html: body, 
  });
}

module.exports = { sendEmail };