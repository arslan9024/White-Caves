import express from 'express';
import SavedSearch from '../models/SavedSearch.js';
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
  const searches = await SavedSearch.find({ user: req.params.userId })
    .sort({ updatedAt: -1 });
  res.json(searches);
}));

router.post('/', requireDB, asyncHandler(async (req, res) => {
  const { userId, name, filters, alertEnabled, alertFrequency } = req.body;
  
  const savedSearch = new SavedSearch({
    user: userId,
    name,
    filters,
    alertEnabled: alertEnabled || false,
    alertFrequency: alertFrequency || 'daily'
  });
  
  await savedSearch.save();
  res.status(201).json(savedSearch);
}));

router.put('/:id', requireDB, asyncHandler(async (req, res) => {
  const { name, filters, alertEnabled, alertFrequency } = req.body;
  
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  const validFrequencies = ['instant', 'daily', 'weekly'];
  if (alertFrequency && !validFrequencies.includes(alertFrequency)) {
    return res.status(400).json({ error: 'Invalid alert frequency' });
  }
  
  const savedSearch = await SavedSearch.findByIdAndUpdate(
    req.params.id,
    { name: name.trim(), filters, alertEnabled, alertFrequency, updatedAt: new Date() },
    { new: true, runValidators: true }
  );
  
  if (!savedSearch) {
    return res.status(404).json({ error: 'Saved search not found' });
  }
  
  res.json(savedSearch);
}));

router.delete('/:id', requireDB, asyncHandler(async (req, res) => {
  const result = await SavedSearch.findByIdAndDelete(req.params.id);
  
  if (!result) {
    return res.status(404).json({ error: 'Saved search not found' });
  }
  
  res.json({ message: 'Saved search deleted' });
}));

router.patch('/:id/toggle-alert', requireDB, asyncHandler(async (req, res) => {
  const savedSearch = await SavedSearch.findById(req.params.id);
  
  if (!savedSearch) {
    return res.status(404).json({ error: 'Saved search not found' });
  }
  
  savedSearch.alertEnabled = !savedSearch.alertEnabled;
  await savedSearch.save();
  
  res.json(savedSearch);
}));

export default router;
