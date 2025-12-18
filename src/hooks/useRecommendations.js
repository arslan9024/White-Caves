import { useState, useEffect, useCallback } from 'react';

const BEHAVIOR_STORAGE_KEY = 'whitecaves_user_behavior';
const PREFERENCES_STORAGE_KEY = 'whitecaves_user_preferences';

export function useUserBehavior() {
  const [behavior, setBehavior] = useState(() => {
    try {
      const stored = localStorage.getItem(BEHAVIOR_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {
        viewedProperties: [],
        savedProperties: [],
        searchHistory: [],
        clickedLocations: [],
        priceRangeViewed: { min: null, max: null }
      };
    } catch {
      return {
        viewedProperties: [],
        savedProperties: [],
        searchHistory: [],
        clickedLocations: [],
        priceRangeViewed: { min: null, max: null }
      };
    }
  });

  useEffect(() => {
    localStorage.setItem(BEHAVIOR_STORAGE_KEY, JSON.stringify(behavior));
  }, [behavior]);

  const trackPropertyView = useCallback((property) => {
    setBehavior(prev => {
      const viewedProperties = [
        { ...property, viewedAt: new Date().toISOString() },
        ...prev.viewedProperties.filter(p => p._id !== property._id)
      ].slice(0, 50);

      const priceRangeViewed = {
        min: prev.priceRangeViewed.min 
          ? Math.min(prev.priceRangeViewed.min, property.price)
          : property.price,
        max: prev.priceRangeViewed.max
          ? Math.max(prev.priceRangeViewed.max, property.price)
          : property.price
      };

      return { ...prev, viewedProperties, priceRangeViewed };
    });

    fetch('/api/recommendations/track-behavior', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'view',
        propertyId: property._id,
        metadata: { location: property.location, type: property.type, price: property.price }
      })
    }).catch(() => {});
  }, []);

  const trackPropertySave = useCallback((property) => {
    setBehavior(prev => ({
      ...prev,
      savedProperties: [
        { ...property, savedAt: new Date().toISOString() },
        ...prev.savedProperties.filter(p => p._id !== property._id)
      ].slice(0, 100)
    }));
  }, []);

  const trackSearch = useCallback((searchParams) => {
    setBehavior(prev => ({
      ...prev,
      searchHistory: [
        { ...searchParams, searchedAt: new Date().toISOString() },
        ...prev.searchHistory
      ].slice(0, 20)
    }));
  }, []);

  const trackLocationClick = useCallback((location) => {
    setBehavior(prev => {
      const existing = prev.clickedLocations.find(l => l.name === location);
      if (existing) {
        return {
          ...prev,
          clickedLocations: prev.clickedLocations.map(l =>
            l.name === location ? { ...l, count: l.count + 1 } : l
          )
        };
      }
      return {
        ...prev,
        clickedLocations: [...prev.clickedLocations, { name: location, count: 1 }]
      };
    });
  }, []);

  const clearBehavior = useCallback(() => {
    setBehavior({
      viewedProperties: [],
      savedProperties: [],
      searchHistory: [],
      clickedLocations: [],
      priceRangeViewed: { min: null, max: null }
    });
  }, []);

  return {
    behavior,
    trackPropertyView,
    trackPropertySave,
    trackSearch,
    trackLocationClick,
    clearBehavior
  };
}

export function useUserPreferences() {
  const [preferences, setPreferences] = useState(() => {
    try {
      const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {
        propertyType: null,
        minPrice: null,
        maxPrice: null,
        bedrooms: null,
        locations: [],
        amenities: []
      };
    } catch {
      return {
        propertyType: null,
        minPrice: null,
        maxPrice: null,
        bedrooms: null,
        locations: [],
        amenities: []
      };
    }
  });

  useEffect(() => {
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const updatePreferences = useCallback((updates) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  }, []);

  return { preferences, updatePreferences };
}

export function useRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { behavior } = useUserBehavior();
  const { preferences } = useUserPreferences();

  const fetchRecommendations = useCallback(async (limit = 10) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/recommendations/ai-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPreferences: preferences,
          userHistory: behavior,
          limit
        })
      });

      const data = await response.json();

      if (data.success) {
        setRecommendations(data.recommendations);
      } else {
        throw new Error(data.error || 'Failed to fetch recommendations');
      }
    } catch (err) {
      setError(err.message);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, [behavior, preferences]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return {
    recommendations,
    loading,
    error,
    refresh: fetchRecommendations
  };
}
