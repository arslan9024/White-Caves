import express from 'express';
import OliviaService from '../services/oliviaService.js';
import HomepageFeature from '../models/HomepageFeature.js';

const router = express.Router();

let cache = {
  data: null,
  timestamp: null,
  dateKey: null
};
const CACHE_DURATION = 5 * 60 * 1000;

const getDubaiDateKey = () => {
  const now = new Date();
  const dubaiOffset = 4 * 60 * 60 * 1000;
  const dubaiTime = new Date(now.getTime() + dubaiOffset);
  return dubaiTime.toISOString().split('T')[0];
};

router.get('/', async (req, res) => {
  try {
    const todayKey = getDubaiDateKey();

    if (cache.data && cache.dateKey === todayKey && 
        (Date.now() - cache.timestamp) < CACHE_DURATION) {
      return res.json({
        success: true,
        source: 'cache',
        ...cache.data
      });
    }

    const featured = await OliviaService.getTodaysFeatured();

    if (!featured) {
      return res.status(404).json({
        success: false,
        message: 'No featured properties available'
      });
    }

    const responseData = {
      dateActive: featured.dateActive,
      featuredProperties: featured.featuredProperties,
      totalAvailable: featured.totalAvailable,
      generatedAt: featured.generatedAt,
      generatedBy: featured.generatedBy,
      selectionMethod: featured.selectionMethod
    };

    cache = {
      data: responseData,
      timestamp: Date.now(),
      dateKey: todayKey
    };

    res.json({
      success: true,
      source: 'database',
      ...responseData
    });

  } catch (error) {
    console.error('Error fetching featured properties:', error);

    if (cache.data) {
      return res.json({
        success: true,
        source: 'expired_cache',
        message: 'Serving from cache due to error',
        ...cache.data
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const result = await OliviaService.manualRefresh();

    cache = {
      data: null,
      timestamp: null,
      dateKey: null
    };

    res.json(result);
  } catch (error) {
    console.error('Error refreshing featured properties:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/history', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const history = await HomepageFeature.find({
      dateActive: { $gte: startDate }
    }).sort({ dateActive: -1 }).lean();

    res.json({
      success: true,
      history: history.map(h => ({
        date: h.dateActive,
        propertyCount: h.featuredProperties.length,
        totalAvailable: h.totalAvailable,
        generatedAt: h.generatedAt
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/clear-cache', async (req, res) => {
  cache = {
    data: null,
    timestamp: null,
    dateKey: null
  };
  res.json({ success: true, message: 'Cache cleared' });
});

export default router;
