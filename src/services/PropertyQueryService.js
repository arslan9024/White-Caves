/**
 * PropertyQueryService
 * Handles intelligent property queries from Linda/Nina
 * Bridges natural language queries to structured database searches
 */

class PropertyQueryService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
  }

  /**
   * Parse natural language property requirements into structured filters
   * Examples:
   * - "2BR villa with pool in Arabian Ranches under 2.5M"
   * - "furnished studio in Downtown Dubai for rent"
   * - "family villa with garden near beach"
   */
  parseNaturalLanguageQuery(queryText) {
    const query = queryText.toLowerCase();
    const filters = {};

    // Room extraction: "1BR", "2BR", "3-bedroom", "studio"
    const roomMatch = query.match(/(\d)[\s-]?br(?:edroom)?|studio/i);
    if (roomMatch) {
      if (roomMatch[0].toLowerCase().includes('studio')) {
        filters.minRooms = 0;
        filters.maxRooms = 1;
      } else {
        const rooms = parseInt(roomMatch[1]);
        filters.minRooms = rooms;
        filters.maxRooms = rooms;
      }
    }

    // Property type extraction
    const propertyTypes = {
      villa: ['villa', 'standalone', 'detached'],
      townhouse: ['townhouse', 'town house', 'terrace'],
      apartment: ['apartment', 'apt', 'flat', 'condo'],
      penthouse: ['penthouse', 'pent house'],
      duplex: ['duplex'],
      plot: ['plot', 'land', 'vacant land']
    };

    for (const [type, keywords] of Object.entries(propertyTypes)) {
      if (keywords.some(kw => query.includes(kw))) {
        filters.propertyType = type;
        break;
      }
    }

    // Location/Area extraction
    const areas = [
      'arabian ranches', 'palm jumeirah', 'downtown dubai', 'marina',
      'jbr', 'jlt', 'difc', 'creek harbour', 'emirates living',
      'damac hills', 'jumeirah golf estates', 'the oasis'
    ];
    for (const area of areas) {
      if (query.includes(area)) {
        filters.area = area;
        break;
      }
    }

    // Furnishing level
    if (query.includes('furnished') || query.includes('fully furnished')) {
      filters.furnishingLevel = 'furnished';
    } else if (query.includes('semi-furnished') || query.includes('semi furnished')) {
      filters.furnishingLevel = 'semi_furnished';
    } else if (query.includes('unfurnished')) {
      filters.furnishingLevel = 'unfurnished';
    }

    // Purpose (sale/rent)
    if (query.includes(' for rent') || query.includes(' for lease') || query.includes('rental')) {
      filters.purpose = 'rent';
    } else if (query.includes(' for sale') || query.includes(' for buy')) {
      filters.purpose = 'sale';
    }

    // Price extraction (various formats: "under 2.5M", "2M to 3M", "min 500K")
    const priceMatch = query.match(/(?:under|below|max)\s+(?:aed\s+)?(\d+(?:\.\d+)?)\s*[mk](?:illions?)?|(\d+(?:\.\d+)?)\s*[km]\s+(?:to|until)\s+(?:aed\s+)?(\d+(?:\.\d+)?)\s*[mk]/i);
    
    if (priceMatch) {
      let maxPrice = 0;
      if (priceMatch[1]) {
        // "under X" format
        maxPrice = this.parsePrice(priceMatch[1] + (priceMatch[0].toLowerCase().includes('m') ? 'M' : 'K'));
      } else if (priceMatch[3]) {
        // "X to Y" format
        maxPrice = this.parsePrice(priceMatch[3] + (priceMatch[0].toLowerCase().includes('m') ? 'M' : 'K'));
      }
      if (maxPrice > 0) filters.maxPrice = maxPrice;
    }

    // Area size extraction (sqft/sqm)
    const areaMatch = query.match(/(\d+(?:\.\d+)?)\s*(?:sq\.?ft|sqft|sq\.?m|sqm)/i);
    if (areaMatch) {
      const area = parseInt(areaMatch[1]);
      filters.maxArea = area;
    }

    // Amenities (stored as tags/features)
    const amenities = ['pool', 'garden', 'gym', 'parking', 'balcony', 'laundry', 'ac', 'kitchen'];
    filters.tags = amenities.filter(amenity => query.includes(amenity));

    // View type
    if (query.includes('sea view') || query.includes('ocean view')) {
      filters.viewType = 'sea';
    } else if (query.includes('golf view')) {
      filters.viewType = 'golf';
    } else if (query.includes('marina view')) {
      filters.viewType = 'marina';
    }

    // Market availability
    if (query.includes('available')) {
      filters.marketAvailability = 'available_for_both';
    }

    return filters;
  }

  /**
   * Parse price strings like "2.5M", "500K" into numbers
   */
  parsePrice(priceStr) {
    const str = priceStr.toLowerCase().trim();
    const num = parseFloat(str);
    
    if (str.includes('m')) return num * 1000000;
    if (str.includes('k')) return num * 1000;
    
    return num;
  }

  /**
   * Format price for display
   */
  formatPrice(price) {
    if (price >= 1000000) {
      return `AED ${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `AED ${(price / 1000).toFixed(0)}K`;
    }
    return `AED ${price}`;
  }

  /**
   * Execute property query against API
   */
  async queryProperties(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add all filter parameters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            queryParams.append(key, value.join(','));
          } else {
            queryParams.append(key, value);
          }
        }
      });

      const response = await fetch(
        `${this.baseUrl}/api/inventory/query?${queryParams}`,
        { credentials: 'include' }
      );

      if (!response.ok) {
        throw new Error(`Query failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Property query error:', error);
      throw error;
    }
  }

  /**
   * Search properties using natural language
   * Used by Nina for bot responses
   */
  async searchPropertiesNaturalLanguage(queryText, limit = 5) {
    try {
      const filters = this.parseNaturalLanguageQuery(queryText);
      filters.limit = limit;

      const result = await this.queryProperties(filters);

      if (result.success && result.data.length > 0) {
        return {
          success: true,
          count: result.data.length,
          properties: result.data.map(p => ({
            id: p._id,
            pNumber: p.pNumber,
            area: p.area,
            type: p.propertyType,
            rooms: p.rooms,
            price: p.askingPrice,
            currency: p.currency,
            size: p.actualArea,
            furnishing: p.furnishingLevel,
            availability: p.marketAvailability,
            images: p.images,
            features: p.tags,
            description: this.generatePropertyDescription(p)
          })),
          query_filters: filters
        };
      }

      return {
        success: true,
        count: 0,
        properties: [],
        query_filters: filters,
        message: 'No properties found matching your criteria'
      };
    } catch (error) {
      console.error('Natural language search error:', error);
      return {
        success: false,
        error: error.message,
        count: 0,
        properties: []
      };
    }
  }

  /**
   * Generate human-readable property description for Linda/Nina
   */
  generatePropertyDescription(property) {
    const parts = [];

    // Type and location
    parts.push(`${property.rooms}BR ${property.propertyType}`);
    if (property.area) parts.push(`in ${property.area}`);

    // Size
    if (property.actualArea) {
      parts.push(`(${property.actualArea} sqft)`);
    }

    // Price
    if (property.askingPrice) {
      parts.push(`• ${this.formatPrice(property.askingPrice)}`);
    }

    // Features
    if (property.viewType) parts.push(`with ${property.viewType} view`);
    if (property.furnishingLevel) {
      parts.push(`${property.furnishingLevel.replace('_', ' ')}`);
    }

    // Status
    if (property.occupancyStatus === 'vacant') {
      parts.push('| Vacant - Ready');
    }

    return parts.join(' ');
  }

  /**
   * Get property by ID with full details
   */
  async getPropertyDetails(propertyId) {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/inventory/${propertyId}`,
        { credentials: 'include' }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch property: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        property: data
      };
    } catch (error) {
      console.error('Property detail fetch error:', error);
      throw error;
    }
  }

  /**
   * Get advanced statistics on inventory
   * Used by Mary for dashboard
   */
  async getInventoryStatistics() {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/inventory/statistics`,
        { credentials: 'include' }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch statistics: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Statistics fetch error:', error);
      throw error;
    }
  }

  /**
   * Suggest properties based on user preferences
   * Used by Linda for lead matching
   */
  async suggestPropertiesForLead(leadProfile) {
    try {
      // Convert lead profile to query filters
      const filters = {
        minRooms: leadProfile.minBedrooms,
        maxRooms: leadProfile.maxBedrooms,
        minPrice: leadProfile.minBudget,
        maxPrice: leadProfile.maxBudget,
        area: leadProfile.preferredAreas?.[0],
        propertyType: leadProfile.preferredPropertyType,
        purpose: leadProfile.purpose,
        furnishingLevel: leadProfile.preferredFurnishing,
        limit: 5
      };

      // Remove undefined values
      Object.keys(filters).forEach(key => 
        filters[key] === undefined && delete filters[key]
      );

      const result = await this.queryProperties(filters);

      return {
        success: true,
        suggestions: result.data || [],
        matchScore: this.calculateMatchScore(leadProfile, result.data || [])
      };
    } catch (error) {
      console.error('Property suggestion error:', error);
      throw error;
    }
  }

  /**
   * Calculate match score between lead and properties
   */
  calculateMatchScore(lead, properties) {
    if (properties.length === 0) return 0;

    let totalScore = 0;

    properties.forEach(prop => {
      let score = 0;

      // Room match (25 points)
      if (lead.minBedrooms && prop.rooms >= lead.minBedrooms) score += 25;
      if (lead.maxBedrooms && prop.rooms <= lead.maxBedrooms) score += 25;

      // Price match (25 points)
      if (lead.maxBudget && prop.askingPrice <= lead.maxBudget) score += 25;
      if (lead.minBudget && prop.askingPrice >= lead.minBudget) score += 25;

      // Area match (15 points)
      if (lead.preferredAreas?.includes(prop.area)) score += 15;

      // Type match (10 points)
      if (lead.preferredPropertyType === prop.propertyType) score += 10;

      totalScore += score;
    });

    return Math.round(totalScore / properties.length);
  }
}

export default PropertyQueryService;
