const twilio = require('twilio');

const accountSid = process.env.SMS_ACCOUNT_SID;
const authToken = process.env.SMS_AUTH_TOKEN;
const fromPhone = process.env.SMS_FROM;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

const sendSMS = async (to, body) => {
  if (!client) {
    console.log(`[SMS MOCK] To: ${to} | Body: ${body}`);
    return { success: true, mocked: true };
  }

  try {
    const message = await client.messages.create({
      body,
      from: fromPhone,
      to
    });
    return { success: true, messageSid: message.sid };
  } catch (error) {
    console.error('SMS sending failed:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendSMS };
