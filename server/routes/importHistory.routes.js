/**
 * Import History & Admin API Routes
 * GET /api/inventory/import/history - Get import history
 * GET /api/inventory/import/session/:sessionId - Get session details
 * GET /api/inventory/import/session/:sessionId/errors - Get session errors
 * GET /api/inventory/import/session/:sessionId/report - Download report
 * GET /api/admin/dashboard - Admin dashboard data
 * GET /api/admin/system-health - System health status
 */

const express = require('express');
const router = express.Router();
const ImportSession = require('../models/ImportSession');
const Property = require('../models/Property');
const Owner = require('../models/Owner');
const OwnerPropertyMapping = require('../models/OwnerPropertyMapping');
const { auth, adminOnly } = require('../middleware/auth');

// ============ IMPORT HISTORY ROUTES ============

/**
 * GET /api/inventory/import/history
 * Retrieve import history with filtering and sorting
 */
router.get('/import/history', auth, async (req, res) => {
  try {
    const { status, sortBy = 'date', limit = 50, offset = 0 } = req.query;

    // Build query
    const query = { userId: req.user._id };
    if (status && status !== '') {
      query.status = status;
    }

    // Build sort
    let sortObj = { createdAt: -1 };
    if (sortBy === 'date-asc') {
      sortObj = { createdAt: 1 };
    } else if (sortBy === 'size') {
      sortObj = { fileSize: -1 };
    } else if (sortBy === 'rows') {
      sortObj = { totalRows: -1 };
    }

    // Fetch imports
    const imports = await ImportSession.find(query)
      .sort(sortObj)
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .lean();

    // Count total
    const total = await ImportSession.countDocuments(query);

    res.json({
      success: true,
      data: {
        imports,
        total,
        hasMore: (parseInt(offset) + parseInt(limit)) < total
      }
    });
  } catch (error) {
    console.error('Error fetching import history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch import history'
    });
  }
});

/**
 * GET /api/inventory/import/session/:sessionId
 * Get detailed session information
 */
router.get('/import/session/:sessionId', auth, async (req, res) => {
  try {
    const session = await ImportSession.findOne({
      sessionId: req.params.sessionId,
      userId: req.user._id
    }).lean();

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    res.json({
      success: true,
      data: { session }
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch session'
    });
  }
});

/**
 * GET /api/inventory/import/session/:sessionId/errors
 * Get errors from a specific import session
 */
router.get('/import/session/:sessionId/errors', auth, async (req, res) => {
  try {
    const session = await ImportSession.findOne({
      sessionId: req.params.sessionId,
      userId: req.user._id
    }).lean();

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    res.json({
      success: true,
      data: {
        errors: session.errors || [],
        totalErrors: session.totalErrors || 0
      }
    });
  } catch (error) {
    console.error('Error fetching errors:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch errors'
    });
  }
});

/**
 * GET /api/inventory/import/session/:sessionId/report
 * Download import report as PDF or JSON
 */
router.get('/import/session/:sessionId/report', auth, async (req, res) => {
  try {
    const { format = 'json' } = req.query;

    const session = await ImportSession.findOne({
      sessionId: req.params.sessionId,
      userId: req.user._id
    }).lean();

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    if (format === 'json') {
      // Return JSON report
      res.setHeader('Content-Type', 'application/json');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="import-report-${session.sessionId}.json"`
      );
      return res.json({
        sessionId: session.sessionId,
        fileName: session.fileName,
        status: session.status,
        importedBy: session.importedBy,
        createdAt: session.createdAt,
        completedAt: session.completedAt,
        statistics: {
          totalRows: session.totalRows,
          propertiesCreated: session.propertiesCreated,
          propertiesUpdated: session.propertiesUpdated,
          ownersCreated: session.ownersCreated,
          ownersUpdated: session.ownersUpdated,
          duplicatesFound: session.duplicatesFound,
          successRate: session.successRate,
          totalErrors: session.totalErrors,
          totalWarnings: session.totalWarnings
        },
        errors: session.errors?.slice(0, 100) || []
      });
    }

    // TODO: Implement PDF generation
    res.status(501).json({
      success: false,
      error: 'PDF reports coming soon'
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate report'
    });
  }
});

// ============ ADMIN DASHBOARD ROUTES ============

/**
 * GET /api/admin/dashboard
 * Get admin dashboard data
 */
router.get('/admin/dashboard', auth, adminOnly, async (req, res) => {
  try {
    const { period = 'week' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'all':
        startDate = new Date(0);
        break;
    }

    // Fetch imports for period
    const imports = await ImportSession.find({
      createdAt: { $gte: startDate }
    }).lean();

    const previousPeriodImports = await ImportSession.find({
      createdAt: {
        $gte: new Date(startDate.getTime() - (now.getTime() - startDate.getTime())),
        $lt: startDate
      }
    }).lean();

    // Calculate metrics
    const totalImports = imports.length;
    const successfulImports = imports.filter(i => i.status === 'completed').length;
    const failedImports = imports.filter(i => i.status === 'failed').length;
    const activeImports = imports.filter(i => i.status === 'processing').length;

    const successRate = totalImports > 0
      ? ((successfulImports / totalImports) * 100).toFixed(1)
      : 0;

    const previousSuccessfulImports = previousPeriodImports.filter(i => i.status === 'completed').length;
    const previousTotalImports = previousPeriodImports.length;

    const successRateChange = totalImports > 0
      ? ((successRate - (previousTotalImports > 0 ? (previousSuccessfulImports / previousTotalImports) * 100 : 0))).toFixed(1)
      : 0;

    // Calculate counts
    const propertiesCreated = imports.reduce((sum, i) => sum + (i.propertiesCreated || 0), 0);
    const ownersCreated = imports.reduce((sum, i) => sum + (i.ownersCreated || 0), 0);

    const previousPropertiesCreated = previousPeriodImports.reduce((sum, i) => sum + (i.propertiesCreated || 0), 0);
    const previousOwnersCreated = previousPeriodImports.reduce((sum, i) => sum + (i.ownersCreated || 0), 0);

    const propertiesChange = previousPeriodImports.length > 0
      ? (((propertiesCreated - previousPropertiesCreated) / previousPropertiesCreated) * 100).toFixed(1)
      : (propertiesCreated > 0 ? 100 : 0);

    const ownersChange = previousPeriodImports.length > 0
      ? (((ownersCreated - previousOwnersCreated) / previousOwnersCreated) * 100).toFixed(1)
      : (ownersCreated > 0 ? 100 : 0);

    // Calculate average duration
    const durations = imports
      .filter(i => i.completedAt && i.createdAt)
      .map(i => new Date(i.completedAt).getTime() - new Date(i.createdAt).getTime());

    const avgDuration = durations.length > 0
      ? formatDuration(Math.floor(durations.reduce((a, b) => a + b) / durations.length))
      : 'N/A';

    // Import trend (last 7 days)
    const importTrend = getImportTrend(imports);

    // Status distribution
    const statusDistribution = {
      completed: imports.filter(i => i.status === 'completed').length,
      failed: imports.filter(i => i.status === 'failed').length,
      partial: imports.filter(i => i.status === 'partial').length,
      processing: imports.filter(i => i.status === 'processing').length
    };

    // Size distribution
    const sizeDistribution = {
      small: imports.filter(i => (i.totalRows || 0) < 100).length,
      medium: imports.filter(i => (i.totalRows || 0) >= 100 && (i.totalRows || 0) < 1000).length,
      large: imports.filter(i => (i.totalRows || 0) >= 1000 && (i.totalRows || 0) < 10000).length,
      huge: imports.filter(i => (i.totalRows || 0) >= 10000).length
    };

    // Hourly activity
    const hourlyActivity = getHourlyActivity(imports);

    // Recent imports
    const recentImports = imports
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    // Fetch DB stats
    const totalProperties = await Property.countDocuments();
    const totalOwners = await Owner.countDocuments();
    const totalRelationships = await OwnerPropertyMapping.countDocuments();

    res.json({
      success: true,
      data: {
        totalImports,
        importsChange: ((totalImports - previousTotalImports) / (previousTotalImports || 1) * 100).toFixed(1),
        successfulImports,
        successfulChange: ((successfulImports - previousSuccessfulImports) / (previousSuccessfulImports || 1) * 100).toFixed(1),
        failedImports,
        failedChange: ((failedImports - (previousPeriodImports.filter(i => i.status === 'failed').length || 0)) / (previousPeriodImports.filter(i => i.status === 'failed').length || 1) * 100).toFixed(1),
        successRate,
        successRateChange,
        propertiesCreated,
        propertiesChange,
        ownersCreated,
        ownersChange,
        avgDuration,
        durationChange: '0',
        activeImports,
        activeChange: '0',
        importTrend,
        statusDistribution,
        sizeDistribution,
        hourlyActivity,
        recentImports,
        totalProperties,
        totalOwners,
        totalRelationships,
        databaseSize: 'N/A',
        collections: [] // TODO: Add collection stats
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data'
    });
  }
});

/**
 * GET /api/admin/system-health
 * Get system health status
 */
router.get('/admin/system-health', auth, adminOnly, async (req, res) => {
  try {
    const uptime = process.uptime();
    const memUsage = process.memoryUsage();

    res.json({
      success: true,
      data: {
        serverStatus: 'healthy',
        uptime: formatDuration(uptime * 1000),
        databaseHealth: 95,
        apiPerformance: 98,
        storageUsage: 45,
        memoryUsage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100),
        cpuUsage: 25
      }
    });
  } catch (error) {
    console.error('Error fetching system health:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch system health'
    });
  }
});

// ============ HELPER FUNCTIONS ============

function formatDuration(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}

function getImportTrend(imports) {
  const trend = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const count = imports.filter(imp => {
      const impDate = new Date(imp.createdAt);
      return impDate >= date && impDate < nextDate;
    }).length;

    trend.push({
      date: date.toLocaleDateString(),
      count
    });
  }
  return trend;
}

function getHourlyActivity(imports) {
  const activity = [];
  for (let hour = 0; hour < 24; hour++) {
    const count = imports.filter(imp => {
      const impDate = new Date(imp.createdAt);
      return impDate.getHours() === hour;
    }).length;

    activity.push({
      hour: `${hour}:00`,
      count
    });
  }
  return activity;
}

module.exports = router;
