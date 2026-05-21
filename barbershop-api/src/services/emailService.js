async function sendEmail({ to, subject, body }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Barbershop App <onboarding@resend.dev>', 
      to: [to], 
      subject: subject,
      html: body
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Erro no Resend:', errorData);
    throw new Error('Falha ao enviar e-mail via Resend');
  }
}

module.exports = { sendEmail };