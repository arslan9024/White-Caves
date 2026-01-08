import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import Owner from '../models/Owner.js';
import InventoryProperty from '../models/InventoryProperty.js';
import ImportSession from '../models/ImportSession.js';
import * as excelImportService from '../services/excelImportService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `import_${Date.now()}_${file.originalname}`)
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.xlsx', '.xls', '.csv'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'));
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 }
});

router.get('/properties', async (req, res) => {
  try {
    const { 
      area, status, purpose, type, search, 
      page = 1, limit = 50, sort = '-createdAt' 
    } = req.query;
    
    const query = { isActive: true };
    
    if (area) query.area = area;
    if (status) query.status = status;
    if (purpose) query.purpose = purpose;
    if (type) query.propertyType = type;
    if (search) {
      query.$or = [
        { project: { $regex: search, $options: 'i' } },
        { pNumber: { $regex: search, $options: 'i' } },
        { unitNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [properties, total] = await Promise.all([
      InventoryProperty.find(query)
        .populate('primaryOwner', 'name contacts')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      InventoryProperty.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: properties,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/properties/stats', async (req, res) => {
  try {
    const { area } = req.query;
    const query = { isActive: true };
    if (area) query.area = area;
    
    const [total, statusStats, areaStats] = await Promise.all([
      InventoryProperty.countDocuments(query),
      InventoryProperty.aggregate([
        { $match: query },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      InventoryProperty.getAreaStats()
    ]);
    
    const stats = {
      total,
      byStatus: statusStats.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
      byArea: areaStats
    };
    
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/properties/areas', async (req, res) => {
  try {
    const areas = await InventoryProperty.getDistinctAreas();
    res.json({ success: true, data: areas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/properties/:id', async (req, res) => {
  try {
    const property = await InventoryProperty.findById(req.params.id)
      .populate('owners', 'name contacts')
      .populate('primaryOwner', 'name contacts');
    
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    
    res.json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/properties', async (req, res) => {
  try {
    const property = new InventoryProperty({
      ...req.body,
      source: 'manual'
    });
    await property.save();
    res.status(201).json({ success: true, data: property });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/properties/:id', async (req, res) => {
  try {
    const property = await InventoryProperty.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    
    res.json({ success: true, data: property });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/properties/:id', async (req, res) => {
  try {
    const property = await InventoryProperty.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    
    res.json({ success: true, message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/owners', async (req, res) => {
  try {
    const { search, page = 1, limit = 50 } = req.query;
    
    const query = { isActive: true };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'contacts.value': { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [owners, total] = await Promise.all([
      Owner.find(query)
        .populate('properties', 'pNumber area project status')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Owner.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: owners,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/owners/:id', async (req, res) => {
  try {
    const owner = await Owner.findById(req.params.id)
      .populate('properties');
    
    if (!owner) {
      return res.status(404).json({ success: false, message: 'Owner not found' });
    }
    
    res.json({ success: true, data: owner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/import/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    const session = new ImportSession({
      fileName: req.file.originalname,
      filePath: req.file.path,
      status: 'pending',
      importedBy: req.body.userId || 'owner'
    });
    await session.save();
    
    const { sheetName, previewLimit = 100 } = req.body;
    const parsed = await excelImportService.parseExcelFile(req.file.path, {
      sheetName,
      limit: parseInt(previewLimit)
    });
    
    session.totalRows = parsed.totalRows;
    session.columnMapping = excelImportService.COLUMN_MAPPING;
    await session.save();
    
    res.json({
      success: true,
      data: {
        sessionId: session._id,
        sheetNames: parsed.sheetNames,
        headers: parsed.headers,
        preview: parsed.rows,
        totalRows: parsed.totalRows,
        columnMapping: excelImportService.COLUMN_MAPPING
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/import/validate/:sessionId', async (req, res) => {
  try {
    const session = await ImportSession.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }
    
    let filePath = session.filePath;
    if (!filePath || !fs.existsSync(filePath)) {
      const files = fs.readdirSync(uploadDir);
      const matchingFile = files.find(f => f.includes(session.fileName));
      if (!matchingFile) {
        return res.status(404).json({ success: false, message: 'Import file not found' });
      }
      filePath = path.join(uploadDir, matchingFile);
    }
    
    const parsed = await excelImportService.parseExcelFile(filePath, {
      sheetName: req.body.sheetName
    });
    
    const validation = await excelImportService.validateData(parsed.rows);
    
    res.json({
      success: true,
      data: {
        isValid: validation.isValid,
        errors: validation.errors,
        warnings: validation.warnings,
        rowCount: parsed.rows.length
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/import/execute/:sessionId', async (req, res) => {
  try {
    const session = await ImportSession.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }
    
    const { sheetName, dryRun = false, importAllSheets = false } = req.body;
    
    let filePath = session.filePath;
    if (!filePath || !fs.existsSync(filePath)) {
      const files = fs.readdirSync(uploadDir);
      const matchingFile = files.find(f => f.includes(session.fileName));
      if (!matchingFile) {
        return res.status(404).json({ success: false, message: 'Import file not found' });
      }
      filePath = path.join(uploadDir, matchingFile);
    }
    
    let rows;
    if (importAllSheets) {
      rows = await excelImportService.getAllSheetData(filePath);
    } else {
      const parsed = await excelImportService.parseExcelFile(filePath, { sheetName });
      rows = parsed.rows;
    }
    
    session.sheetName = importAllSheets ? 'All Sheets' : sheetName;
    await session.save();
    
    const result = await excelImportService.importData(rows, session._id, { dryRun });
    
    res.json({
      success: true,
      data: {
        ...result,
        sessionId: session._id,
        dryRun
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/import/sessions', async (req, res) => {
  try {
    const sessions = await ImportSession.find()
      .sort('-createdAt')
      .limit(20)
      .lean();
    
    res.json({ success: true, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/import/sessions/:id', async (req, res) => {
  try {
    const session = await ImportSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
