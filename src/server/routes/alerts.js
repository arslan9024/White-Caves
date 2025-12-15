import express from 'express';
import Alert from '../models/Alert.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { isMongoDBConnected } from '../index.js';

const router = express.Router();

const requireDB = (req, res, next) => {
  if (!isMongoDBConnected) {
    return res.status(503).json({ error: 'Database not available' });
  }
  next();
};

router.get('/:userId', requireDB, asyncHandler(async (req, res) => {
  const { unreadOnly, limit = 20, offset = 0 } = req.query;
  
  const query = { user: req.params.userId };
  if (unreadOnly === 'true') {
    query.read = false;
  }
  
  const alerts = await Alert.find(query)
    .populate('property')
    .sort({ createdAt: -1 })
    .skip(parseInt(offset))
    .limit(parseInt(limit));
  
  const total = await Alert.countDocuments(query);
  const unreadCount = await Alert.countDocuments({ user: req.params.userId, read: false });
  
  res.json({ alerts, total, unreadCount });
}));

router.post('/', requireDB, asyncHandler(async (req, res) => {
  const { userId, type, propertyId, savedSearchId, title, message, data } = req.body;
  
  const alert = new Alert({
    user: userId,
    type,
    property: propertyId,
    savedSearch: savedSearchId,
    title,
    message,
    data
  });
  
  await alert.save();
  res.status(201).json(alert);
}));

router.patch('/:id/read', requireDB, asyncHandler(async (req, res) => {
  const alert = await Alert.findByIdAndUpdate(
    req.params.id,
    { read: true },
    { new: true }
  );
  
  if (!alert) {
    return res.status(404).json({ error: 'Alert not found' });
  }
  
  res.json(alert);
}));

router.patch('/:userId/read-all', requireDB, asyncHandler(async (req, res) => {
  await Alert.updateMany(
    { user: req.params.userId, read: false },
    { read: true }
  );
  
  res.json({ message: 'All alerts marked as read' });
}));

router.delete('/:id', requireDB, asyncHandler(async (req, res) => {
  const result = await Alert.findByIdAndDelete(req.params.id);
  
  if (!result) {
    return res.status(404).json({ error: 'Alert not found' });
  }
  
  res.json({ message: 'Alert deleted' });
}));

router.delete('/:userId/clear-all', requireDB, asyncHandler(async (req, res) => {
  await Alert.deleteMany({ user: req.params.userId });
  res.json({ message: 'All alerts cleared' });
}));

export default router;
