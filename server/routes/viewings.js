import express from 'express';
import Viewing from '../models/Viewing.js';
import Lead from '../models/Lead.js';

const router = express.Router();

// Create a viewing appointment
router.post('/', async (req, res) => {
  try {
    const {
      leadId,
      propertyId,
      agentId,
      scheduledDate,
      duration = 30,
      notes,
      attendees
    } = req.body;

    const viewing = new Viewing({
      leadId,
      propertyId,
      agentId,
      scheduledDate,
      duration,
      notes,
      attendees: attendees || [
        { type: 'tenant', name: '', confirmed: false },
        { type: 'landlord', name: '', confirmed: false }
      ]
    });

    await viewing.save();

    // Update lead timeline
    if (leadId) {
      await Lead.findByIdAndUpdate(
        leadId,
        {
          $set: { stage: 'viewing' },
          $push: {
            timeline: {
              event: 'Viewing Scheduled',
              date: new Date(),
              details: `Viewing scheduled for ${new Date(scheduledDate).toLocaleDateString()}`
            }
          }
        }
      );
    }

    res.status(201).json(viewing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create viewing' });
  }
});

// Get viewing details
router.get('/:viewingId', async (req, res) => {
  try {
    const viewing = await Viewing.findById(req.params.viewingId)
      .populate('leadId')
      .populate('propertyId')
      .populate('agentId');

    if (!viewing) {
      return res.status(404).json({ error: 'Viewing not found' });
    }

    res.json(viewing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch viewing' });
  }
});

// Update viewing status
router.patch('/:viewingId/status', async (req, res) => {
  try {
    const { viewingId } = req.params;
    const { status, notes } = req.body;

    const viewing = await Viewing.findByIdAndUpdate(
      viewingId,
      {
        $set: { status, notes }
      },
      { new: true }
    );

    if (!viewing) {
      return res.status(404).json({ error: 'Viewing not found' });
    }

    res.json(viewing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update viewing' });
  }
});

// Submit viewing feedback
router.post('/:viewingId/feedback', async (req, res) => {
  try {
    const { viewingId } = req.params;
    const { rating, tenantImpressions, agentNotes, followUpRequired, followUpDate } = req.body;

    const viewing = await Viewing.findByIdAndUpdate(
      viewingId,
      {
        $set: {
          status: 'completed',
          'feedback.rating': rating,
          'feedback.tenantImpressions': tenantImpressions,
          'feedback.agentNotes': agentNotes,
          'feedback.followUpRequired': followUpRequired,
          'feedback.followUpDate': followUpDate
        }
      },
      { new: true }
    );

    if (!viewing) {
      return res.status(404).json({ error: 'Viewing not found' });
    }

    res.json(viewing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Get viewing reminders (for cron job / Bull queue)
router.get('/reminders/pending', async (req, res) => {
  try {
    // Get viewings scheduled for tomorrow that haven't had reminders sent
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const nextDay = new Date(tomorrow);
    nextDay.setDate(nextDay.getDate() + 1);

    const viewings = await Viewing.find({
      scheduledDate: { $gte: tomorrow, $lt: nextDay },
      'reminderSent.email': false
    })
      .populate('leadId', 'name email phone')
      .populate('agentId', 'name email phone');

    res.json(viewings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reminders' });
  }
});

// Mark reminder as sent
router.patch('/:viewingId/reminder-sent', async (req, res) => {
  try {
    const { viewingId } = req.params;
    const { type = 'email' } = req.body; // email or sms

    const viewing = await Viewing.findByIdAndUpdate(
      viewingId,
      {
        $set: {
          [`reminderSent.${type}`]: true,
          'reminderSent.sentAt': new Date()
        }
      },
      { new: true }
    );

    if (!viewing) {
      return res.status(404).json({ error: 'Viewing not found' });
    }

    res.json(viewing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to mark reminder as sent' });
  }
});

// Get agent's viewings
router.get('/agent/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { status, startDate, endDate } = req.query;

    const query = { agentId };
    if (status) query.status = status;
    if (startDate || endDate) {
      query.scheduledDate = {};
      if (startDate) query.scheduledDate.$gte = new Date(startDate);
      if (endDate) query.scheduledDate.$lte = new Date(endDate);
    }

    const viewings = await Viewing.find(query)
      .populate('leadId', 'name email phone')
      .populate('propertyId', 'title area image')
      .sort({ scheduledDate: 1 });

    res.json(viewings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch viewings' });
  }
});

export default router;
