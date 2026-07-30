/**
 * Relational Sidebar API Routes (ES6 Implementation)
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

import express from 'express';

const router = express.Router();

// ============================================
// MOCK DATA
// ============================================

const departments = [
  {
    id: 'dept-sales',
    name: 'Sales',
    description: 'Sales Department',
    services: ['property-search', 'offers', 'contracts'],
  },
  {
    id: 'dept-inventory',
    name: 'Inventory',
    description: 'Property Inventory Management',
    services: ['property-management', 'listings'],
  },
  {
    id: 'dept-admin',
    name: 'Administration',
    description: 'Admin Operations',
    services: ['reporting', 'users', 'settings'],
  },
];

const assistants = [
  {
    id: 'nina',
    name: 'Nina',
    title: 'Sales Agent',
    department: 'dept-sales',
    hasPermission: true,
    features: ['deals', 'offers', 'clients'],
  },
  {
    id: 'linda',
    name: 'Linda',
    title: 'Contracts Manager',
    department: 'dept-sales',
    hasPermission: true,
    features: ['contracts', 'esignature', 'documents'],
  },
  {
    id: 'mary',
    name: 'Mary',
    title: 'Inventory Manager',
    department: 'dept-inventory',
    hasPermission: true,
    features: ['inventory', 'listings', 'property-details'],
  },
];

const contextData = {
  'mary-inventory': {
    assistantId: 'mary',
    context: 'inventory',
    data: {
      totalProperties: 1250,
      activeListing: 980,
      soldProperties: 270,
      recentListings: [
        { id: 'prop-001', address: 'Downtown Dubai Penthouse', price: 5000000 },
        { id: 'prop-002', address: 'Marina Apartment', price: 1200000 },
      ],
    },
  },
};

// ============================================
// ROUTES
// ============================================

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
router.get('/departments', (req, res) => {
  try {
    res.json({
      success: true,
      data: departments,
      count: departments.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * ENDPOINT 2: GET /departments/:id
 * Get specific department details
 */
router.get('/departments/:id', (req, res) => {
  try {
    const { id } = req.params;
    const department = departments.find((d) => d.id === id);

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
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * ENDPOINT 3: GET /assistants
 * Get all assistants with optional filtering
 * Query params: department, feature, hasPermission
 */
router.get('/assistants', (req, res) => {
  try {
    const { department, feature, hasPermission } = req.query;

    let filtered = [...assistants];

    if (department) {
      filtered = filtered.filter((a) => a.department === department);
    }

    if (feature) {
      filtered = filtered.filter((a) => a.features.includes(feature));
    }

    if (hasPermission !== undefined) {
      const hasPerms = hasPermission === 'true';
      filtered = filtered.filter((a) => a.hasPermission === hasPerms);
    }

    res.json({
      success: true,
      data: filtered,
      count: filtered.length,
      filters: { department, feature, hasPermission },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * ENDPOINT 4: GET /assistants/:id
 * Get specific assistant details
 */
router.get('/assistants/:id', (req, res) => {
  try {
    const { id } = req.params;
    const assistant = assistants.find((a) => a.id === id);

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
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * ENDPOINT 5: GET /assistants/:id/contexts/:context
 * Get contextual data for assistant (e.g., inventory for Mary)
 */
router.get('/assistants/:id/contexts/:context', (req, res) => {
  try {
    const { id, context } = req.params;

    // Validate context
    const validContexts = ['inventory', 'campaigns', 'clients', 'messages'];
    if (!validContexts.includes(context)) {
      return res.status(400).json({
        success: false,
        error: `Invalid context. Valid contexts: ${validContexts.join(', ')}`,
      });
    }

    // Verify assistant exists
    const assistant = assistants.find((a) => a.id === id);
    if (!assistant) {
      return res.status(404).json({
        success: false,
        error: `Assistant with ID "${id}" not found`,
      });
    }

    // Get contextual data
    const key = `${id}-${context}`;
    const data = contextData[key];

    if (!data) {
      return res.status(404).json({
        success: false,
        error: `No context data found for assistant "${id}" with context "${context}"`,
      });
    }

    res.json({
      success: true,
      data: data,
      assistantId: id,
      context: context,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * ENDPOINT 6: POST /assistants/:id/notifications
 * Send notification to assistant
 */
router.post('/assistants/:id/notifications', (req, res) => {
  try {
    const { id } = req.params;
    // Schema validation enforced for payload
    const { message, type = 'info' } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required',
      });
    }

    const validTypes = ['info', 'warning', 'error', 'success'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: `Invalid type. Valid types: ${validTypes.join(', ')}`,
      });
    }

    // Verify assistant exists
    const assistant = assistants.find((a) => a.id === id);
    if (!assistant) {
      return res.status(404).json({
        success: false,
        error: `Assistant with ID "${id}" not found`,
      });
    }

    // Create notification
    const notification = {
      id: `notif-${Date.now()}`,
      assistantId: id,
      message,
      type,
      createdAt: new Date().toISOString(),
      read: false,
    };

    res.status(201).json({
      success: true,
      data: notification,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
