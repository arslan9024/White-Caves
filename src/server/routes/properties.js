import express from 'express';
import Property from '../models/Property.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const properties = await Property.find()
      .populate('owner')
      .populate('propertyManagerId');
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner')
      .populate('propertyManagerId');
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

router.post('/', async (req, res) => {
  try {
    const property = new Property(req.body);
    await property.save();
    res.status(201).json(property);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

router.put('/:id/assign-manager', async (req, res) => {
  try {
    const { propertyManagerId } = req.body;
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { propertyManagerId },
      { new: true, runValidators: true }
    ).populate('propertyManagerId');
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    console.error('Error assigning property manager:', error);
    res.status(500).json({ error: 'Failed to assign property manager' });
  }
});

export default router;
