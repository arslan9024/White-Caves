/**
 * Relational Sidebar API Routes
 * 
 * 6 Main Endpoints:
 * 1. GET /departments - Get all departments
 * 2. GET /departments/:id - Get specific department
 * 3. GET /assistants - Get all assistants (with filtering)
 * 4. GET /assistants/:id - Get specific assistant
 * 5. GET /assistants/:id/contexts/:context - Get contextual data
 * 6. POST /assistants/:id/notifications - Send notification
 * 
 * Base path: /api/relational-sidebar
 */

const express = require('express');
const router = express.Router();
const departmentController = require('./controllers/departmentController');
const assistantController = require('./controllers/assistantController');
const contextController = require('./controllers/contextController');
const notificationController = require('./controllers/notificationController');
const { errorHandler } = require('./middleware/errorHandler');
const { validateRequest } = require('./middleware/validation');

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * ENDPOINT 1: GET /departments
 * Get all departments with their services
 */
router.get('/departments', 
  errorHandler(async (req, res) => {
    const departments = await departmentController.getAllDepartments();
    res.json({
      success: true,
      data: departments,
      count: departments.length,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * ENDPOINT 2: GET /departments/:id
 * Get specific department details
 */
router.get('/departments/:id',
  validateRequest('params', {
    id: { required: true, type: 'string' },
  }),
  errorHandler(async (req, res) => {
    const { id } = req.params;
    const department = await departmentController.getDepartmentById(id);
    
    if (!department) {
      return res.status(404).json({
        success: false,
        error: `Department with ID "${id}" not found`,
      });
    }

    res.json({
      success: true,
      data: department,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * ENDPOINT 3: GET /assistants
 * Get all assistants with optional filtering
 * Query params: department, service, hasPermission
 */
router.get('/assistants',
  errorHandler(async (req, res) => {
    const { department, service, hasPermission } = req.query;

    const filters = {};
    if (department) filters.department = department;
    if (service) filters.service = service;
    if (hasPermission !== undefined) {
      filters.hasPermission = hasPermission === 'true';
    }

    const assistants = await assistantController.getAssistants(filters);

    res.json({
      success: true,
      data: assistants,
      count: assistants.length,
      filters: filters,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * ENDPOINT 4: GET /assistants/:id
 * Get specific assistant details
 */
router.get('/assistants/:id',
  validateRequest('params', {
    id: { required: true, type: 'string' },
  }),
  errorHandler(async (req, res) => {
    const { id } = req.params;
    const assistant = await assistantController.getAssistantById(id);

    if (!assistant) {
      return res.status(404).json({
        success: false,
        error: `Assistant with ID "${id}" not found`,
      });
    }

    res.json({
      success: true,
      data: assistant,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * ENDPOINT 5: GET /assistants/:id/contexts/:context
 * Get contextual data for assistant (e.g., inventory for Mary)
 */
router.get('/assistants/:id/contexts/:context',
  validateRequest('params', {
    id: { required: true, type: 'string' },
    context: { required: true, type: 'string' },
  }),
  errorHandler(async (req, res) => {
    const { id, context } = req.params;

    // Validate context
    const validContexts = ['inventory', 'campaigns', 'clients', 'messages'];
    if (!validContexts.includes(context)) {
      return res.status(400).json({
        success: false,
        error: `Invalid context. Valid contexts: ${validContexts.join(', ')}`,
      });
    }

    const contextData = await contextController.getContextualData(id, context);

    if (!contextData) {
      return res.status(404).json({
        success: false,
        error: `No context data found for assistant "${id}" with context "${context}"`,
      });
    }

    res.json({
      success: true,
      data: contextData,
      assistantId: id,
      context: context,
      timestamp: new Date().toISOString(),
    });
  })
);

/**
 * ENDPOINT 6: POST /assistants/:id/notifications
 * Send notification to assistant
 */
router.post('/assistants/:id/notifications',
  validateRequest('params', {
    id: { required: true, type: 'string' },
  }),
  validateRequest('body', {
    message: { required: true, type: 'string', minLength: 1 },
    type: { required: false, type: 'string', enum: ['info', 'warning', 'error', 'success'] },
  }),
  errorHandler(async (req, res) => {
    const { id } = req.params;
    const { message, type = 'info' } = req.body;

    const notification = await notificationController.sendNotification(
      id,
      message,
      type
    );

    if (!notification.success) {
      return res.status(400).json({
        success: false,
        error: notification.error,
      });
    }

    res.status(201).json({
      success: true,
      data: notification.data,
      timestamp: new Date().toISOString(),
    });
  })
);

module.exports = router;
