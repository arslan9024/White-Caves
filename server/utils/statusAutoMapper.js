/**
 * Status Auto Mapper Utility
 * Maps single Excel status values to multi-dimensional status system
 * Handles fuzzy matching and provides confidence scoring
 */

/**
 * Mapping table for legacy status to multi-dimensional system
 */
const STATUS_MAPPING_TABLE = {
  'rented': {
    occupancyStatus: 'occupied_by_tenant',
    marketAvailability: 'not_available',
    constructionStage: 'handed_over',
    furnishingLevel: 'unfurnished',
    legalStatus: 'registered_with_dld'
  },
  'occupied': {
    occupancyStatus: 'occupied_by_tenant',
    marketAvailability: 'not_available',
    constructionStage: 'handed_over',
    furnishingLevel: 'unfurnished',
    legalStatus: 'registered_with_dld'
  },
  'available': {
    occupancyStatus: 'vacant',
    marketAvailability: 'available_for_both',
    constructionStage: 'handed_over',
    furnishingLevel: 'unfurnished',
    legalStatus: 'registered_with_dld'
  },
  'vacant': {
    occupancyStatus: 'vacant',
    marketAvailability: 'available_for_both',
    constructionStage: 'handed_over',
    furnishingLevel: 'unfurnished',
    legalStatus: 'registered_with_dld'
  },
  'sold': {
    occupancyStatus: 'occupied_by_owner',
    marketAvailability: 'not_available',
    constructionStage: 'handed_over',
    furnishingLevel: 'unfurnished',
    legalStatus: 'registered_with_dld'
  },
  'reserved': {
    occupancyStatus: 'vacant',
    marketAvailability: 'not_available',
    constructionStage: 'handed_over',
    furnishingLevel: 'unfurnished',
    legalStatus: 'registered_with_dld'
  },
  'under_renovation': {
    occupancyStatus: 'undergoing_renovation',
    marketAvailability: 'not_available',
    constructionStage: 'handed_over',
    furnishingLevel: 'unfurnished',
    legalStatus: 'registered_with_dld'
  },
  'under_construction': {
    occupancyStatus: 'vacant',
    marketAvailability: 'not_available',
    constructionStage: 'under_construction',
    furnishingLevel: 'unfurnished',
    legalStatus: 'off_plan'
  },
  'off_plan': {
    occupancyStatus: 'vacant',
    marketAvailability: 'available_for_sale',
    constructionStage: 'under_construction',
    furnishingLevel: 'unfurnished',
    legalStatus: 'off_plan'
  }
};

/**
 * Fuzzy match status string to known status values
 * @param {string} excelStatus - Status value from Excel
 * @returns {string} - Normalized status key
 */
function fuzzyMatchStatus(excelStatus) {
  if (!excelStatus) return null;
  
  const normalized = excelStatus.toLowerCase().trim();
  
  // Direct match
  if (STATUS_MAPPING_TABLE[normalized]) {
    return normalized;
  }
  
  // Fuzzy matching with common variations
  const fuzzyPatterns = {
    'rented': ['rent', 'renting', 'leased', 'leasing', 'let', 'occupied'],
    'available': ['avail', 'open', 'free', 'unoccupied', 'vacant', 'empty'],
    'sold': ['sold', 'sale complete', 'purchased', 'sold_out'],
    'reserved': ['hold', 'held', 'reserved', 'pending'],
    'under_renovation': ['reno', 'renovation', 'repair', 'maintenance', 'under_repair'],
    'under_construction': ['construction', 'building', 'under_build', 'development']
  };
  
  for (const [key, patterns] of Object.entries(fuzzyPatterns)) {
    for (const pattern of patterns) {
      if (normalized.includes(pattern)) {
        return key;
      }
    }
  }
  
  // No match found
  return null;
}

/**
 * Map legacy status to multi-dimensional system
 * @param {string} excelStatus - Status value from Excel
 * @param {object} additionalContext - Additional fields for better inference
 * @returns {object} - Multi-dimensional status mapping
 */
export function mapLegacyStatusToMultiDimensions(excelStatus, additionalContext = {}) {
  const matchedStatus = fuzzyMatchStatus(excelStatus);
  
  if (!matchedStatus || !STATUS_MAPPING_TABLE[matchedStatus]) {
    // Return safe defaults
    return {
      occupancyStatus: 'vacant',
      marketAvailability: 'available_for_both',
      constructionStage: 'handed_over',
      furnishingLevel: 'unfurnished',
      legalStatus: 'clear_title',
      originalStatus: excelStatus,
      confidence: 20
    };
  }
  
  const mapping = STATUS_MAPPING_TABLE[matchedStatus];
  
  // Enhance with additional context
  if (additionalContext.registrationField) {
    mapping.legalStatus = 'registered_with_dld';
  }
  if (additionalContext.offPlanIndicator) {
    mapping.legalStatus = 'off_plan';
  }
  
  return {
    ...mapping,
    originalStatus: excelStatus,
    matchedStatus: matchedStatus,
    confidence: 95
  };
}

/**
 * Extract furnishing level from various fields
 * @param {string} area - Area/community name
 * @param {string} layout - Layout description
 * @param {object} otherFields - Other property fields
 * @returns {string} - Furnishing level enum
 */
export function extractFurnishingLevel(area, layout, otherFields = {}) {
  const searchText = `${area || ''} ${layout || ''}`.toLowerCase();
  
  if (searchText.includes('furnished')) {
    return 'furnished';
  }
  if (searchText.includes('semi') || searchText.includes('semi-furnished')) {
    return 'semi_furnished';
  }
  
  // Default to unfurnished if not specified
  return 'unfurnished';
}

/**
 * Extract legal status from registration and other fields
 * @param {string} registrationField - DLD registration number or similar
 * @param {object} otherFields - Other fields for context
 * @returns {string} - Legal status enum
 */
export function extractLegalStatus(registrationField, otherFields = {}) {
  if (registrationField && registrationField !== '.' && registrationField !== '') {
    return 'registered_with_dld';
  }
  
  if (otherFields.offPlanIndicator) {
    return 'off_plan';
  }
  
  if (otherFields.mortgageRestrictions) {
    return 'subject_to_mortgage';
  }
  
  // Default to clear title
  return 'clear_title';
}

/**
 * Calculate mapping confidence score
 * @param {string} excelStatus - Original status
 * @param {object} mappedDimensions - Mapped dimensions
 * @returns {number} - Confidence percentage 0-100
 */
export function calculateMappingConfidence(excelStatus, mappedDimensions) {
  if (!excelStatus) return 20;
  
  const matchedStatus = fuzzyMatchStatus(excelStatus);
  
  if (!matchedStatus) {
    return 20; // Low confidence if no match
  }
  
  // Direct match gets high confidence
  if (excelStatus.toLowerCase().trim() === matchedStatus) {
    return 95;
  }
  
  // Fuzzy match gets medium confidence
  return 70;
}

/**
 * Validate dimension values
 * @param {object} dimensions - Multi-dimensional status object
 * @returns {object} - { isValid: boolean, errors: string[] }
 */
export function validateDimensions(dimensions) {
  const errors = [];
  
  const validOccupancy = ['occupied_by_tenant', 'occupied_by_owner', 'vacant', 'undergoing_renovation'];
  const validMarket = ['available_for_rent', 'available_for_sale', 'available_for_both', 'not_available', 'blocked_from_dld'];
  const validConstruction = ['under_construction', 'handed_over', 'ready_for_occupancy'];
  const validFurnishing = ['unfurnished', 'semi_furnished', 'furnished'];
  const validLegal = ['registered_with_dld', 'awaiting_registration', 'off_plan', 'subject_to_mortgage', 'clear_title'];
  
  if (!validOccupancy.includes(dimensions.occupancyStatus)) {
    errors.push(`Invalid occupancyStatus: ${dimensions.occupancyStatus}`);
  }
  if (!validMarket.includes(dimensions.marketAvailability)) {
    errors.push(`Invalid marketAvailability: ${dimensions.marketAvailability}`);
  }
  if (!validConstruction.includes(dimensions.constructionStage)) {
    errors.push(`Invalid constructionStage: ${dimensions.constructionStage}`);
  }
  if (!validFurnishing.includes(dimensions.furnishingLevel)) {
    errors.push(`Invalid furnishingLevel: ${dimensions.furnishingLevel}`);
  }
  if (!validLegal.includes(dimensions.legalStatus)) {
    errors.push(`Invalid legalStatus: ${dimensions.legalStatus}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export default {
  mapLegacyStatusToMultiDimensions,
  extractFurnishingLevel,
  extractLegalStatus,
  calculateMappingConfidence,
  validateDimensions,
  fuzzyMatchStatus
};
