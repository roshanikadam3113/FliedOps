const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getUserNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .limit(50);
    return res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const count = await Notification.countDocuments({ recipient: userId, read: false });
    return res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const markNotificationRead = async (req, res, next) => {
  try {
    const notifId = req.params.id;
    const notification = await Notification.findById(notifId);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this notification' });
    }
    notification.read = true;
    await notification.save();
    return res.status(200).json({ success: true });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
const markAllNotificationsRead = async (req, res, next) => {
  try {
    const userId = req.user._id;
    await Notification.updateMany({ recipient: userId, read: false }, { $set: { read: true } });
    return res.status(200).json({ success: true });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

module.exports = {
  getUserNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead
};
