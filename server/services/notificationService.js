const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendEmail } = require('./emailService');
const { sendSMS } = require('./smsService');

const notifyUser = async (app, {
  userId,
  type,
  title,
  message,
  relatedEntity = null,
  relatedEntityId = null,
  channels = ['inApp']
}) => {
  try {
    const user = await User.findById(userId);
    if (!user) return { success: false, message: 'User not found' };

    // Get Preferences (default to true if missing, except SMS which defaults false per instructions)
    const prefs = user.notificationPreferences || { inApp: true, email: true, sms: false };

    let createdNotification = null;

    // 1. In-App & Socket
    if (channels.includes('inApp') && prefs.inApp !== false) {
      createdNotification = await Notification.create({
        recipient: userId,
        title,
        message,
        type: type || 'system',
        relatedEntity,
        relatedEntityId,
        read: false
      });

      if (app) {
        const io = app.get('io');
        if (io) {
          io.to(userId.toString()).emit('notificationCreated', createdNotification);
        }
      }
    }

    // 2. Email
    if (channels.includes('email') && prefs.email !== false) {
      // Async so it doesn't block
      sendEmail(user.email, title, `
        <div style="font-family: sans-serif; max-w-xl; margin: auto; padding: 20px; border: 1px solid #E2E8F0; border-radius: 8px;">
          <h1 style="color: #0F172A; font-size: 20px; font-weight: 800; margin-bottom: 8px;">FIELDOPS</h1>
          <h2 style="color: #F97316; font-size: 16px; font-weight: 700; margin-bottom: 16px;">${title}</h2>
          <p style="color: #334155; font-size: 14px; font-weight: 500; line-height: 1.5;">${message}</p>
          <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 24px 0;" />
          <p style="color: #64748B; font-size: 12px; font-weight: 600;">Automated message from FieldOps Communication System</p>
        </div>
      `).catch(err => console.error('Email background task failed', err));
    }

    // 3. SMS
    if (channels.includes('sms') && prefs.sms && user.phone) {
      sendSMS(user.phone, `FieldOps: ${title} - ${message}`)
        .catch(err => console.error('SMS background task failed', err));
    }

    return { success: true, notification: createdNotification };
  } catch (error) {
    console.error('NotifyUser Error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { notifyUser };
