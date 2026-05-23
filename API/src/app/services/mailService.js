import nodemailer from 'nodemailer';

function hasSmtpConfig() {
  return Boolean(process.env.SMTP_HOST);
}

function createTransporter() {
  const port = Number(process.env.SMTP_PORT ?? 587);

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE === 'true' || port === 465,
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
  });
}

export async function sendPasswordResetEmail({ to, nome, resetUrl }) {
  if (!hasSmtpConfig()) {
    console.info(`[password-reset] Link para ${to}: ${resetUrl}`);
    return;
  }

  const transporter = createTransporter();
  const displayName = nome ? ` ${nome}` : '';
  const from = process.env.MAIL_FROM ?? process.env.SMTP_USER;

  await transporter.sendMail({
    from,
    to,
    subject: 'Redefinicao de senha - Metalurgica Vulcano',
    text: [
      `Ola${displayName},`,
      '',
      'Recebemos uma solicitacao para redefinir sua senha.',
      'Acesse o link abaixo para criar uma nova senha:',
      resetUrl,
      '',
      'Se voce nao solicitou essa alteracao, ignore este email.',
      'Metalurgica Vulcano',
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; color: #30384a; line-height: 1.5;">
        <h2 style="margin: 0 0 16px;">Redefinicao de senha</h2>
        <p>Ola${displayName},</p>
        <p>Recebemos uma solicitacao para redefinir sua senha.</p>
        <p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 18px; border-radius: 7px; background: #ff8424; color: #ffffff; font-weight: 700; text-decoration: none;">
            Criar nova senha
          </a>
        </p>
        <p>Se voce nao solicitou essa alteracao, ignore este email.</p>
        <p style="color: #697586;">Metalurgica Vulcano</p>
      </div>
    `,
  });
}
