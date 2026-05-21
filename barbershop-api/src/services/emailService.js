async function sendEmail({ to, subject, body }) {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY, 
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      sender: {
        name: 'Barbershop App',
        email: 'filipelacerda122@gmail.com' 
      },
      to: [{ email: to }],
      subject: subject,
      htmlContent: body
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Erro na API do Brevo:', errorData);
    throw new Error('Falha ao enviar e-mail via API');
  }
}

module.exports = { sendEmail };