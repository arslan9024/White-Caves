const express = require('express');
const router = express.Router();
const PropertyInventory = require('../models/PropertyInventory');
const InventoryProperty = require('../models/InventoryProperty');
const FilterService = require('../services/FilterService');
const AnalyticsService = require('../services/AnalyticsService');

// Create or get property inventory entry
router.post('/:propertyId/inventory', async (req, res) => {
  try {
    const { propertyId } = req.params;

    let inventory = await PropertyInventory.findOne({ propertyId });

    if (!inventory) {
      inventory = new PropertyInventory({
        propertyId,
        status: 'available',
        visibleTo: {
          mary: true,
        },
      });
      await inventory.save();
    }

    res.json({
      success: true,
      data: inventory,
    });
  } catch (error) {
    console.error('Error managing inventory:', error);
    res.status(500).json({ error: 'Failed to manage inventory' });
  }
});

// Update property status for tenancy cycle (visible to Mary)
router.patch('/:propertyId/status', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { status, visibleTo, notes } = req.body;

    if (
      !status ||
      ![
        'available',
        'offer_in_progress',
        'offer_approved',
        'contract_generation',
        'contract_signature',
        'signed',
        'occupied',
        'maintenance',
        'inspection',
        'ready_for_leasing',
        'archived',
      ].includes(status)
    ) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    let inventory = await PropertyInventory.findOne({ propertyId });

    if (!inventory) {
      inventory = new PropertyInventory({
        propertyId,
        status,
        visibleTo: visibleTo || {
          mary: true,
        },
      });
    } else {
      inventory.status = status;
      if (visibleTo) {
        inventory.visibleTo = {
          ...inventory.visibleTo,
          ...visibleTo,
        };
      }
    }

    if (notes) {
      inventory.notes = notes;
    }

    // Auto-update availability
    if (status === 'available' || status === 'ready_for_leasing') {
      inventory.isAvailable = true;
    } else if (['occupied', 'archived', 'maintenance'].includes(status)) {
      inventory.isAvailable = false;
    }

    await inventory.save();

    res.json({
      success: true,
      message: 'Property status updated',
      data: inventory,
    });
  } catch (error) {
    console.error('Error updating property status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Grant property access to agent
router.post('/:propertyId/grant-access', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { agentId, accessLevel, grantedBy } = req.body;

    if (!agentId || !accessLevel) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let inventory = await PropertyInventory.findOne({ propertyId });

    if (!inventory) {
      inventory = new PropertyInventory({
        propertyId,
        assignedAgents: [
          {
            agentId,
            accessLevel,
            grantedAt: new Date(),
            grantedBy,
          },
        ],
      });
    } else {
      // Check if agent already has access
      const existingAgent = inventory.assignedAgents.find(
        (a) => a.agentId.toString() === agentId
      );

      if (existingAgent) {
        existingAgent.accessLevel = accessLevel;
      } else {
        inventory.assignedAgents.push({
          agentId,
          accessLevel,
          grantedAt: new Date(),
          grantedBy,
        });
      }
    }

    await inventory.save();

    res.json({
      success: true,
      message: 'Property access granted',
      data: inventory,
    });
  } catch (error) {
    console.error('Error granting access:', error);
    res.status(500).json({ error: 'Failed to grant access' });
  }
});

// Get properties visible to Mary
router.get('/mary/visible-properties', async (req, res) => {
  try {
    const properties = await PropertyInventory.find({
      'visibleTo.mary': true,
    })
      .populate('propertyId')
      .populate('currentOfferId')
      .populate('currentContractId')
      .populate('assignedAgents.agentId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: properties,
      count: properties.length,
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Get agent's accessible properties
router.get('/agent/:agentId/properties', async (req, res) => {
  try {
    const { agentId } = req.params;

    const properties = await PropertyInventory.find({
      'assignedAgents.agentId': agentId,
    })
      .populate('propertyId')
      .populate('currentOfferId')
      .populate('currentTenantId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: properties,
      count: properties.length,
    });
  } catch (error) {
    console.error('Error fetching agent properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Get property inventory by property ID
router.get('/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;

    const inventory = await PropertyInventory.findOne({ propertyId })
      .populate('propertyId')
      .populate('currentOfferId')
      .populate('currentContractId')
      .populate('currentTenantId')
      .populate('assignedAgents.agentId');

    if (!inventory) {
      return res.status(404).json({ error: 'Property inventory not found' });
    }

    res.json({
      success: true,
      data: inventory,
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// Dashboard: Get area summaries with counts
router.get('/dashboard/areas-summary', async (req, res) => {
  try {
    const areaSummary = await InventoryProperty.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$area',
          total: { $sum: 1 },
          available: {
            $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] },
          },
          rented: {
            $sum: { $cond: [{ $eq: ['$status', 'rented'] }, 1, 0] },
          },
          sold: {
            $sum: { $cond: [{ $eq: ['$status', 'sold'] }, 1, 0] },
          },
          reserved: {
            $sum: { $cond: [{ $eq: ['$status', 'reserved'] }, 1, 0] },
          },
        },
      },
      {
        $addFields: {
          availabilityRate: {
            $multiply: [
              { $divide: ['$available', '$total'] },
              100,
            ],
          },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.json({
      success: true,
      data: areaSummary,
      count: areaSummary.length,
    });
  } catch (error) {
    console.error('Error fetching area summary:', error);
    res.status(500).json({ error: 'Failed to fetch area summary' });
  }
});

// Dashboard: Get properties by area with pagination and filters
router.get('/dashboard/properties-by-area/:area', async (req, res) => {
  try {
    const { area } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';

    // Extract and validate filters
    const filters = FilterService.extractFiltersFromQuery(req.query);
    const validation = FilterService.validateFilters(filters);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid filter parameters',
        details: validation.errors,
      });
    }

    // Build MongoDB query
    let mongoQuery = FilterService.buildMongoQuery(filters);
    mongoQuery.area = area; // Add area filter
    mongoQuery.isActive = true;

    // Get pagination and sorting
    const pagination = FilterService.getPagination(page, limit);
    const sort = FilterService.getSort(sortBy, sortOrder);

    // Execute query
    const properties = await InventoryProperty.find(mongoQuery)
      .populate('owners', 'name phone email')
      .populate('primaryOwner', 'name phone email')
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.limit);

    const total = await InventoryProperty.countDocuments(mongoQuery);

    // Get corresponding inventory data for each property
    const inventoryData = await PropertyInventory.find({
      propertyId: { $in: properties.map((p) => p._id) },
    }).populate('assignedAgents.agentId', 'name email');

    // Merge inventory data into properties
    const enrichedProperties = properties.map((prop) => {
      const inv = inventoryData.find(
        (i) => i.propertyId.toString() === prop._id.toString()
      );
      return {
        ...prop.toObject(),
        inventory: inv || null,
      };
    });

    // Build response with filter metadata
    const response = FilterService.buildResponse(
      enrichedProperties,
      filters,
      pagination,
      total
    );

    res.json(response);
  } catch (error) {
    console.error('Error fetching properties by area:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Dashboard: Advanced search with global filters (all areas)
router.get('/dashboard/search', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';

    // Extract and validate filters
    const filters = FilterService.extractFiltersFromQuery(req.query);
    const validation = FilterService.validateFilters(filters);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid filter parameters',
        details: validation.errors,
      });
    }

    // Build MongoDB query
    let mongoQuery = FilterService.buildMongoQuery(filters);
    mongoQuery.isActive = true;

    // Add specific areas filter if provided
    if (filters.areas && filters.areas.length > 0) {
      mongoQuery.area = { $in: filters.areas };
    }

    // Get pagination and sorting
    const pagination = FilterService.getPagination(page, limit);
    const sort = FilterService.getSort(sortBy, sortOrder);

    // Execute query
    const properties = await InventoryProperty.find(mongoQuery)
      .populate('owners', 'name phone email')
      .populate('primaryOwner', 'name phone email')
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.limit);

    const total = await InventoryProperty.countDocuments(mongoQuery);

    // Get corresponding inventory data
    const inventoryData = await PropertyInventory.find({
      propertyId: { $in: properties.map((p) => p._id) },
    }).populate('assignedAgents.agentId', 'name email');

    // Merge inventory data
    const enrichedProperties = properties.map((prop) => {
      const inv = inventoryData.find(
        (i) => i.propertyId.toString() === prop._id.toString()
      );
      return {
        ...prop.toObject(),
        inventory: inv || null,
      };
    });

    // Build response with filter metadata
    const response = FilterService.buildResponse(
      enrichedProperties,
      filters,
      pagination,
      total
    );

    res.json(response);
  } catch (error) {
    console.error('Error searching properties:', error);
    res.status(500).json({ error: 'Failed to search properties' });
  }
});

// Dashboard: Get overall dashboard statistics
router.get('/dashboard/stats', async (req, res) => {
  try {
    // Get total count and status breakdown
    const statusBreakdown = await InventoryProperty.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get PropertyInventory tenancy cycle breakdown
    const tenancyBreakdown = await PropertyInventory.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get total counts
    const totalProperties = await InventoryProperty.countDocuments({
      isActive: true,
    });

    const totalInventory = await PropertyInventory.countDocuments();

    // Calculate availability rate
    const availableCount = statusBreakdown.find(
      (s) => s._id === 'available'
    )?.count || 0;
    const rentedCount = statusBreakdown.find((s) => s._id === 'rented')?.count || 0;
    const occupancyRate = ((rentedCount / totalProperties) * 100).toFixed(1);
    const availabilityRate = (
      ((availableCount / totalProperties) * 100).toFixed(1)
    );

    // Count Mary's visible properties
    const maryVisibleCount = await PropertyInventory.countDocuments({
      'visibleTo.mary': true,
    });

    // Get area distribution
    const areaDistribution = await InventoryProperty.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$area',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Count properties with assigned agents
    const withAgentsCount = await PropertyInventory.countDocuments({
      'assignedAgents.0': { $exists: true },
    });

    res.json({
      success: true,
      data: {
        totalProperties,
        totalInventory,
        maryVisibleCount,
        availabilityRate: parseFloat(availabilityRate),
        occupancyRate: parseFloat(occupancyRate),
        statusBreakdown,
        tenancyBreakdown,
        areaDistribution,
        agentAssignmentCount: withAgentsCount,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// ============================================================
// ANALYTICS ENDPOINTS
// ============================================================

// GET /api/property-inventory/analytics/dashboard
// Get all dashboard analytics at once
router.get('/analytics/dashboard', async (req, res) => {
  try {
    const stats = await AnalyticsService.getOverallStats();

    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching analytics dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics dashboard'
    });
  }
});

// GET /api/property-inventory/analytics/stats
// Get key metrics only
router.get('/analytics/stats', async (req, res) => {
  try {
    const stats = await AnalyticsService.getKeyMetrics();

    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching key metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch key metrics'
    });
  }
});

// GET /api/property-inventory/analytics/distribution
// Get property distribution data
router.get('/analytics/distribution', async (req, res) => {
  try {
    const distribution = await AnalyticsService.getPropertyDistribution();

    res.json({
      success: true,
      data: distribution,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching property distribution:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch property distribution'
    });
  }
});

// GET /api/property-inventory/analytics/pricing
// Get pricing analytics
router.get('/analytics/pricing', async (req, res) => {
  try {
    const pricing = await AnalyticsService.getPricingAnalytics();

    res.json({
      success: true,
      data: pricing,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching pricing analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pricing analytics'
    });
  }
});

// GET /api/property-inventory/analytics/occupancy
// Get occupancy metrics
router.get('/analytics/occupancy', async (req, res) => {
  try {
    const occupancy = await AnalyticsService.getOccupancyMetrics();

    res.json({
      success: true,
      data: occupancy,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching occupancy metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch occupancy metrics'
    });
  }
});

// GET /api/property-inventory/analytics/areas
// Get analytics for all areas
router.get('/analytics/areas', async (req, res) => {
  try {
    const areaAnalytics = await AnalyticsService.getAllAreaAnalytics();

    res.json({
      success: true,
      data: areaAnalytics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching area analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch area analytics'
    });
  }
});

// GET /api/property-inventory/analytics/area/:area
// Get analytics for a specific area
router.get('/analytics/area/:area', async (req, res) => {
  try {
    const { area } = req.params;
    const areaAnalytics = await AnalyticsService.getAreaAnalytics(area);

    res.json({
      success: true,
      data: areaAnalytics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching area analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch area analytics'
    });
  }
});

// GET /api/property-inventory/analytics/trends
// Get trend data over time
router.get('/analytics/trends', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const trends = await AnalyticsService.getTrendData(startDate, endDate);

    res.json({
      success: true,
      data: trends,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching trend data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trend data'
    });
  }
});

// GET /api/property-inventory/analytics/export
// Export all dashboard data
router.get('/analytics/export', async (req, res) => {
  try {
    const data = await AnalyticsService.exportDashboardData();

    res.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error exporting dashboard data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export dashboard data'
    });
  }
});

module.exports = router;
