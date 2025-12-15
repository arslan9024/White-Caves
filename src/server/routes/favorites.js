import express from 'express';
import Favorite from '../models/Favorite.js';
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
  const favorites = await Favorite.find({ user: req.params.userId })
    .populate('property')
    .sort({ createdAt: -1 });
  res.json(favorites);
}));

router.post('/', requireDB, asyncHandler(async (req, res) => {
  const { userId, propertyId, notes } = req.body;
  
  const existing = await Favorite.findOne({ user: userId, property: propertyId });
  if (existing) {
    return res.status(409).json({ error: 'Property already in favorites' });
  }
  
  const favorite = new Favorite({
    user: userId,
    property: propertyId,
    notes
  });
  
  await favorite.save();
  const populated = await favorite.populate('property');
  res.status(201).json(populated);
}));

router.delete('/:userId/:propertyId', requireDB, asyncHandler(async (req, res) => {
  const result = await Favorite.findOneAndDelete({
    user: req.params.userId,
    property: req.params.propertyId
  });
  
  if (!result) {
    return res.status(404).json({ error: 'Favorite not found' });
  }
  
  res.json({ message: 'Removed from favorites' });
}));

router.get('/:userId/check/:propertyId', requireDB, asyncHandler(async (req, res) => {
  const exists = await Favorite.exists({
    user: req.params.userId,
    property: req.params.propertyId
  });
  res.json({ isFavorite: !!exists });
}));

export default router;
