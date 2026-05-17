import express from 'express';
import Notification from '../models/Notification.js';

const router = express.Router();

// GET /api/notifications - Get notifications for current user
router.get('/', async (req, res) => {
  try {
    const { userId, type, isRead, limit = 50, page = 1 } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const filter = { userId };
    if (type) filter.type = type;
    if (isRead !== undefined) filter.isRead = isRead === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Notification.countDocuments(filter),
      Notification.getUnreadCount(userId),
    ]);

    res.json({
      success: true,
      notifications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/notifications/unread-count - Get unread count
router.get('/unread-count', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const count = await Notification.getUnreadCount(userId);
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/notifications - Create notification
router.post('/', async (req, res) => {
  try {
    const { userIds, ...data } = req.body;

    if (userIds && Array.isArray(userIds)) {
      const notifications = await Notification.createForUsers(userIds, data);
      return res.status(201).json({ success: true, created: notifications.length, notifications });
    }

    const notification = await Notification.create(req.body);
    res.status(201).json({ success: true, notification });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/notifications/:id/read - Mark as read
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    await notification.markAsRead();
    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/notifications/read-all - Mark all as read for user
router.put('/read-all', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const result = await Notification.markAllReadForUser(userId);
    res.json({ success: true, updated: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
