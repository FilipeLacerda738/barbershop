const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, 
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

async function sendEmail({ to, subject, body }) {
  await transport.sendMail({
    from: '"Barbershop App" <contato@barbershop.com>',
    to,
    subject,
    html: body, 
  });
}

module.exports = { sendEmail };