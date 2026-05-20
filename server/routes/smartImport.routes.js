/**
 * Smart Mary Import Routes
 * Handles Excel/CSV file upload, validation, and import processing
 */

import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as excelImportService from '../services/excelImportService.js';
import * as importValidationEngine from '../services/importValidationEngine.js';
import * as importExecutionEngine from '../services/importExecutionEngine.js';
import ImportSession from '../models/ImportSession.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getAuthenticatedUserId = req => req.user?.id || req.user?._id || null;

const buildSessionOwnershipQuery = (sessionId, userId) => ({
  _id: sessionId,
  $or: [{ userId }, { importedBy: userId }],
});

const findSessionForUser = (sessionId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    return null;
  }

  return ImportSession.findOne(buildSessionOwnershipQuery(sessionId, userId));
};

const ALLOWED_DEDUPLICATION_STRATEGIES = ['keep', 'overwrite', 'version', 'manual'];
const ALLOWED_VALIDATION_STRATEGIES = ['strict', 'lenient', 'balanced'];
const IMPORT_REQUIRED_FIELDS = ['ownerName', 'area', 'pNumber'];

const isPlainObject = value =>
  Boolean(value) &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  value.constructor === Object;

const isValidMappingPayload = mapping =>
  isPlainObject(mapping) &&
  Object.entries(mapping).every(
    ([key, value]) =>
      typeof key === 'string' &&
      key.trim().length > 0 &&
      typeof value === 'string' &&
      value.trim().length > 0
  );

const normalizeMappingToken = value =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

const hasRequiredFieldMappings = (mapping, requiredFields = IMPORT_REQUIRED_FIELDS) => {
  if (!isValidMappingPayload(mapping)) {
    return false;
  }

  const normalizedKeys = new Set(Object.keys(mapping).map(normalizeMappingToken));
  const normalizedValues = new Set(Object.values(mapping).map(normalizeMappingToken));

  return requiredFields.every(field => {
    const normalized = normalizeMappingToken(field);
    return normalizedKeys.has(normalized) || normalizedValues.has(normalized);
  });
};

const resolveExecutionColumnMapping = (sessionMapping, parseResultMapping) => {
  if (hasRequiredFieldMappings(sessionMapping)) {
    return sessionMapping;
  }

  if (hasRequiredFieldMappings(parseResultMapping)) {
    return parseResultMapping;
  }

  return sessionMapping || parseResultMapping || {};
};

const isValidClusterAssignmentsPayload = clusterAssignments =>
  isPlainObject(clusterAssignments) &&
  Object.entries(clusterAssignments).every(
    ([key, value]) =>
      typeof key === 'string' &&
      key.trim().length > 0 &&
      typeof value === 'string' &&
      value.trim().length > 0
  );

const isValidOptionalSheetName = sheetName =>
  sheetName === undefined || sheetName === null || typeof sheetName === 'string';

const isValidOptionalBoolean = value => value === undefined || typeof value === 'boolean';

const normalizeMappingPayload = mapping =>
  Object.fromEntries(
    Object.entries(mapping).map(([key, value]) => [String(key).trim(), String(value).trim()])
  );

const isValidParseDataArray = value => Array.isArray(value);

const getImportErrorStatus = errorMessage => {
  const message = String(errorMessage || '');
  const badRequestPatterns = [
    'Worksheet not found',
    'Import file not found',
    'Only .xlsx, .xls, and .csv files are supported',
  ];

  return badRequestPatterns.some(pattern => message.includes(pattern)) ? 400 : 500;
};

// Multer configuration
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

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
      userId,
      importedBy: userId,
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
    res.status(getImportErrorStatus(error.message)).json({
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
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    if (!isValidOptionalSheetName(req.body.sheetName)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid sheetName payload: expected a string',
      });
    }

    const session = await findSessionForUser(req.params.sessionId, userId);
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

    if (!isValidParseDataArray(parseResult.preview)) {
      return res.status(500).json({
        success: false,
        error: 'Invalid parser payload: preview must be an array',
      });
    }

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
    res.status(getImportErrorStatus(error.message)).json({
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
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.sessionId)) {
      return res.status(404).json({
        success: false,
        error: 'Import session not found',
      });
    }

    if (!isValidMappingPayload(req.body.mapping)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid mapping payload: expected an object of string-to-string mappings',
      });
    }

    const normalizedMapping = normalizeMappingPayload(req.body.mapping);

    if (!hasRequiredFieldMappings(normalizedMapping)) {
      return res.status(400).json({
        success: false,
        error: `Mapping is missing required fields: ${IMPORT_REQUIRED_FIELDS.join(', ')}`,
      });
    }

    const session = await ImportSession.findOneAndUpdate(
      buildSessionOwnershipQuery(req.params.sessionId, userId),
      { columnMapping: normalizedMapping },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Import session not found',
      });
    }

    res.json({
      success: true,
      data: { session },
    });
  } catch (error) {
    res.status(getImportErrorStatus(error.message)).json({
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
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    if (!isValidOptionalSheetName(req.body.sheetName)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid sheetName payload: expected a string',
      });
    }

    const validationStrategy = req.body.strategy || 'balanced';
    if (!ALLOWED_VALIDATION_STRATEGIES.includes(validationStrategy)) {
      return res.status(400).json({
        success: false,
        error: `Invalid validation strategy: ${validationStrategy}`,
      });
    }

    const session = await findSessionForUser(req.params.sessionId, userId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Import session not found',
      });
    }

    const parseResult = await excelImportService.parseExcelFile(session.filePath, {
      sheetName: req.body.sheetName || session.sheetName,
    });

    if (!isValidParseDataArray(parseResult.data)) {
      return res.status(500).json({
        success: false,
        error: 'Invalid parser payload: data must be an array',
      });
    }

    const validation = await importValidationEngine.validateAllRows(
      parseResult.data,
      validationStrategy,
      {
        requiredFields: IMPORT_REQUIRED_FIELDS,
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
    res.status(getImportErrorStatus(error.message)).json({
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
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    if (!isValidOptionalSheetName(req.body.sheetName)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid sheetName payload: expected a string',
      });
    }

    if (!isValidOptionalBoolean(req.body.dryRun)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid dryRun payload: expected a boolean',
      });
    }

    const deduplicationStrategy = req.body.deduplicationStrategy || 'keep';
    if (!ALLOWED_DEDUPLICATION_STRATEGIES.includes(deduplicationStrategy)) {
      return res.status(400).json({
        success: false,
        error: `Invalid deduplicationStrategy: ${deduplicationStrategy}`,
      });
    }

    const executionStrategy = req.body.strategy || 'balanced';
    if (!ALLOWED_VALIDATION_STRATEGIES.includes(executionStrategy)) {
      return res.status(400).json({
        success: false,
        error: `Invalid execution strategy: ${executionStrategy}`,
      });
    }

    const clusterAssignments = req.body.clusterAssignments || {};
    if (!isValidClusterAssignmentsPayload(clusterAssignments)) {
      return res.status(400).json({
        success: false,
        error:
          'Invalid clusterAssignments payload: expected an object of string-to-string mappings',
      });
    }

    const session = await findSessionForUser(req.params.sessionId, userId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Import session not found',
      });
    }

    // Parse data
    const parseResult = await excelImportService.parseExcelFile(session.filePath, {
      sheetName: req.body.sheetName || session.sheetName,
    });

    if (!isValidParseDataArray(parseResult.data)) {
      return res.status(500).json({
        success: false,
        error: 'Invalid parser payload: data must be an array',
      });
    }

    const effectiveColumnMapping = resolveExecutionColumnMapping(
      session.columnMapping,
      parseResult.columnMapping
    );

    if (!hasRequiredFieldMappings(effectiveColumnMapping)) {
      return res.status(400).json({
        success: false,
        error: `Unable to execute import: required column mappings missing (${IMPORT_REQUIRED_FIELDS.join(', ')})`,
      });
    }

    // Optional: dry-run validation
    if (req.body.dryRun) {
      const dryRunResult = await importValidationEngine.dryRun(parseResult.data, session._id, {
        strategy: executionStrategy,
        requiredFields: IMPORT_REQUIRED_FIELDS,
      });

      return res.json({
        success: true,
        data: {
          dryRun: true,
          ...dryRunResult,
        },
      });
    }

    // Update status only for real execution
    session.status = 'processing';
    await session.save();

    // Execute actual import
    const importResult = await importExecutionEngine.executeImport(session._id, parseResult.data, {
      columnMapping: effectiveColumnMapping,
      statusMap: {},
      clusterAssignments,
      deduplicationStrategy,
      importStrategy: executionStrategy,
      dryRun: false,
      batchSize: 100,
    });

    const finalizedSession = await findSessionForUser(req.params.sessionId, userId);

    res.json({
      success: true,
      data: {
        sessionId: session._id,
        status: finalizedSession?.status || session.status,
        ...importResult,
      },
    });
  } catch (error) {
    // Update session on error
    try {
      const userId = getAuthenticatedUserId(req);
      const session = userId ? await findSessionForUser(req.params.sessionId, userId) : null;
      if (session) {
        session.status = 'failed';
        session.importErrors = [{ error: error.message }];
        await session.save();
      }
    } catch (updateError) {
      console.error('Failed to update session on error:', updateError);
    }

    res.status(getImportErrorStatus(error.message)).json({
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
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const session = await findSessionForUser(req.params.sessionId, userId);
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
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const session = await findSessionForUser(req.params.sessionId, userId);
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
