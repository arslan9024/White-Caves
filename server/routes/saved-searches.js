import express from 'express';
import SavedSearch from '../models/SavedSearch.js';
import Property from '../models/Property.js';

const router = express.Router();

// Get all saved searches for user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const searches = await SavedSearch.find({ userId }).sort({ createdAt: -1 });

    res.json(searches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch saved searches' });
  }
});

// Create saved search
router.post('/', async (req, res) => {
  try {
    const { userId, name, filters, alertEnabled, alertFrequency, notificationEmail } = req.body;

    const savedSearch = new SavedSearch({
      userId,
      name,
      filters,
      alertEnabled,
      alertFrequency,
      notificationEmail
    });

    await savedSearch.save();

    res.status(201).json({
      message: 'Search saved successfully',
      search: savedSearch
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save search' });
  }
});

// Get saved search by ID
router.get('/:searchId', async (req, res) => {
  try {
    const { searchId } = req.params;

    const search = await SavedSearch.findById(searchId);

    if (!search) {
      return res.status(404).json({ error: 'Saved search not found' });
    }

    res.json(search);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch saved search' });
  }
});

// Update saved search
router.patch('/:searchId', async (req, res) => {
  try {
    const { searchId } = req.params;
    const { name, filters, alertEnabled, alertFrequency, notificationEmail } = req.body;

    const search = await SavedSearch.findByIdAndUpdate(
      searchId,
      {
        name,
        filters,
        alertEnabled,
        alertFrequency,
        notificationEmail,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!search) {
      return res.status(404).json({ error: 'Saved search not found' });
    }

    res.json({
      message: 'Search updated successfully',
      search
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update saved search' });
  }
});

// Delete saved search
router.delete('/:searchId', async (req, res) => {
  try {
    const { searchId } = req.params;

    const search = await SavedSearch.findByIdAndDelete(searchId);

    if (!search) {
      return res.status(404).json({ error: 'Saved search not found' });
    }

    res.json({
      message: 'Saved search deleted'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete saved search' });
  }
});

// Execute saved search (get matching properties)
router.get('/:searchId/results', async (req, res) => {
  try {
    const { searchId } = req.params;
    const { limit = 20, skip = 0 } = req.query;

    const search = await SavedSearch.findById(searchId);

    if (!search) {
      return res.status(404).json({ error: 'Saved search not found' });
    }

    // Build query from saved filters
    const query = { status: 'available' };

    if (search.filters.minPrice || search.filters.maxPrice) {
      query.price = {};
      if (search.filters.minPrice) query.price.$gte = search.filters.minPrice;
      if (search.filters.maxPrice) query.price.$lte = search.filters.maxPrice;
    }

    if (search.filters.areas && search.filters.areas.length > 0) {
      query.area = { $in: search.filters.areas };
    }

    if (search.filters.propertyTypes && search.filters.propertyTypes.length > 0) {
      query.propertyType = { $in: search.filters.propertyTypes };
    }

    if (search.filters.bedrooms) {
      if (search.filters.bedrooms.min) {
        query.bedrooms = query.bedrooms || {};
        query.bedrooms.$gte = search.filters.bedrooms.min;
      }
      if (search.filters.bedrooms.max) {
        query.bedrooms = query.bedrooms || {};
        query.bedrooms.$lte = search.filters.bedrooms.max;
      }
    }

    if (search.filters.amenities && search.filters.amenities.length > 0) {
      query.amenities = { $in: search.filters.amenities };
    }

    // Sort
    let sortOption = { createdAt: -1 };
    if (search.sortBy === 'price_asc') sortOption = { price: 1 };
    else if (search.sortBy === 'price_desc') sortOption = { price: -1 };
    else if (search.sortBy === 'area_desc') sortOption = { area: -1 };

    const results = await Property.find(query)
      .sort(sortOption)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .lean();

    const total = await Property.countDocuments(query);

    // Update view count and last searched
    await SavedSearch.findByIdAndUpdate(searchId, {
      $inc: { viewCount: 1 },
      lastSearched: new Date()
    });

    res.json({
      results,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip),
      searchName: search.name
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to execute search' });
  }
});

export default router;
