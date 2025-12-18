import express from 'express';

const router = express.Router();

function calculatePropertyScore(property, userPreferences, userHistory) {
  let score = 0;
  const weights = {
    priceMatch: 30,
    locationMatch: 25,
    typeMatch: 20,
    bedroomMatch: 15,
    similarViewed: 10
  };

  if (userPreferences.minPrice && userPreferences.maxPrice) {
    const priceInRange = property.price >= userPreferences.minPrice && 
                         property.price <= userPreferences.maxPrice;
    if (priceInRange) {
      score += weights.priceMatch;
    } else {
      const priceDiff = Math.min(
        Math.abs(property.price - userPreferences.minPrice),
        Math.abs(property.price - userPreferences.maxPrice)
      );
      const priceRange = userPreferences.maxPrice - userPreferences.minPrice;
      const priceScore = Math.max(0, 1 - (priceDiff / priceRange)) * weights.priceMatch;
      score += priceScore;
    }
  }

  if (userPreferences.locations?.length > 0) {
    const locationMatch = userPreferences.locations.some(loc => 
      property.location?.toLowerCase().includes(loc.toLowerCase())
    );
    if (locationMatch) score += weights.locationMatch;
  }

  if (userPreferences.propertyType) {
    if (property.type?.toLowerCase() === userPreferences.propertyType.toLowerCase()) {
      score += weights.typeMatch;
    }
  }

  if (userPreferences.bedrooms) {
    const bedroomDiff = Math.abs(property.bedrooms - userPreferences.bedrooms);
    score += Math.max(0, weights.bedroomMatch - (bedroomDiff * 3));
  }

  if (userHistory?.viewedProperties?.length > 0) {
    const viewedLocations = userHistory.viewedProperties.map(p => p.location);
    const viewedTypes = userHistory.viewedProperties.map(p => p.type);
    
    if (viewedLocations.includes(property.location)) score += weights.similarViewed / 2;
    if (viewedTypes.includes(property.type)) score += weights.similarViewed / 2;
  }

  if (property.featured) score += 5;
  if (property.images?.length > 3) score += 3;
  if (property.virtualTour) score += 5;

  return Math.min(100, Math.round(score));
}

function generateRecommendations(properties, userPreferences, userHistory, limit = 10) {
  const scoredProperties = properties.map(property => ({
    ...property,
    matchScore: calculatePropertyScore(property, userPreferences, userHistory),
    matchReasons: getMatchReasons(property, userPreferences)
  }));

  return scoredProperties
    .filter(p => p.matchScore > 20)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}

function getMatchReasons(property, preferences) {
  const reasons = [];

  if (preferences.locations?.some(loc => 
    property.location?.toLowerCase().includes(loc.toLowerCase())
  )) {
    reasons.push('Matches your preferred location');
  }

  if (preferences.minPrice && preferences.maxPrice) {
    if (property.price >= preferences.minPrice && property.price <= preferences.maxPrice) {
      reasons.push('Within your budget');
    }
  }

  if (preferences.propertyType && 
      property.type?.toLowerCase() === preferences.propertyType.toLowerCase()) {
    reasons.push(`${property.type} - your preferred type`);
  }

  if (preferences.bedrooms && property.bedrooms === preferences.bedrooms) {
    reasons.push(`${property.bedrooms} bedrooms as requested`);
  }

  if (property.featured) {
    reasons.push('Featured property');
  }

  if (property.virtualTour) {
    reasons.push('Virtual tour available');
  }

  return reasons.slice(0, 3);
}

router.post('/ai-recommendations', async (req, res) => {
  try {
    const { userPreferences, userHistory, limit = 10 } = req.body;

    const sampleProperties = [
      {
        _id: '1',
        title: 'Luxury Villa in Palm Jumeirah',
        type: 'Villa',
        price: 15000000,
        location: 'Palm Jumeirah',
        bedrooms: 5,
        bathrooms: 6,
        area: 8500,
        images: ['/property1.jpg'],
        featured: true,
        virtualTour: true
      },
      {
        _id: '2',
        title: 'Modern Apartment in Downtown',
        type: 'Apartment',
        price: 3500000,
        location: 'Downtown Dubai',
        bedrooms: 2,
        bathrooms: 2,
        area: 1800,
        images: ['/property2.jpg'],
        featured: false
      },
      {
        _id: '3',
        title: 'Penthouse in Dubai Marina',
        type: 'Penthouse',
        price: 8000000,
        location: 'Dubai Marina',
        bedrooms: 4,
        bathrooms: 5,
        area: 5200,
        images: ['/property3.jpg'],
        featured: true,
        virtualTour: true
      },
      {
        _id: '4',
        title: 'Family Villa in Arabian Ranches',
        type: 'Villa',
        price: 6500000,
        location: 'Arabian Ranches',
        bedrooms: 4,
        bathrooms: 4,
        area: 4500,
        images: ['/property4.jpg'],
        featured: false
      },
      {
        _id: '5',
        title: 'Luxury Townhouse in JBR',
        type: 'Townhouse',
        price: 4200000,
        location: 'JBR',
        bedrooms: 3,
        bathrooms: 3,
        area: 2800,
        images: ['/property5.jpg'],
        featured: true
      }
    ];

    const recommendations = generateRecommendations(
      sampleProperties,
      userPreferences || {},
      userHistory || {},
      limit
    );

    res.json({
      success: true,
      recommendations,
      totalMatches: recommendations.length,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate recommendations' 
    });
  }
});

router.post('/track-behavior', async (req, res) => {
  try {
    const { userId, action, propertyId, metadata } = req.body;

    const behaviorLog = {
      userId,
      action,
      propertyId,
      metadata,
      timestamp: new Date().toISOString()
    };

    console.log('User behavior tracked:', behaviorLog);

    res.json({ success: true, tracked: behaviorLog });
  } catch (error) {
    console.error('Behavior tracking error:', error);
    res.status(500).json({ success: false, error: 'Failed to track behavior' });
  }
});

router.get('/trending', async (req, res) => {
  try {
    const trendingProperties = [
      {
        _id: '1',
        title: 'Luxury Villa in Palm Jumeirah',
        type: 'Villa',
        price: 15000000,
        location: 'Palm Jumeirah',
        views: 1250,
        inquiries: 45
      },
      {
        _id: '3',
        title: 'Penthouse in Dubai Marina',
        type: 'Penthouse',
        price: 8000000,
        location: 'Dubai Marina',
        views: 980,
        inquiries: 32
      }
    ];

    res.json({
      success: true,
      trending: trendingProperties,
      period: 'last_7_days'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get trending' });
  }
});

export default router;
