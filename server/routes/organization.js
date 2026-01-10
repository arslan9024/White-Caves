import express from 'express';
import Department from '../models/Department.js';
import AIAssistant from '../models/AIAssistant.js';
import Team from '../models/Team.js';
import Service from '../models/Service.js';

const router = express.Router();

router.get('/departments', async (req, res) => {
  try {
    const { status, search, populate } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (search) {
      query.$text = { $search: search };
    }
    
    let departments = Department.find(query).sort({ order: 1, name: 1 });
    
    if (populate === 'true') {
      departments = departments
        .populate('assistants', 'name role status color')
        .populate('teams', 'name lead.name size.current')
        .populate('services', 'name category status');
    }
    
    const results = await departments.exec();
    res.json({ success: true, data: results, count: results.length });
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/departments/:id', async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate('assistants')
      .populate('teams')
      .populate('services');
    
    if (!department) {
      return res.status(404).json({ success: false, error: 'Department not found' });
    }
    
    res.json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/departments', async (req, res) => {
  try {
    const department = new Department(req.body);
    await department.save();
    res.status(201).json({ success: true, data: department });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put('/departments/:id', async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!department) {
      return res.status(404).json({ success: false, error: 'Department not found' });
    }
    
    res.json({ success: true, data: department });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/assistants', async (req, res) => {
  try {
    const { department, status, search, accessLevel } = req.query;
    let query = { isActive: true };
    
    if (department) query.department = department;
    if (status) query.status = status;
    if (accessLevel) query.accessLevel = accessLevel;
    if (search) {
      query.$text = { $search: search };
    }
    
    const assistants = await AIAssistant.find(query)
      .populate('department', 'name code color')
      .populate('reportsTo', 'name role')
      .sort({ order: 1, name: 1 });
    
    res.json({ success: true, data: assistants, count: assistants.length });
  } catch (error) {
    console.error('Error fetching assistants:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/assistants/:id', async (req, res) => {
  try {
    const assistant = await AIAssistant.findById(req.params.id)
      .populate('department')
      .populate('reportsTo')
      .populate('subordinates', 'name role status');
    
    if (!assistant) {
      return res.status(404).json({ success: false, error: 'Assistant not found' });
    }
    
    res.json({ success: true, data: assistant });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/assistants/code/:code', async (req, res) => {
  try {
    const assistant = await AIAssistant.findOne({ code: req.params.code.toUpperCase() })
      .populate('department')
      .populate('reportsTo')
      .populate('subordinates', 'name role status');
    
    if (!assistant) {
      return res.status(404).json({ success: false, error: 'Assistant not found' });
    }
    
    res.json({ success: true, data: assistant });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/assistants/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const assistant = await AIAssistant.findByIdAndUpdate(
      req.params.id,
      { status, 'health.lastCheck': new Date() },
      { new: true }
    );
    
    if (!assistant) {
      return res.status(404).json({ success: false, error: 'Assistant not found' });
    }
    
    res.json({ success: true, data: assistant });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/teams', async (req, res) => {
  try {
    const { department, status, search } = req.query;
    let query = {};
    
    if (department) query.department = department;
    if (status) query.status = status;
    if (search) {
      query.$text = { $search: search };
    }
    
    const teams = await Team.find(query)
      .populate('department', 'name code color')
      .populate('aiAssistant', 'name role status')
      .sort({ name: 1 });
    
    res.json({ success: true, data: teams, count: teams.length });
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/teams/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('department')
      .populate('aiAssistant');
    
    if (!team) {
      return res.status(404).json({ success: false, error: 'Team not found' });
    }
    
    res.json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/services', async (req, res) => {
  try {
    const { category, department, status, search, targetAudience, isPublic } = req.query;
    let query = {};
    
    if (category) query.category = category;
    if (department) query.department = department;
    if (status) query.status = status;
    if (targetAudience) query.targetAudience = targetAudience;
    if (isPublic !== undefined) query.isPublic = isPublic === 'true';
    if (search) {
      query.$text = { $search: search };
    }
    
    const services = await Service.find(query)
      .populate('department', 'name code color')
      .populate('aiAssistant', 'name role status')
      .sort({ order: 1, category: 1, name: 1 });
    
    res.json({ success: true, data: services, count: services.length });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/services/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('department')
      .populate('aiAssistant')
      .populate('workflow.stages.automatedBy', 'name role')
      .populate('relatedServices', 'name category status');
    
    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }
    
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/services/category/:category', async (req, res) => {
  try {
    const services = await Service.find({ 
      category: req.params.category,
      status: 'active'
    })
      .populate('department', 'name code')
      .populate('aiAssistant', 'name role')
      .sort({ order: 1, name: 1 });
    
    res.json({ success: true, data: services, count: services.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q, type } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({ success: false, error: 'Search query must be at least 2 characters' });
    }
    
    const searchQuery = { $text: { $search: q } };
    const results = {};
    
    if (!type || type === 'all' || type === 'departments') {
      results.departments = await Department.find(searchQuery)
        .select('name code description color status')
        .limit(10);
    }
    
    if (!type || type === 'all' || type === 'assistants') {
      results.assistants = await AIAssistant.find(searchQuery)
        .populate('department', 'name code')
        .select('name role department status color')
        .limit(10);
    }
    
    if (!type || type === 'all' || type === 'teams') {
      results.teams = await Team.find(searchQuery)
        .populate('department', 'name code')
        .select('name department lead.name status')
        .limit(10);
    }
    
    if (!type || type === 'all' || type === 'services') {
      results.services = await Service.find(searchQuery)
        .populate('department', 'name code')
        .select('name category department status icon')
        .limit(10);
    }
    
    const totalCount = Object.values(results).reduce((sum, arr) => sum + (arr?.length || 0), 0);
    
    res.json({ success: true, data: results, count: totalCount, query: q });
  } catch (error) {
    console.error('Error searching organization:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const [
      departmentCount,
      assistantCount,
      teamCount,
      serviceCount,
      onlineAssistants,
      activeServices
    ] = await Promise.all([
      Department.countDocuments({ status: 'active' }),
      AIAssistant.countDocuments({ isActive: true }),
      Team.countDocuments({ status: 'active' }),
      Service.countDocuments({ status: 'active' }),
      AIAssistant.countDocuments({ status: 'online', isActive: true }),
      Service.countDocuments({ status: 'active', isPublic: true })
    ]);
    
    res.json({
      success: true,
      data: {
        departments: departmentCount,
        assistants: assistantCount,
        teams: teamCount,
        services: serviceCount,
        onlineAssistants,
        activeServices
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
