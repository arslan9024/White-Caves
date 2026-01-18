import express from 'express';
import Property from '../models/Property.js';
import Viewing from '../models/Viewing.js';

const router = express.Router();

// Get property by ID with full details
router.get('/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const property = await Property.findOne({
      $or: [
        { _id: propertyId },
        { propertyCode: propertyId }
      ]
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(property);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// Get similar properties based on area, type, price range
router.get('/:propertyId/similar', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const limit = parseInt(req.query.limit || 6);

    const property = await Property.findOne({
      $or: [
        { _id: propertyId },
        { propertyCode: propertyId }
      ]
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Find similar properties: same area, same type, similar price range (±20%)
    const minPrice = property.price * 0.8;
    const maxPrice = property.price * 1.2;

    const similar = await Property.find({
      _id: { $ne: property._id },
      area: property.area,
      propertyType: property.propertyType,
      price: { $gte: minPrice, $lte: maxPrice },
      status: 'available'
    })
      .limit(limit)
      .lean();

    res.json(similar);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch similar properties' });
  }
});

// Get property documents
router.get('/:propertyId/documents', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const property = await Property.findOne({
      $or: [
        { _id: propertyId },
        { propertyCode: propertyId }
      ]
    }).select('documents title');

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json({
      propertyTitle: property.title,
      documents: property.documents || []
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch property documents' });
  }
});

// Get properties with facets for search optimization
router.get('/facets/search', async (req, res) => {
  try {
    const { area, propertyType, minPrice, maxPrice } = req.query;

    // Build filter pipeline
    const matchStage = { status: 'available' };
    if (area) matchStage.area = area;
    if (propertyType) matchStage.propertyType = propertyType;
    if (minPrice || maxPrice) {
      matchStage.price = {};
      if (minPrice) matchStage.price.$gte = parseInt(minPrice);
      if (maxPrice) matchStage.price.$lte = parseInt(maxPrice);
    }

    const facets = await Property.aggregate([
      { $match: matchStage },
      {
        $facet: {
          areas: [
            { $group: { _id: '$area', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          propertyTypes: [
            { $group: { _id: '$propertyType', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          priceRange: [
            {
              $group: {
                _id: null,
                min: { $min: '$price' },
                max: { $max: '$price' }
              }
            }
          ],
          bedrooms: [
            { $group: { _id: '$bedrooms', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
          ]
        }
      }
    ]);

    res.json(facets[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch facets' });
  }
});

// Autocomplete suggestions for property search
router.get('/suggestions/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json([]);
    }

    // Search in title, area, and description
    const suggestions = await Property.aggregate([
      {
        $match: {
          $or: [
            { title: { $regex: q, $options: 'i' } },
            { area: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } }
          ]
        }
      },
      {
        $group: {
          _id: null,
          areas: { $addToSet: '$area' },
          types: { $addToSet: '$propertyType' },
          titles: { $addToSet: '$title' }
        }
      },
      {
        $project: {
          _id: 0,
          areas: { $slice: ['$areas', 5] },
          types: { $slice: ['$types', 5] },
          titles: { $slice: ['$titles', 5] }
        }
      }
    ]);

    const result = suggestions[0] || { areas: [], types: [], titles: [] };

    res.json({
      areas: result.areas,
      types: result.types,
      properties: result.titles
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

// Search with full-text index
router.get('/search/full-text', async (req, res) => {
  try {
    const { q, limit = 20, skip = 0 } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const results = await Property.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .lean();

    const total = await Property.countDocuments({
      $text: { $search: q }
    });

    res.json({
      results,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get property comparisons
router.post('/compare', async (req, res) => {
  try {
    const { propertyIds } = req.body;

    if (!Array.isArray(propertyIds) || propertyIds.length === 0) {
      return res.status(400).json({ error: 'Property IDs required' });
    }

    const properties = await Property.find({
      _id: { $in: propertyIds }
    }).select(
      'title price bedrooms bathrooms area amenities image description propertyType status'
    );

    res.json(properties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch comparisons' });
  }
});

// Get property viewings history
router.get('/:propertyId/viewings', async (req, res) => {
  try {
    const { propertyId } = req.params;

    const viewings = await Viewing.find({ propertyId })
      .populate('leadId', 'name email phone')
      .populate('agentId', 'name email')
      .sort({ scheduledDate: -1 })
      .lean();

    res.json(viewings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch viewings' });
  }
});

export default router;
