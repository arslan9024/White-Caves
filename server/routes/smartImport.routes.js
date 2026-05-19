/**
 * Smart Mary Import Routes
 * Handles Excel/CSV file upload, validation, and import processing
 */

import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import * as excelImportService from '../services/excelImportService.js';
import * as importValidationEngine from '../services/importValidationEngine.js';
import * as importExecutionEngine from '../services/importExecutionEngine.js';
import * as deduplicationService from '../services/deduplicationService.js';
import ImportSession from '../models/ImportSession.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer configuration
const uploadDir = path.join(__dirname, '../uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `import_${timestamp}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.xlsx', '.xls', '.csv'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .xlsx, .xls, and .csv files are supported'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
});

/**
 * POST /api/inventory/import/upload
 * Upload Excel/CSV file and extract metadata
 */
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file provided',
      });
    }

    // Parse Excel file
    const parseResult = await excelImportService.parseExcelFile(req.file.path, {
      previewLimit: 20,
    });

    // Create import session
    const session = new ImportSession({
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileHash: req.file.filename,
      sheetName: parseResult.sheets[0],
      totalRows: parseResult.totalRows,
      status: 'pending',
      columnMapping: parseResult.columnMapping,
      userId: req.user?.id || undefined,
      importedBy: req.user?.id || 'anonymous',
    });

    await session.save();

    // Extract dropdown options from preview
    const dropdownOptions = extractDropdownOptions(parseResult.preview);

    res.json({
      success: true,
      data: {
        sessionId: session._id,
        sheetNames: parseResult.sheets,
        headers: parseResult.headers,
        preview: parseResult.preview,
        totalRows: parseResult.totalRows,
        columnMapping: parseResult.columnMapping,
        dropdownOptions,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/inventory/import/:sessionId/preview
 * Get updated preview with dropdown options
 */
router.post('/:sessionId/preview', async (req, res) => {
  try {
    const session = await ImportSession.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Import session not found',
      });
    }

    const parseResult = await excelImportService.parseExcelFile(session.filePath, {
      sheetName: req.body.sheetName || session.sheetName,
      previewLimit: 100,
    });

    const dropdownOptions = extractDropdownOptions(parseResult.preview);
    const stats = calculateDataStats(parseResult.preview);

    res.json({
      success: true,
      data: {
        preview: parseResult.preview,
        dropdownOptions,
        stats,
        totalRows: parseResult.totalRows,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/inventory/import/:sessionId/mapping
 * Save custom column mapping
 */
router.post('/:sessionId/mapping', async (req, res) => {
  try {
    const session = await ImportSession.findByIdAndUpdate(
      req.params.sessionId,
      { columnMapping: req.body.mapping },
      { new: true }
    );

    res.json({
      success: true,
      data: { session },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/inventory/import/:sessionId/validate
 * Validate import data
 */
router.post('/:sessionId/validate', async (req, res) => {
  try {
    const session = await ImportSession.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Import session not found',
      });
    }

    const parseResult = await excelImportService.parseExcelFile(session.filePath, {
      sheetName: req.body.sheetName || session.sheetName,
    });

    const validation = await importValidationEngine.validateAllRows(
      parseResult.data,
      req.body.strategy || 'balanced',
      {
        requiredFields: ['ownerName', 'area'],
        fieldTypes: {},
      }
    );

    // Check for orphaned records
    const orphaned = importValidationEngine.detectOrphanedRecords(parseResult.data);

    res.json({
      success: true,
      data: {
        validation,
        orphanedRecords: orphaned,
        isReady: validation.isValid && orphaned.length === 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/inventory/import/:sessionId/execute
 * Execute import with batch processing
 */
router.post('/:sessionId/execute', async (req, res) => {
  try {
    const session = await ImportSession.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Import session not found',
      });
    }

    // Update status
    session.status = 'processing';
    await session.save();

    // Parse data
    const parseResult = await excelImportService.parseExcelFile(session.filePath, {
      sheetName: req.body.sheetName || session.sheetName,
    });

    // Optional: dry-run validation
    if (req.body.dryRun) {
      const dryRunResult = await importValidationEngine.dryRun(parseResult.data, session._id, {
        strategy: req.body.strategy || 'balanced',
        requiredFields: ['ownerName', 'area'],
      });

      return res.json({
        success: true,
        data: {
          dryRun: true,
          ...dryRunResult,
        },
      });
    }

    // Execute actual import
    const importResult = await importExecutionEngine.executeImport(session._id, parseResult.data, {
      columnMapping: session.columnMapping,
      statusMap: {},
      clusterAssignments: req.body.clusterAssignments || {},
      deduplicationStrategy: req.body.deduplicationStrategy || 'keep',
      importStrategy: req.body.strategy || 'balanced',
      dryRun: false,
      batchSize: 100,
    });

    // Final session update
    session.status = 'completed';
    await session.save();

    res.json({
      success: true,
      data: {
        sessionId: session._id,
        ...importResult,
      },
    });
  } catch (error) {
    // Update session on error
    try {
      const session = await ImportSession.findById(req.params.sessionId);
      if (session) {
        session.status = 'failed';
        session.importErrors = [{ error: error.message }];
        await session.save();
      }
    } catch (updateError) {
      console.error('Failed to update session on error:', updateError);
    }

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/inventory/import/:sessionId
 * Get import session details and progress
 */
router.get('/:sessionId', async (req, res) => {
  try {
    const session = await ImportSession.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Import session not found',
      });
    }

    res.json({
      success: true,
      data: {
        session,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/inventory/import/:sessionId/errors
 * Get detailed error and duplicate reports
 */
router.get('/:sessionId/errors', async (req, res) => {
  try {
    const session = await ImportSession.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Import session not found',
      });
    }

    res.json({
      success: true,
      data: {
        errors: session.importErrors || [],
        duplicates: session.duplicates || [],
        totalErrors: (session.importErrors || []).length,
        totalDuplicates: (session.duplicates || []).length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Helper: Extract dropdown options from preview data
 */
function extractDropdownOptions(preview) {
  const options = {
    statuses: new Set(),
    areas: new Set(),
    clusters: new Set(),
    rooms: new Set(),
    layouts: new Set(),
  };

  for (const row of preview) {
    if (row.status) options.statuses.add(row.status);
    if (row.area) options.areas.add(row.area);
    if (row.cluster) options.clusters.add(row.cluster);
    if (row.rooms) options.rooms.add(row.rooms);
    if (row.layout) options.layouts.add(row.layout);
  }

  return {
    statuses: Array.from(options.statuses),
    areas: Array.from(options.areas),
    clusters: Array.from(options.clusters),
    rooms: Array.from(options.rooms),
    layouts: Array.from(options.layouts),
  };
}

/**
 * Helper: Calculate data statistics
 */
function calculateDataStats(preview) {
  let totalRows = preview.length;
  let missingOwnerNames = 0;
  let missingAreas = 0;
  let priceMin = Infinity;
  let priceMax = 0;
  const uniqueAreas = new Set();

  for (const row of preview) {
    if (!row.ownerName || row.ownerName === '.') missingOwnerNames++;
    if (!row.area || row.area === '.') missingAreas++;
    if (row.askingPrice) {
      const price = parseInt(row.askingPrice);
      priceMin = Math.min(priceMin, price);
      priceMax = Math.max(priceMax, price);
    }
    if (row.area) uniqueAreas.add(row.area);
  }

  return {
    totalRows,
    missingOwnerNames,
    missingAreas,
    priceRange: { min: priceMin === Infinity ? 0 : priceMin, max: priceMax },
    uniqueAreas: uniqueAreas.size,
    completenessPercentage: Math.round(
      (100 * (totalRows - missingOwnerNames - missingAreas)) / (totalRows * 2)
    ),
  };
}

export default router;
