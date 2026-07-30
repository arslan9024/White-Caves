import express from 'express';
import Transaction from '../models/Transaction.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      sortBy = 'instanceDate',
      sortOrder = 'desc',
      area,
      project,
      propSubType,
      rooms,
      minValue,
      maxValue,
      isOffplan,
      search
    } = req.query;

    const query = {};
    
    if (area) query.area = { $regex: area, $options: 'i' };
    if (project) query.project = { $regex: project, $options: 'i' };
    if (propSubType) query.propSubType = propSubType;
    if (rooms) query.rooms = rooms;
    if (isOffplan) query.isOffplan = isOffplan;
    if (minValue || maxValue) {
      query.transValue = {};
      if (minValue) query.transValue.$gte = Number(minValue);
      if (maxValue) query.transValue.$lte = Number(maxValue);
    }
    if (search) {
      query.$or = [
        { transactionNumber: { $regex: search, $options: 'i' } },
        { project: { $regex: search, $options: 'i' } },
        { area: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Transaction.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const [totalCount, totalValue, areaStats, propTypeStats] = await Promise.all([
      Transaction.countDocuments(),
      Transaction.aggregate([
        { $group: { _id: null, total: { $sum: '$transValue' } } }
      ]),
      Transaction.aggregate([
        { $group: { _id: '$area', count: { $sum: 1 }, avgValue: { $avg: '$transValue' } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Transaction.aggregate([
        { $group: { _id: '$propSubType', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    res.json({
      success: true,
      stats: {
        totalTransactions: totalCount,
        totalValue: totalValue[0]?.total || 0,
        topAreas: areaStats,
        propertyTypes: propTypeStats
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }
    res.json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    // Schema validation enforced for payload
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }
    res.json({ success: true, data: transaction });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }
    res.json({ success: true, message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/import', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');

    const transactions = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
      const cleanValues = values.map(v => v.replace(/^"|"$/g, '').trim());
      
      if (cleanValues.length >= 22) {
        transactions.push({
          transactionNumber: cleanValues[0],
          instanceDate: new Date(cleanValues[1]),
          group: cleanValues[2] || 'Sales',
          procedure: cleanValues[3],
          isOffplan: cleanValues[4] || 'Off-Plan',
          isFreehold: cleanValues[5] || 'Free Hold',
          usage: cleanValues[6] || 'Residential',
          area: cleanValues[7],
          propType: cleanValues[8] || 'Unit',
          propSubType: cleanValues[9] || 'Flat',
          transValue: parseFloat(cleanValues[10]) || 0,
          procedureArea: parseFloat(cleanValues[11]) || 0,
          actualArea: parseFloat(cleanValues[12]) || 0,
          rooms: cleanValues[13] || '',
          parking: cleanValues[14] || '',
          nearestMetro: cleanValues[15] || '',
          nearestMall: cleanValues[16] || '',
          nearestLandmark: cleanValues[17] || '',
          totalBuyer: parseInt(cleanValues[18]) || 0,
          totalSeller: parseInt(cleanValues[19]) || 0,
          masterProject: cleanValues[20] || '',
          project: cleanValues[21] || ''
        });
      }
    }

    const batchSize = 500;
    let imported = 0;
    let errors = 0;

    for (let i = 0; i < transactions.length; i += batchSize) {
      const batch = transactions.slice(i, i + batchSize);
      try {
        await Transaction.insertMany(batch, { ordered: false });
        imported += batch.length;
      } catch (err) {
        if (err.writeErrors) {
          imported += batch.length - err.writeErrors.length;
          errors += err.writeErrors.length;
        }
      }
    }

    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: `Imported ${imported} transactions`,
      imported,
      errors,
      total: transactions.length
    });
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
