import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { prisma } from '../database.js';

const router = express.Router();

/**
 * @route POST /api/v1/push/subscribe
 * @desc Save FCM push token for user
 * @access Private (Agent+)
 */
router.post('/subscribe', authMiddleware, async (req, res) => {
  try {
    const { token } = req.body;
    const userId = (req as any).user?.id;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Token is required' });
    }

    // Upsert: if token exists for this user, update; otherwise create
    const existingToken = await prisma.userPushToken.findFirst({
      where: { userId, token },
    });

    if (!existingToken) {
      await prisma.userPushToken.create({
        data: {
          userId,
          token,
          deviceInfo: req.headers['user-agent'] || 'Unknown Device',
        },
      });
    }

    res.status(201).json({ success: true, message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Push subscribe error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

/**
 * @route DELETE /api/v1/push/token
 * @desc Remove FCM push token for user (opt-out)
 * @access Private (Agent+)
 */
router.delete('/token', authMiddleware, async (req, res) => {
  try {
    const { token } = req.body;
    const userId = (req as any).user?.id;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Token is required' });
    }

    await prisma.userPushToken.deleteMany({
      where: { userId, token },
    });

    res.json({ success: true, message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error('Push unsubscribe error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

/**
 * @route GET /api/v1/push/status
 * @desc Get current push subscription status for the authenticated user
 * @access Private (Agent+)
 */
router.get('/status', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user?.id;

    const tokens = await prisma.userPushToken.findMany({
      where: { userId },
      select: {
        id: true,
        deviceInfo: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      isSubscribed: tokens.length > 0,
      deviceCount: tokens.length,
      devices: tokens,
    });
  } catch (error) {
    console.error('Push status error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

/**
 * @route POST /api/v1/push/send
 * @desc Send push notification to a specific user (internal/system use)
 * @access Private (internal service calls — requires admin or system auth)
 */
router.post('/send', authMiddleware, async (req, res) => {
  try {
    const { userId, title, body, url, type, entityId, phone, lat, lng } = req.body;

    if (!userId || !title) {
      return res.status(400).json({
        success: false,
        message: 'userId and title are required',
      });
    }

    // Import PushNotificationService dynamically to avoid circular deps
    const { PushNotificationService } = await import(
      '../services/PushNotificationService.js'
    );

    await PushNotificationService.sendToUser(userId, {
      title,
      body: body || '',
      url: url || '/',
    });

    res.json({ success: true, message: 'Notification sent' });
  } catch (error) {
    console.error('Push send error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

export { router as pushRoutes };
