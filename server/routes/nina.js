import express from 'express';
import NinaServices from '../services/nina/index.js';

const router = express.Router();
const { ProjectService, PhoneNumberService, CampaignService, MessageTemplates, RateLimiter, BroadcastManager } = NinaServices;

router.get('/projects', (req, res) => {
  try {
    const { category } = req.query;
    let projects;
    
    if (category) {
      projects = ProjectService.getProjectsByCategory(category);
    } else {
      projects = ProjectService.getAllProjects();
    }
    
    res.json({
      success: true,
      projects,
      stats: ProjectService.getProjectStats()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/projects/:id', (req, res) => {
  try {
    const project = ProjectService.getProjectById(parseInt(req.params.id));
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/projects/:id/summary', async (req, res) => {
  try {
    const summary = await CampaignService.getProjectSummary(parseInt(req.params.id));
    res.json({ success: true, summary });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/phone/validate', (req, res) => {
  try {
    const { numbers } = req.body;
    const results = numbers.map(n => PhoneNumberService.validateAndFormat(n));
    res.json({
      success: true,
      results,
      summary: {
        total: results.length,
        valid: results.filter(r => r.valid).length,
        invalid: results.filter(r => !r.valid).length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/phone/networks', (req, res) => {
  res.json({
    success: true,
    uaeNetworks: PhoneNumberService.getUAENetworks(),
    countryCodes: PhoneNumberService.getCountryCodes()
  });
});

router.get('/campaigns', (req, res) => {
  try {
    const active = CampaignService.getActiveCampaigns();
    const history = CampaignService.getCampaignHistory();
    const stats = CampaignService.getStats();
    
    res.json({
      success: true,
      active,
      history,
      stats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/campaigns', async (req, res) => {
  try {
    const { projectId, name, message, settings } = req.body;
    const campaign = await CampaignService.createCampaign({
      projectId,
      name,
      message,
      settings
    });
    res.json({ success: true, campaign });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/campaigns/:id', (req, res) => {
  try {
    const campaign = CampaignService.getCampaign(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, error: 'Campaign not found' });
    }
    res.json({ success: true, campaign });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/campaigns/:id/pause', (req, res) => {
  try {
    const success = CampaignService.pauseCampaign(req.params.id);
    res.json({ success, message: success ? 'Campaign paused' : 'Could not pause campaign' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/campaigns/:id/resume', (req, res) => {
  try {
    const success = CampaignService.resumeCampaign(req.params.id);
    res.json({ success, message: success ? 'Campaign resumed' : 'Could not resume campaign' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/campaigns/:id/cancel', (req, res) => {
  try {
    const success = CampaignService.cancelCampaign(req.params.id);
    res.json({ success, message: success ? 'Campaign cancelled' : 'Could not cancel campaign' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/blocklist', (req, res) => {
  try {
    const blocklist = CampaignService.getBlocklist();
    res.json({
      success: true,
      blocklist,
      count: blocklist.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/blocklist/add', async (req, res) => {
  try {
    const { numbers } = req.body;
    const added = await CampaignService.addToBlocklist(numbers);
    res.json({
      success: true,
      added,
      message: `Added ${added} numbers to blocklist`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/blocklist/remove', async (req, res) => {
  try {
    const { numbers } = req.body;
    const removed = await CampaignService.removeFromBlocklist(numbers);
    res.json({
      success: true,
      removed,
      message: `Removed ${removed} numbers from blocklist`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/blocklist/refresh', async (req, res) => {
  try {
    const count = await CampaignService.refreshBlocklist();
    res.json({
      success: true,
      count,
      message: `Blocklist refreshed with ${count} numbers`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/templates', (req, res) => {
  try {
    const templates = MessageTemplates.getAllTemplates();
    const categories = MessageTemplates.getTemplateCategories();
    res.json({
      success: true,
      templates,
      categories
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/templates/:category', (req, res) => {
  try {
    const templates = MessageTemplates.getTemplatesInCategory(req.params.category);
    res.json({
      success: true,
      category: req.params.category,
      templates
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/templates/greeting/current', (req, res) => {
  try {
    const language = req.query.lang || 'en';
    const bilingual = req.query.bilingual === 'true';
    
    const greeting = bilingual 
      ? MessageTemplates.getBilingualGreeting()
      : MessageTemplates.getGreeting(language);
    
    res.json({
      success: true,
      greeting,
      language: bilingual ? 'bilingual' : language
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/templates/fill', (req, res) => {
  try {
    const { category, key, variables } = req.body;
    const template = MessageTemplates.getTemplate(category, key);
    
    if (!template) {
      return res.status(404).json({ success: false, error: 'Template not found' });
    }
    
    const filled = MessageTemplates.fillTemplate(template, variables);
    res.json({
      success: true,
      original: template,
      filled,
      variables
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/schedule', (req, res) => {
  try {
    const info = RateLimiter.getScheduleInfo();
    res.json({ success: true, schedule: info });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/stats', (req, res) => {
  try {
    const stats = {
      campaigns: BroadcastManager.getStats(),
      projects: ProjectService.getProjectStats(),
      blocklist: CampaignService.getBlocklist().length,
      schedule: RateLimiter.getScheduleInfo()
    };
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/initialize', async (req, res) => {
  try {
    const success = await CampaignService.initialize();
    res.json({
      success,
      message: success ? 'Nina services initialized' : 'Failed to initialize'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
