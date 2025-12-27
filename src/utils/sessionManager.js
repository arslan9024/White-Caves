const STORAGE_KEYS = {
  PREFERENCES: 'wc_user_preferences',
  SEARCH_HISTORY: 'wc_search_history',
  FAVORITES: 'wc_favorites',
  RECENTLY_VIEWED: 'wc_recently_viewed',
  FORM_DATA: 'wc_form_data',
  SESSION_DATA: 'wc_session_data'
};

const simpleEncrypt = (text) => {
  try {
    const encoded = btoa(encodeURIComponent(text));
    return encoded.split('').reverse().join('');
  } catch (e) {
    console.error('Encryption error:', e);
    return text;
  }
};

const simpleDecrypt = (text) => {
  try {
    const reversed = text.split('').reverse().join('');
    return decodeURIComponent(atob(reversed));
  } catch (e) {
    console.error('Decryption error:', e);
    return text;
  }
};

const safeJSONParse = (str, fallback = null) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
};

export const sessionManager = {
  savePreferences: (preferences) => {
    try {
      const encrypted = simpleEncrypt(JSON.stringify(preferences));
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, encrypted);
      return true;
    } catch (e) {
      console.error('Error saving preferences:', e);
      return false;
    }
  },

  getPreferences: () => {
    try {
      const encrypted = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (!encrypted) return getDefaultPreferences();
      const decrypted = simpleDecrypt(encrypted);
      return safeJSONParse(decrypted, getDefaultPreferences());
    } catch (e) {
      console.error('Error getting preferences:', e);
      return getDefaultPreferences();
    }
  },

  addToSearchHistory: (searchQuery) => {
    try {
      const history = sessionManager.getSearchHistory();
      const newEntry = {
        query: searchQuery,
        timestamp: Date.now(),
        id: Date.now().toString()
      };
      
      const existingIndex = history.findIndex(h => 
        JSON.stringify(h.query) === JSON.stringify(searchQuery)
      );
      
      if (existingIndex > -1) {
        history.splice(existingIndex, 1);
      }
      
      history.unshift(newEntry);
      const trimmedHistory = history.slice(0, 20);
      
      const encrypted = simpleEncrypt(JSON.stringify(trimmedHistory));
      localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, encrypted);
      return true;
    } catch (e) {
      console.error('Error adding to search history:', e);
      return false;
    }
  },

  getSearchHistory: () => {
    try {
      const encrypted = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
      if (!encrypted) return [];
      const decrypted = simpleDecrypt(encrypted);
      return safeJSONParse(decrypted, []);
    } catch (e) {
      console.error('Error getting search history:', e);
      return [];
    }
  },

  clearSearchHistory: () => {
    localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
  },

  addToFavorites: (property) => {
    try {
      const favorites = sessionManager.getFavorites();
      const existingIndex = favorites.findIndex(f => f.id === property.id);
      
      if (existingIndex === -1) {
        favorites.unshift({
          ...property,
          addedAt: Date.now()
        });
      }
      
      const encrypted = simpleEncrypt(JSON.stringify(favorites));
      localStorage.setItem(STORAGE_KEYS.FAVORITES, encrypted);
      return true;
    } catch (e) {
      console.error('Error adding to favorites:', e);
      return false;
    }
  },

  removeFromFavorites: (propertyId) => {
    try {
      const favorites = sessionManager.getFavorites();
      const filtered = favorites.filter(f => f.id !== propertyId);
      const encrypted = simpleEncrypt(JSON.stringify(filtered));
      localStorage.setItem(STORAGE_KEYS.FAVORITES, encrypted);
      return true;
    } catch (e) {
      console.error('Error removing from favorites:', e);
      return false;
    }
  },

  getFavorites: () => {
    try {
      const encrypted = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (!encrypted) return [];
      const decrypted = simpleDecrypt(encrypted);
      return safeJSONParse(decrypted, []);
    } catch (e) {
      console.error('Error getting favorites:', e);
      return [];
    }
  },

  isFavorite: (propertyId) => {
    const favorites = sessionManager.getFavorites();
    return favorites.some(f => f.id === propertyId);
  },

  addToRecentlyViewed: (property) => {
    try {
      const recentlyViewed = sessionManager.getRecentlyViewed();
      const existingIndex = recentlyViewed.findIndex(r => r.id === property.id);
      
      if (existingIndex > -1) {
        recentlyViewed.splice(existingIndex, 1);
      }
      
      recentlyViewed.unshift({
        ...property,
        viewedAt: Date.now()
      });
      
      const trimmed = recentlyViewed.slice(0, 10);
      const encrypted = simpleEncrypt(JSON.stringify(trimmed));
      localStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, encrypted);
      return true;
    } catch (e) {
      console.error('Error adding to recently viewed:', e);
      return false;
    }
  },

  getRecentlyViewed: () => {
    try {
      const encrypted = localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED);
      if (!encrypted) return [];
      const decrypted = simpleDecrypt(encrypted);
      return safeJSONParse(decrypted, []);
    } catch (e) {
      console.error('Error getting recently viewed:', e);
      return [];
    }
  },

  saveFormData: (formId, data) => {
    try {
      const sensitiveFields = ['password', 'cardNumber', 'cvv', 'ssn', 'pin'];
      const sanitizedData = { ...data };
      
      sensitiveFields.forEach(field => {
        if (sanitizedData[field]) {
          delete sanitizedData[field];
        }
      });
      
      const allFormData = sessionManager.getAllFormData();
      allFormData[formId] = {
        data: sanitizedData,
        timestamp: Date.now()
      };
      
      const encrypted = simpleEncrypt(JSON.stringify(allFormData));
      sessionStorage.setItem(STORAGE_KEYS.FORM_DATA, encrypted);
      return true;
    } catch (e) {
      console.error('Error saving form data:', e);
      return false;
    }
  },

  getFormData: (formId) => {
    try {
      const allFormData = sessionManager.getAllFormData();
      return allFormData[formId]?.data || {};
    } catch (e) {
      console.error('Error getting form data:', e);
      return {};
    }
  },

  getAllFormData: () => {
    try {
      const encrypted = sessionStorage.getItem(STORAGE_KEYS.FORM_DATA);
      if (!encrypted) return {};
      const decrypted = simpleDecrypt(encrypted);
      return safeJSONParse(decrypted, {});
    } catch (e) {
      console.error('Error getting all form data:', e);
      return {};
    }
  },

  saveSessionData: (key, value) => {
    try {
      const sessionData = sessionManager.getSessionData();
      sessionData[key] = value;
      sessionStorage.setItem(STORAGE_KEYS.SESSION_DATA, JSON.stringify(sessionData));
      return true;
    } catch (e) {
      console.error('Error saving session data:', e);
      return false;
    }
  },

  getSessionData: (key = null) => {
    try {
      const data = sessionStorage.getItem(STORAGE_KEYS.SESSION_DATA);
      const parsed = safeJSONParse(data, {});
      return key ? parsed[key] : parsed;
    } catch (e) {
      console.error('Error getting session data:', e);
      return key ? null : {};
    }
  },

  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  },

  getStorageStats: () => {
    const stats = {
      preferences: !!localStorage.getItem(STORAGE_KEYS.PREFERENCES),
      searchHistoryCount: sessionManager.getSearchHistory().length,
      favoritesCount: sessionManager.getFavorites().length,
      recentlyViewedCount: sessionManager.getRecentlyViewed().length
    };
    return stats;
  }
};

function getDefaultPreferences() {
  return {
    theme: 'light',
    currency: 'AED',
    language: 'en',
    notifications: true,
    defaultView: 'grid',
    propertyType: 'all',
    priceRange: { min: 0, max: 50000000 },
    bedroomFilter: 'any',
    savedFilters: []
  };
}

export const useAutofill = (formId) => {
  const getSuggestions = (fieldName, currentValue) => {
    const formData = sessionManager.getFormData(formId);
    const searchHistory = sessionManager.getSearchHistory();
    
    const suggestions = [];
    
    if (formData[fieldName] && formData[fieldName] !== currentValue) {
      suggestions.push({
        type: 'previous',
        value: formData[fieldName],
        label: `Previously entered: ${formData[fieldName]}`
      });
    }
    
    if (fieldName === 'location' || fieldName === 'area') {
      const locationSuggestions = searchHistory
        .filter(h => h.query?.location)
        .map(h => h.query.location)
        .filter((v, i, a) => a.indexOf(v) === i)
        .slice(0, 5);
      
      locationSuggestions.forEach(loc => {
        suggestions.push({
          type: 'history',
          value: loc,
          label: loc
        });
      });
    }
    
    return suggestions;
  };

  const saveField = (fieldName, value) => {
    const currentData = sessionManager.getFormData(formId);
    sessionManager.saveFormData(formId, {
      ...currentData,
      [fieldName]: value
    });
  };

  return { getSuggestions, saveField };
};

export default sessionManager;
