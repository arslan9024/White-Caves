import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { asyncHandler } from '../middleware/errorHandler.js';
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
    const stage = req.body?.newStage || req.body?.nextStage;
    if (!stage || typeof stage !== 'string' || !stage.trim()) {
      return res.status(400).json({ success: false, error: 'newStage or nextStage is required' });
    }
    req.body.newStage = stage;
    next();
  },
  handleValidationErrors,
  transitionSalesStage
);
router.post('/:id/noc', upload.single('document'), uploadNocDocument);

export default router;
