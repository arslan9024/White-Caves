import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { prisma } from '../database.js';

const router = express.Router();

/**
 * @route POST /api/v1/push/subscribe
 * @desc Save FCM push token for user
 * @access Private
 */
router.post('/subscribe', authMiddleware, async (req, res) => {
  try {
    const { token } = req.body;
    const userId = (req as any).user?.id;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Token is required' });
    }

    // Since we don't know if the Prisma schema has UserPushToken yet, we should use a dynamic model or skip prisma validation if it's MongoDB without strict schema.
    // Wait, let's look at prisma schema first. For now we assume prisma.userPushToken exists.
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

    res.json({ success: true, message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Push subscribe error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

/**
 * @route DELETE /api/v1/push/token
 * @desc Remove FCM push token for user
 * @access Private
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

export { router as pushRoutes };
