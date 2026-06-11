const { Resend } = require('resend');
const { RESEND_API_KEY, CLIENT_URL } = require('../config/env');

const resend = new Resend(RESEND_API_KEY);

async function enviarInvitacion(email, token, nombreLista, nombreEmisor) {
  const linkInvitacion = `${CLIENT_URL}/invitacion/${token}`;

  try {
    await resend.emails.send({
      from: 'WeList <onboarding@resend.dev>',
      to: email,
      subject: `Te han invitado a la lista "${nombreLista}" en WeList`,
      html: `
        <h1>Te han invitado a una lista</h1>
        <p><strong>${nombreEmisor}</strong> te ha invitado a colaborar en la lista "<strong>${nombreLista}</strong>" en WeList.</p>
        <p>Haz clic en el enlace para aceptar la invitación:</p>
        <a href="${linkInvitacion}" style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Aceptar invitación</a>
        <p style="margin-top: 20px; color: #666;">Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:</p>
        <p style="color: #666;">${linkInvitacion}</p>
      `,
    });
    return true;
  } catch (error) {
    console.error('Error enviando email:', error);
    return false;
  }
}

module.exports = { enviarInvitacion };
