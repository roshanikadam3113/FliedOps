const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getUserNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead
} = require('../controllers/notificationController');

router.get('/', protect, getUserNotifications);
router.get('/unread-count', protect, getUnreadCount);
router.patch('/read-all', protect, markAllNotificationsRead);
router.patch('/:id/read', protect, markNotificationRead);

module.exports = router;
