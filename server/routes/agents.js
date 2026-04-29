import express from 'express';
import Agent from '../models/Agent.js';
import Viewing from '../models/Viewing.js';
import Property from '../models/Property.js';

const router = express.Router();

// Get agent by ID
router.get('/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    const agent = await Agent.findById(agentId);

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    res.json(agent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch agent' });
  }
});

// Get agent calendar availability
router.get('/:agentId/calendar', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { date } = req.query; // YYYY-MM-DD format

    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Get scheduled viewings for the date
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const viewings = await Viewing.find({
      agentId,
      scheduledDate: { $gte: startDate, $lt: endDate }
    }).select('scheduledDate duration status');

    // Get availability for the day
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][
      startDate.getDay()
    ];
    const dayAvailability = agent.availability[dayOfWeek];

    res.json({
      agentName: agent.name,
      date,
      dayOfWeek,
      availability: dayAvailability,
      bookedSlots: viewings,
      responseTime: agent.responseTime
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch calendar' });
  }
});

// Get agent profile page data
router.get('/:agentId/profile', async (req, res) => {
  try {
    const { agentId } = req.params;
    const agent = await Agent.findById(agentId);

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Get agent's listed properties
    const properties = await Property.find({ agentId })
      .select('title price image area bedrooms bathrooms')
      .limit(6);

    // Get agent's recent viewings/activity
    const recentActivity = await Viewing.find({ agentId })
      .populate('leadId', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json({
      agent,
      properties,
      recentActivity
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch agent profile' });
  }
});

// Get agent stats for dashboard
router.get('/:agentId/stats', async (req, res) => {
  try {
    const { agentId } = req.params;
    const agent = await Agent.findById(agentId);

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Calculate recent stats
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentViewings = await Viewing.countDocuments({
      agentId,
      createdAt: { $gte: thirtyDaysAgo }
    });

    const completedViewings = await Viewing.countDocuments({
      agentId,
      status: 'completed',
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.json({
      ...agent.stats,
      recentViewings,
      completedViewings,
      completionRate:
        recentViewings > 0 ? Math.round((completedViewings / recentViewings) * 100) : 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch agent stats' });
  }
});

// List all agents (for filtering/searching)
router.get('/', async (req, res) => {
  try {
    const { status = 'active', limit = 20, skip = 0 } = req.query;

    const agents = await Agent.find({ status })
      .select('name avatar email phone rating reviews specialization responseTime')
      .sort({ rating: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Agent.countDocuments({ status });

    res.json({
      agents,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

export default router;
