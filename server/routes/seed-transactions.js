import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Transaction from '../models/Transaction.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post('/transactions', async (req, res) => {
  try {
    const existingCount = await Transaction.countDocuments();
    if (existingCount > 0) {
      return res.json({ 
        success: true, 
        message: `Database already has ${existingCount} transactions. Skipping import.`,
        existingCount 
      });
    }

    const csvPath = path.join(__dirname, '..', 'data', 'dld_transactions.csv');
    if (!fs.existsSync(csvPath)) {
      return res.status(404).json({ success: false, error: 'CSV file not found' });
    }

    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = fileContent.split('\n');

    const transactions = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const regex = /(?:^|,)("(?:[^"]|"")*"|[^,]*)/g;
      const values = [];
      let match;
      while ((match = regex.exec(lines[i])) !== null) {
        let val = match[1] || '';
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.slice(1, -1).replace(/""/g, '"');
        }
        values.push(val.trim());
      }
      
      if (values.length >= 22) {
        const isOffplanValue = values[4]?.toLowerCase().includes('off') ? 'Off-Plan' : 'Ready';
        const isFreeholdValue = values[5]?.toLowerCase().includes('free') ? 'Free Hold' : 'Leasehold';
        
        let propSubType = values[9] || 'Flat';
        const validTypes = ['Flat', 'Villa', 'Townhouse', 'Penthouse', 'Studio', 'Office', 'Shop', 'Warehouse', 'Hotel Rooms', 'Plot', 'Other'];
        if (!validTypes.includes(propSubType)) {
          if (propSubType.toLowerCase().includes('villa')) propSubType = 'Villa';
          else if (propSubType.toLowerCase().includes('town')) propSubType = 'Townhouse';
          else if (propSubType.toLowerCase().includes('pent')) propSubType = 'Penthouse';
          else if (propSubType.toLowerCase().includes('studio')) propSubType = 'Studio';
          else if (propSubType.toLowerCase().includes('hotel')) propSubType = 'Hotel Rooms';
          else propSubType = 'Flat';
        }

        transactions.push({
          transactionNumber: values[0],
          instanceDate: new Date(values[1]),
          group: values[2] || 'Sales',
          procedure: values[3] || 'Sell',
          isOffplan: isOffplanValue,
          isFreehold: isFreeholdValue,
          usage: values[6] || 'Residential',
          area: values[7],
          propType: values[8] || 'Unit',
          propSubType: propSubType,
          transValue: parseFloat(values[10]) || 0,
          procedureArea: parseFloat(values[11]) || 0,
          actualArea: parseFloat(values[12]) || 0,
          rooms: values[13] || '',
          parking: values[14] || '',
          nearestMetro: values[15] || '',
          nearestMall: values[16] || '',
          nearestLandmark: values[17] || '',
          totalBuyer: parseInt(values[18]) || 0,
          totalSeller: parseInt(values[19]) || 0,
          masterProject: values[20] || '',
          project: values[21] || ''
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
        } else {
          console.error('Batch error:', err.message);
        }
      }
    }

    res.json({
      success: true,
      message: `Imported ${imported} transactions`,
      imported,
      errors,
      total: transactions.length
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
