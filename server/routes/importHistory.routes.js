/**
 * Import History & Admin API Routes
 * GET /api/inventory/import/history - Get import history
 * GET /api/inventory/import/session/:sessionId - Get session details
 * GET /api/inventory/import/session/:sessionId/errors - Get session errors
 * GET /api/inventory/import/session/:sessionId/report - Download report
 * GET /api/admin/dashboard - Admin dashboard data
 * GET /api/admin/system-health - System health status
 */

import express from 'express';
import mongoose from 'mongoose';
import auth from '../middleware/auth.ts';
import ImportSession from '../models/ImportSession.js';
import PropertyInventory from '../models/PropertyInventory.js';
import OwnerPropertyMapping from '../models/OwnerPropertyMapping.js';

const router = express.Router();

const adminOnly = (req, res, next) => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin')) {
    return res.status(403).json({
      success: false,
      error: 'Admin access required',
    });
  }

  return next();
};

const getAuthenticatedUserId = req => req.user?.id || req.user?._id || null;

const buildOwnershipQuery = userId => ({
  $or: [{ userId }, { importedBy: userId }],
});

const buildSessionLookupQuery = (rawSessionId, userId) => {
  const conditions = [{ sessionId: rawSessionId }];

  if (mongoose.Types.ObjectId.isValid(rawSessionId)) {
    conditions.push({ _id: rawSessionId });
  }

  return {
    ...buildOwnershipQuery(userId),
    $and: [{ $or: conditions }],
  };
};

const ADMIN_COLLECTIONS = [
  { name: 'import_sessions', model: ImportSession },
  { name: 'property_inventory', model: PropertyInventory },
  { name: 'owner_property_mappings', model: OwnerPropertyMapping },
];

// ============ IMPORT HISTORY ROUTES ============

/**
 * GET /api/inventory/import/history
 * Retrieve import history with filtering and sorting
 */
router.get('/inventory/import/history', auth, async (req, res) => {
  try {
    const { status, sortBy = 'date', limit = 50, offset = 0 } = req.query;
    const userId = getAuthenticatedUserId(req);
    const parsedLimit = Number.parseInt(limit, 10);
    const parsedOffset = Number.parseInt(offset, 10);

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    if (!Number.isInteger(parsedLimit) || parsedLimit <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid limit query param: expected a positive integer',
      });
    }

    if (!Number.isInteger(parsedOffset) || parsedOffset < 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid offset query param: expected a non-negative integer',
      });
    }

    // Build query
    const query = buildOwnershipQuery(userId);
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
    const importsRaw = await ImportSession.find(query)
      .sort(sortObj)
      .limit(parsedLimit)
      .skip(parsedOffset)
      .lean();

    const imports = importsRaw.map(item => ({
      ...item,
      sessionId: item.sessionId || String(item._id),
    }));

    // Count total
    const total = await ImportSession.countDocuments(query);

    res.json({
      success: true,
      data: {
        imports,
        total,
        hasMore: parsedOffset + parsedLimit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching import history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch import history',
    });
  }
});

/**
 * GET /api/inventory/import/session/:sessionId
 * Get detailed session information
 */
router.get('/inventory/import/session/:sessionId', auth, async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    const session = await ImportSession.findOne(
      buildSessionLookupQuery(req.params.sessionId, userId)
    ).lean();

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      });
    }

    res.json({
      success: true,
      data: { session },
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch session',
    });
  }
});

/**
 * GET /api/inventory/import/session/:sessionId/errors
 * Get errors from a specific import session
 */
router.get('/inventory/import/session/:sessionId/errors', auth, async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    const session = await ImportSession.findOne(
      buildSessionLookupQuery(req.params.sessionId, userId)
    ).lean();

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      });
    }

    res.json({
      success: true,
      data: {
        errors: session.importErrors || session.errors || [],
        totalErrors:
          session.totalErrors ||
          (Array.isArray(session.importErrors)
            ? session.importErrors.length
            : Array.isArray(session.errors)
              ? session.errors.length
              : 0),
      },
    });
  } catch (error) {
    console.error('Error fetching errors:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch errors',
    });
  }
});

/**
 * GET /api/inventory/import/session/:sessionId/report
 * Download import report as PDF or JSON
 */
router.get('/inventory/import/session/:sessionId/report', auth, async (req, res) => {
  try {
    const { format = 'json' } = req.query;
    const userId = getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    const session = await ImportSession.findOne(
      buildSessionLookupQuery(req.params.sessionId, userId)
    ).lean();

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      });
    }

    if (format === 'json') {
      const reportSessionId = session.sessionId || String(session._id || req.params.sessionId);

      // Return JSON report
      res.setHeader('Content-Type', 'application/json');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="import-report-${reportSessionId}.json"`
      );
      return res.json({
        sessionId: reportSessionId,
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
          totalWarnings: session.totalWarnings,
        },
        errors: (session.importErrors || session.errors || []).slice(0, 100),
      });
    }

    // Generate PDF report using pdf-lib
    const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const page = pdfDoc.addPage([595, 842]); // A4
    const { width, height } = page.getSize();
    const margin = 50;

    let y = height - margin;

    const drawText = (text, x, yPos, size = 10, isBold = false) => {
      page.drawText(String(text), {
        x,
        y: yPos,
        size,
        font: isBold ? boldFont : font,
        color: rgb(0, 0, 0),
      });
    };

    const drawLine = yPos => {
      page.drawLine({
        start: { x: margin, y: yPos },
        end: { x: width - margin, y: yPos },
        thickness: 1,
        color: rgb(0.8, 0.8, 0.8),
      });
    };

    // Header
    page.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: rgb(0.05, 0.05, 0.15) });
    drawText('White Caves Real Estate', margin, height - 35, 18, true);
    page.drawText('Import Report', {
      x: margin,
      y: height - 58,
      size: 12,
      font,
      color: rgb(0.8, 0.8, 0.8),
    });

    y = height - 100;

    // Session info
    drawText('IMPORT SESSION DETAILS', margin, y, 12, true);
    y -= 20;
    drawLine(y);
    y -= 15;

    const infoRows = [
      ['Session ID:', session.sessionId || 'N/A'],
      ['File Name:', session.fileName || 'N/A'],
      ['Status:', session.status || 'N/A'],
      ['Imported By:', session.importedBy || 'N/A'],
      ['Started At:', session.createdAt ? new Date(session.createdAt).toLocaleString() : 'N/A'],
      [
        'Completed At:',
        session.completedAt ? new Date(session.completedAt).toLocaleString() : 'N/A',
      ],
    ];

    for (const [label, value] of infoRows) {
      drawText(label, margin, y, 10, true);
      drawText(value, margin + 120, y, 10);
      y -= 18;
    }

    y -= 10;
    drawText('IMPORT STATISTICS', margin, y, 12, true);
    y -= 20;
    drawLine(y);
    y -= 15;

    const stats = [
      ['Total Rows Processed:', session.totalRows ?? 0],
      ['Properties Created:', session.propertiesCreated ?? 0],
      ['Properties Updated:', session.propertiesUpdated ?? 0],
      ['Owners Created:', session.ownersCreated ?? 0],
      ['Owners Updated:', session.ownersUpdated ?? 0],
      ['Duplicates Found:', session.duplicatesFound ?? 0],
      ['Success Rate:', `${session.successRate ?? 0}%`],
      ['Total Errors:', session.totalErrors ?? 0],
      ['Total Warnings:', session.totalWarnings ?? 0],
    ];

    for (const [label, value] of stats) {
      drawText(label, margin, y, 10, true);
      drawText(String(value), margin + 150, y, 10);
      y -= 18;
    }

    // Errors section
    const errors = (session.importErrors || session.errors || []).slice(0, 20);
    if (errors.length > 0) {
      y -= 10;
      drawText('ERRORS (first 20)', margin, y, 12, true);
      y -= 20;
      drawLine(y);
      y -= 15;

      for (const err of errors) {
        if (y < margin + 30) {
          // Add new page if needed
          const newPage = pdfDoc.addPage([595, 842]);
          y = 842 - margin;
        }
        const errText = typeof err === 'string' ? err : err.message || JSON.stringify(err);
        drawText(`• ${errText.substring(0, 90)}`, margin, y, 9);
        y -= 14;
      }
    }

    // Footer
    const lastPage = pdfDoc.getPages()[pdfDoc.getPageCount() - 1];
    lastPage.drawText(`Generated: ${new Date().toLocaleString()} | White Caves Real Estate`, {
      x: margin,
      y: 25,
      size: 8,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });

    const pdfBytes = await pdfDoc.save();
    const buffer = Buffer.from(pdfBytes);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', buffer.length);
    const reportSessionId = session.sessionId || String(session._id || req.params.sessionId);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="import-report-${reportSessionId}.pdf"`
    );
    return res.end(buffer);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate report',
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
      createdAt: { $gte: startDate },
    }).lean();

    const previousPeriodImports = await ImportSession.find({
      createdAt: {
        $gte: new Date(startDate.getTime() - (now.getTime() - startDate.getTime())),
        $lt: startDate,
      },
    }).lean();

    // Calculate metrics
    const totalImports = imports.length;
    const successfulImports = imports.filter(i => i.status === 'completed').length;
    const failedImports = imports.filter(i => i.status === 'failed').length;
    const activeImports = imports.filter(i => i.status === 'processing').length;

    const successRate =
      totalImports > 0 ? ((successfulImports / totalImports) * 100).toFixed(1) : 0;

    const previousSuccessfulImports = previousPeriodImports.filter(
      i => i.status === 'completed'
    ).length;
    const previousTotalImports = previousPeriodImports.length;

    const successRateChange =
      totalImports > 0
        ? (
            successRate -
            (previousTotalImports > 0
              ? (previousSuccessfulImports / previousTotalImports) * 100
              : 0)
          ).toFixed(1)
        : 0;

    // Calculate counts
    const propertiesCreated = imports.reduce((sum, i) => sum + (i.propertiesCreated || 0), 0);
    const ownersCreated = imports.reduce((sum, i) => sum + (i.ownersCreated || 0), 0);

    const previousPropertiesCreated = previousPeriodImports.reduce(
      (sum, i) => sum + (i.propertiesCreated || 0),
      0
    );
    const previousOwnersCreated = previousPeriodImports.reduce(
      (sum, i) => sum + (i.ownersCreated || 0),
      0
    );

    const propertiesChange =
      previousPeriodImports.length > 0
        ? (
            ((propertiesCreated - previousPropertiesCreated) / previousPropertiesCreated) *
            100
          ).toFixed(1)
        : propertiesCreated > 0
          ? 100
          : 0;

    const ownersChange =
      previousPeriodImports.length > 0
        ? (((ownersCreated - previousOwnersCreated) / previousOwnersCreated) * 100).toFixed(1)
        : ownersCreated > 0
          ? 100
          : 0;

    // Calculate average duration
    const durations = imports
      .filter(i => i.completedAt && i.createdAt)
      .map(i => new Date(i.completedAt).getTime() - new Date(i.createdAt).getTime());

    const avgDuration =
      durations.length > 0
        ? formatDuration(Math.floor(durations.reduce((a, b) => a + b) / durations.length))
        : 'N/A';

    // Import trend (last 7 days)
    const importTrend = getImportTrend(imports);

    // Status distribution
    const statusDistribution = {
      completed: imports.filter(i => i.status === 'completed').length,
      failed: imports.filter(i => i.status === 'failed').length,
      partial: imports.filter(i => i.status === 'partial').length,
      processing: imports.filter(i => i.status === 'processing').length,
    };

    // Size distribution
    const sizeDistribution = {
      small: imports.filter(i => (i.totalRows || 0) < 100).length,
      medium: imports.filter(i => (i.totalRows || 0) >= 100 && (i.totalRows || 0) < 1000).length,
      large: imports.filter(i => (i.totalRows || 0) >= 1000 && (i.totalRows || 0) < 10000).length,
      huge: imports.filter(i => (i.totalRows || 0) >= 10000).length,
    };

    // Hourly activity
    const hourlyActivity = getHourlyActivity(imports);

    // Recent imports
    const recentImports = imports
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    // Fetch DB stats
    const totalProperties = await PropertyInventory.countDocuments();
    const totalOwners = (await OwnerPropertyMapping.distinct('ownerId')).length;
    const totalRelationships = await OwnerPropertyMapping.countDocuments();
    const collections = await Promise.all(
      ADMIN_COLLECTIONS.map(async ({ name, model }) => ({
        name,
        count: await model.countDocuments(),
      }))
    );

    res.json({
      success: true,
      data: {
        totalImports,
        importsChange: (
          ((totalImports - previousTotalImports) / (previousTotalImports || 1)) *
          100
        ).toFixed(1),
        successfulImports,
        successfulChange: (
          ((successfulImports - previousSuccessfulImports) / (previousSuccessfulImports || 1)) *
          100
        ).toFixed(1),
        failedImports,
        failedChange: (
          ((failedImports -
            (previousPeriodImports.filter(i => i.status === 'failed').length || 0)) /
            (previousPeriodImports.filter(i => i.status === 'failed').length || 1)) *
          100
        ).toFixed(1),
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
        collections,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data',
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
        cpuUsage: 25,
      },
    });
  } catch (error) {
    console.error('Error fetching system health:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch system health',
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
      count,
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
      count,
    });
  }
  return activity;
}

export default router;
