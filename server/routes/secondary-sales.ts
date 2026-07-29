import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import {
  getSecondarySalesInventory,
  transitionSalesStage,
  uploadNocDocument
} from '../controllers/secondarySalesController.js';

const router = Router();

// Set up multer for local storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'server', 'public', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

import { handleValidationErrors } from '../middleware/validation.js';

// Routes
router.get('/', getSecondarySalesInventory);
router.patch(
  '/:id/stage',
  (req, res, next) => {
    if (!req.body?.nextStage || typeof req.body.nextStage !== 'string' || !req.body.nextStage.trim()) {
      return res.status(400).json({ success: false, error: 'nextStage is required' });
    }
    next();
  },
  handleValidationErrors,
  transitionSalesStage
);
router.post('/:id/noc', upload.single('document'), uploadNocDocument);

export default router;
