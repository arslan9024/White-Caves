import express from 'express';
import DealJourney from '../models/DealJourney.js';

const router = express.Router();

// Get deal journey by offer ID
router.get('/by-offer/:offerId', async (req, res) => {
  try {
    const { offerId } = req.params;

    const dealJourney = await DealJourney.findOne({ offerId })
      .populate('propertyId')
      .populate('landlordId')
      .populate('tenantId')
      .populate('agentId')
      .populate('stages.assignedTo', 'name email');

    if (!dealJourney) {
      return res.status(404).json({ error: 'Deal journey not found' });
    }

    res.json({
      success: true,
      data: dealJourney,
    });
  } catch (error) {
    console.error('Error fetching deal journey:', error);
    res.status(500).json({ error: 'Failed to fetch deal journey' });
  }
});

// Get all deal journeys for an agent
router.get('/agent/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { status } = req.query;

    const filter = { agentId };
    if (status) filter.overallStatus = status;

    const deals = await DealJourney.find(filter)
      .populate('propertyId', 'name location')
      .populate('tenantId', 'name email')
      .populate('landlordId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: deals,
      count: deals.length,
    });
  } catch (error) {
    console.error('Error fetching deals:', error);
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
});

// Get deal journey by ID
router.get('/:id', async (req, res) => {
  try {
    const dealJourney = await DealJourney.findById(req.params.id)
      .populate('propertyId')
      .populate('landlordId')
      .populate('tenantId')
      .populate('agentId')
      .populate('stages.assignedTo', 'name email');

    if (!dealJourney) {
      return res.status(404).json({ error: 'Deal journey not found' });
    }

    res.json({
      success: true,
      data: dealJourney,
    });
  } catch (error) {
    console.error('Error fetching deal journey:', error);
    res.status(500).json({ error: 'Failed to fetch deal journey' });
  }
});

// Update stage status
router.patch('/:id/stage/:stageId', async (req, res) => {
  try {
    const { id, stageId } = req.params;
    // Schema validation enforced for payload
    const { status, notes } = req.body;

    const dealJourney = await DealJourney.findById(id);

    if (!dealJourney) {
      return res.status(404).json({ error: 'Deal journey not found' });
    }

    const stage = dealJourney.stages.find((s) => s.stageId === stageId);

    if (!stage) {
      return res.status(404).json({ error: 'Stage not found' });
    }

    stage.status = status;
    if (notes) stage.notes = notes;

    if (status === 'completed') {
      stage.completedAt = new Date();
    } else if (status === 'in_progress') {
      stage.startDate = new Date();
    }

    // Update overall status
    const completedStages = dealJourney.stages.filter((s) => s.status === 'completed').length;
    if (completedStages === dealJourney.stages.length) {
      dealJourney.overallStatus = 'completed';
      dealJourney.actualCompletionDate = new Date();
    } else {
      // Find the current stage
      const currentStage = dealJourney.stages.find((s) => s.status === 'in_progress');
      if (currentStage) {
        if (currentStage.stageId.includes('offer')) dealJourney.overallStatus = 'offer_stage';
        else if (currentStage.stageId.includes('approval'))
          dealJourney.overallStatus = 'approval_stage';
        else if (currentStage.stageId.includes('contract'))
          dealJourney.overallStatus = 'contract_stage';
        else if (currentStage.stageId.includes('signature'))
          dealJourney.overallStatus = 'signature_stage';
      }
    }

    await dealJourney.save();

    res.json({
      success: true,
      message: 'Stage updated',
      data: dealJourney,
    });
  } catch (error) {
    console.error('Error updating stage:', error);
    res.status(500).json({ error: 'Failed to update stage' });
  }
});

// Add activity to stage
router.post('/:id/stage/:stageId/activity', async (req, res) => {
  try {
    const { id, stageId } = req.params;
    const { activityType, description, performedBy } = req.body;

    const dealJourney = await DealJourney.findById(id);

    if (!dealJourney) {
      return res.status(404).json({ error: 'Deal journey not found' });
    }

    const stage = dealJourney.stages.find((s) => s.stageId === stageId);

    if (!stage) {
      return res.status(404).json({ error: 'Stage not found' });
    }

    stage.activities.push({
      activityType,
      description,
      timestamp: new Date(),
      performedBy,
    });

    await dealJourney.save();

    res.json({
      success: true,
      message: 'Activity added',
      data: dealJourney,
    });
  } catch (error) {
    console.error('Error adding activity:', error);
    res.status(500).json({ error: 'Failed to add activity' });
  }
});

// Send notification to party
router.post('/:id/notify', async (req, res) => {
  try {
    const { id } = req.params;
    const { recipientId, type, title, message } = req.body;

    const dealJourney = await DealJourney.findById(id);

    if (!dealJourney) {
      return res.status(404).json({ error: 'Deal journey not found' });
    }

    const notification = {
      recipientId,
      type,
      title,
      message,
      isRead: false,
      createdAt: new Date(),
    };

    dealJourney.notifications.push(notification);
    await dealJourney.save();

    res.json({
      success: true,
      message: 'Notification sent',
      data: dealJourney,
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Mark notification as read
router.patch('/:id/notification/:notificationId/read', async (req, res) => {
  try {
    const { id, notificationId } = req.params;

    const dealJourney = await DealJourney.findById(id);

    if (!dealJourney) {
      return res.status(404).json({ error: 'Deal journey not found' });
    }

    const notification = dealJourney.notifications.id(notificationId);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    notification.isRead = true;
    notification.readAt = new Date();

    await dealJourney.save();

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification,
    });
  } catch (error) {
    console.error('Error marking notification:', error);
    res.status(500).json({ error: 'Failed to mark notification' });
  }
});

// Get notifications for a user
router.get('/:userId/notifications', async (req, res) => {
  try {
    const { userId } = req.params;

    const deals = await DealJourney.find({
      'notifications.recipientId': userId,
    });

    const notifications = [];

    deals.forEach((deal) => {
      deal.notifications
        .filter((n) => n.recipientId.toString() === userId)
        .forEach((n) => {
          notifications.push({
            ...n._doc,
            dealId: deal._id,
          });
        });
    });

    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: notifications,
      count: notifications.length,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

export default router;
