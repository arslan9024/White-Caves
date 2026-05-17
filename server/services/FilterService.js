/**
 * FilterService.js
 * Handles query building and filtering logic for property inventory
 */

class FilterService {
  /**
   * Build MongoDB query object from filter parameters
   * @param {Object} filters - Filter criteria
   * @param {Array} filters.status - Property status array
   * @param {Array} filters.type - Property type array
   * @param {String} filters.area - Specific area name
   * @param {Number} filters.priceMin - Minimum price
   * @param {Number} filters.priceMax - Maximum price
   * @param {Array} filters.furnishing - Furnishing status array
   * @returns {Object} MongoDB query object
   */
  static buildMongoQuery(filters = {}) {
    const query = {};

    // Status filter
    if (filters.status && filters.status.length > 0) {
      query.status = { $in: filters.status };
    }

    // Property type filter
    if (filters.type && filters.type.length > 0) {
      query.propertyType = { $in: filters.type };
    }

    // Area filter
    if (filters.area && filters.area.trim()) {
      query.area = filters.area.trim();
    }

    // Price range filter
    if (filters.priceMin !== null || filters.priceMax !== null) {
      query.price = {};
      if (filters.priceMin !== null && filters.priceMin >= 0) {
        query.price.$gte = Number(filters.priceMin);
      }
      if (filters.priceMax !== null && filters.priceMax > 0) {
        query.price.$lte = Number(filters.priceMax);
      }
    }

    // Furnishing status filter
    if (filters.furnishing && filters.furnishing.length > 0) {
      query.furnishingStatus = { $in: filters.furnishing };
    }

    return query;
  }

  /**
   * Validate filter parameters
   * @param {Object} filters - Filter criteria to validate
   * @returns {Object} { isValid: Boolean, errors: Array }
   */
  static validateFilters(filters = {}) {
    const errors = [];

    // Validate status array
    if (filters.status && Array.isArray(filters.status)) {
      const validStatuses = ['Vacant', 'Occupied', 'Maintenance', 'Available for Lease'];
      const invalidStatuses = filters.status.filter((s) => !validStatuses.includes(s));
      if (invalidStatuses.length > 0) {
        errors.push(`Invalid status values: ${invalidStatuses.join(', ')}`);
      }
    }

    // Validate type array
    if (filters.type && Array.isArray(filters.type)) {
      const validTypes = ['Apartment', 'Villa', 'Studio', 'Penthouse', 'Townhouse'];
      const invalidTypes = filters.type.filter((t) => !validTypes.includes(t));
      if (invalidTypes.length > 0) {
        errors.push(`Invalid property type values: ${invalidTypes.join(', ')}`);
      }
    }

    // Validate price range
    if (filters.priceMin !== null && filters.priceMax !== null) {
      if (Number(filters.priceMin) > Number(filters.priceMax)) {
        errors.push('Minimum price cannot be greater than maximum price');
      }
    }

    // Validate furnishing array
    if (filters.furnishing && Array.isArray(filters.furnishing)) {
      const validFurnishing = ['Furnished', 'Semi-Furnished', 'Unfurnished'];
      const invalidFurnishing = filters.furnishing.filter((f) => !validFurnishing.includes(f));
      if (invalidFurnishing.length > 0) {
        errors.push(`Invalid furnishing values: ${invalidFurnishing.join(', ')}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Extract filter parameters from request query
   * @param {Object} queryParams - URL query parameters
   * @returns {Object} Normalized filter object
   */
  static extractFiltersFromQuery(queryParams = {}) {
    const filters = {
      status: [],
      type: [],
      areas: [],
      priceMin: null,
      priceMax: null,
      furnishing: [],
    };

    // Handle status array or single value
    if (queryParams.status) {
      filters.status = Array.isArray(queryParams.status)
        ? queryParams.status
        : [queryParams.status];
    }

    // Handle type array or single value
    if (queryParams.type) {
      filters.type = Array.isArray(queryParams.type)
        ? queryParams.type
        : [queryParams.type];
    }

    // Handle areas array or single value
    if (queryParams.areas) {
      filters.areas = Array.isArray(queryParams.areas)
        ? queryParams.areas
        : [queryParams.areas];
    }

    // Handle price range
    if (queryParams.priceMin) {
      filters.priceMin = Number(queryParams.priceMin);
    }
    if (queryParams.priceMax) {
      filters.priceMax = Number(queryParams.priceMax);
    }

    // Handle furnishing array or single value
    if (queryParams.furnishing) {
      filters.furnishing = Array.isArray(queryParams.furnishing)
        ? queryParams.furnishing
        : [queryParams.furnishing];
    }

    return filters;
  }

  /**
   * Get available filter values for a specific field
   * @param {String} field - Field name (status, type, furnishing)
   * @returns {Array} Available values for the field
   */
  static getAvailableValues(field) {
    const availableValues = {
      status: ['Vacant', 'Occupied', 'Maintenance', 'Available for Lease'],
      type: ['Apartment', 'Villa', 'Studio', 'Penthouse', 'Townhouse'],
      furnishing: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
    };

    return availableValues[field] || [];
  }

  /**
   * Apply pagination to query
   * @param {Number} page - Page number (1-indexed)
   * @param {Number} limit - Items per page
   * @returns {Object} { skip: Number, limit: Number }
   */
  static getPagination(page = 1, limit = 10) {
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 10));

    return {
      skip: (pageNum - 1) * limitNum,
      limit: limitNum,
      page: pageNum,
    };
  }

  /**
   * Apply sorting to query
   * @param {String} sortBy - Field to sort by
   * @param {String} sortOrder - 'asc' or 'desc'
   * @returns {Object} MongoDB sort object
   */
  static getSort(sortBy = 'createdAt', sortOrder = 'desc') {
    const sortObject = {};
    const validSortFields = ['price', 'createdAt', 'updatedAt', 'bedrooms', 'bathrooms'];
    const field = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const order = sortOrder === 'asc' ? 1 : -1;

    sortObject[field] = order;
    return sortObject;
  }

  /**
   * Calculate filter statistics from properties
   * @param {Array} properties - Array of property documents
   * @returns {Object} Statistics by filter criteria
   */
  static calculateFilterStats(properties = []) {
    const stats = {
      byStatus: {},
      byType: {},
      byFurnishing: {},
      priceRange: {
        min: Number.MAX_VALUE,
        max: 0,
        avg: 0,
      },
    };

    let totalPrice = 0;

    properties.forEach((prop) => {
      // Count by status
      stats.byStatus[prop.status] = (stats.byStatus[prop.status] || 0) + 1;

      // Count by type
      stats.byType[prop.propertyType] = (stats.byType[prop.propertyType] || 0) + 1;

      // Count by furnishing
      stats.byFurnishing[prop.furnishingStatus] = (stats.byFurnishing[prop.furnishingStatus] || 0) + 1;

      // Price statistics
      if (prop.price && prop.price > 0) {
        stats.priceRange.min = Math.min(stats.priceRange.min, prop.price);
        stats.priceRange.max = Math.max(stats.priceRange.max, prop.price);
        totalPrice += prop.price;
      }
    });

    // Calculate average price
    if (properties.length > 0) {
      stats.priceRange.avg = Math.round(totalPrice / properties.length);
    }

    return stats;
  }

  /**
   * Build complete response with filters applied
   * @param {Array} properties - Filtered properties
   * @param {Object} filters - Applied filters
   * @param {Object} pagination - Pagination info
   * @param {Number} totalCount - Total count before pagination
   * @returns {Object} Complete response object
   */
  static buildResponse(properties = [], filters = {}, pagination = {}, totalCount = 0) {
    return {
      success: true,
      data: properties,
      pagination: {
        page: pagination.page || 1,
        limit: pagination.limit || 10,
        total: totalCount,
        pages: Math.ceil(totalCount / (pagination.limit || 10)),
      },
      filters: {
        applied: {
          status: filters.status && filters.status.length > 0 ? filters.status : null,
          type: filters.type && filters.type.length > 0 ? filters.type : null,
          areas: filters.areas && filters.areas.length > 0 ? filters.areas : null,
          priceRange:
            filters.priceMin !== null || filters.priceMax !== null
              ? {
                  min: filters.priceMin,
                  max: filters.priceMax,
                }
              : null,
          furnishing: filters.furnishing && filters.furnishing.length > 0 ? filters.furnishing : null,
        },
        available: {
          statuses: this.getAvailableValues('status'),
          types: this.getAvailableValues('type'),
          furnishingOptions: this.getAvailableValues('furnishing'),
        },
      },
    };
  }
}

module.exports = FilterService;
