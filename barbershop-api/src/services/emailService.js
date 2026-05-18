const nodemailer = require('nodemailer');


const transport = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  secure: true,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});


async function sendEmail({ to, subject, body }) {
  await transport.sendMail({
    from: '"Barbershop" <noreply@barbershop.com>',
    to,
    subject,
    html: body, 
  });
}

module.exports = { sendEmail };