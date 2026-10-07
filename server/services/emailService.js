const { Resend } = require('resend');

const resend = process.env.EMAIL_API_KEY ? new Resend(process.env.EMAIL_API_KEY) : null;
const EMAIL_FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev';

const sendEmail = async (to, subject, html) => {
  if (!resend) {
    console.log(`[EMAIL MOCK] To: ${to} | Subject: ${subject}`);
    return { success: true, mocked: true };
  }

  try {
    const data = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      html
    });
    return { success: true, data };
  } catch (error) {
    console.error('Email sending failed:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail };
