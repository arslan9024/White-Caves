import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  createLeasingProperty,
  uploadPropertyDocument,
  transitionPropertyStage,
  getLeasingInventory,
  signContract,
  registerEjari,
  completeHandover,
} from '../controllers/inventoryController.js';

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

import { validatePropertyDetails, handleValidationErrors } from '../middleware/validation.js';

// Routes
router.get('/', getLeasingInventory);
router.post('/', validatePropertyDetails, handleValidationErrors, createLeasingProperty);
router.post('/:id/upload', upload.single('document'), uploadPropertyDocument);
router.patch('/:id/stage', transitionPropertyStage);
router.post('/:id/sign', signContract);
router.post('/:id/ejari', registerEjari);
router.post('/:id/handover', completeHandover);

export default router;
