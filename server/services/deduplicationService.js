/**
 * Deduplication Service
 * Handles duplicate detection and resolution with multiple strategies
 * Supports: Keep Existing, Overwrite, Create Version, Manual Review
 */

import InventoryProperty from '../models/InventoryProperty.js';

/**
 * Detect potential duplicates in new property data
 * @param {array} newProperties - Array of new property objects
 * @param {object} options - Detection options
 * @returns {promise<array>} - Array of potential duplicates
 */
export async function detectDuplicates(newProperties, options = {}) {
  const duplicates = [];
  
  for (const newProp of newProperties) {
    // Build search query - try pNumber first, then area+plotNumber+unitNumber
    const searchQueries = [];
    
    if (newProp.pNumber) {
      searchQueries.push({ pNumber: newProp.pNumber });
    }
    
    if (newProp.area && newProp.plotNumber) {
      searchQueries.push({
        area: newProp.area,
        plotNumber: newProp.plotNumber,
        unitNumber: newProp.unitNumber || { $in: [null, '', '.', newProp.unitNumber] }
      });
    }
    
    // Execute searches
    for (const query of searchQueries) {
      try {
        const existing = await InventoryProperty.findOne(query);
        
        if (existing) {
          const matchedFields = calculateFieldMatches(newProp, existing.toObject());
          const confidence = (matchedFields.matches / matchedFields.total) * 100;
          
          duplicates.push({
            newPropertyIndex: newProperties.indexOf(newProp),
            existingId: existing._id,
            existingProperty: existing.toObject(),
            matchedFields: matchedFields.matchedFields,
            confidence: Math.round(confidence),
            searchQuery: query,
            detectedAt: new Date()
          });
          
          break; // Found duplicate, move to next property
        }
      } catch (error) {
        console.error('Error detecting duplicates:', error.message);
      }
    }
  }
  
  return duplicates;
}

/**
 * Calculate matching fields between new and existing property
 * @param {object} newProp - New property data
 * @param {object} existingProp - Existing property data
 * @returns {object} - { matches: number, total: number, matchedFields: array }
 */
function calculateFieldMatches(newProp, existingProp) {
  const fieldsToCheck = [
    'pNumber',
    'area',
    'plotNumber',
    'unitNumber',
    'rooms',
    'actualArea',
    'layout',
    'askingPrice'
  ];
  
  let matches = 0;
  const matchedFields = [];
  
  for (const field of fieldsToCheck) {
    const newValue = newProp[field];
    const existingValue = existingProp[field];
    
    if (newValue === existingValue) {
      matches++;
      matchedFields.push(field);
    }
  }
  
  return {
    matches,
    total: fieldsToCheck.length,
    matchedFields
  };
}

/**
 * Apply deduplication strategy
 * @param {string} strategy - 'keep' | 'overwrite' | 'version' | 'manual'
 * @param {array} duplicates - Array of detected duplicates
 * @param {array} newProperties - New property data
 * @param {object} options - Additional options
 * @returns {promise<object>} - { applied: array, skipped: array, flagged: array, errors: array }
 */
export async function applyDeduplicationStrategy(strategy, duplicates, newProperties, options = {}) {
  const result = {
    applied: [],
    skipped: [],
    flagged: [],
    errors: [],
    strategy
  };
  
  if (!['keep', 'overwrite', 'version', 'manual'].includes(strategy)) {
    result.errors.push(`Invalid strategy: ${strategy}`);
    return result;
  }
  
  for (const duplicate of duplicates) {
    const newProp = newProperties[duplicate.newPropertyIndex];
    
    switch (strategy) {
      case 'keep':
        // Skip new data, keep existing
        result.skipped.push({
          propertyIndex: duplicate.newPropertyIndex,
          existingId: duplicate.existingId,
          reason: 'Kept existing record',
          pNumber: newProp.pNumber
        });
        break;
        
      case 'overwrite':
        // Mark for replacement
        result.applied.push({
          propertyIndex: duplicate.newPropertyIndex,
          existingId: duplicate.existingId,
          action: 'overwrite',
          newData: newProp,
          oldData: duplicate.existingProperty,
          replaceAt: new Date()
        });
        break;
        
      case 'version':
        // Create version record
        result.applied.push({
          propertyIndex: duplicate.newPropertyIndex,
          existingId: duplicate.existingId,
          action: 'version',
          newData: newProp,
          versionMetadata: {
            previousId: duplicate.existingId,
            versionNumber: 1,
            createdAt: new Date()
          }
        });
        break;
        
      case 'manual':
        // Flag for human review
        result.flagged.push({
          propertyIndex: duplicate.newPropertyIndex,
          existingId: duplicate.existingId,
          newData: newProp,
          existingData: duplicate.existingProperty,
          matchedFields: duplicate.matchedFields,
          confidence: duplicate.confidence,
          suggestedAction: duplicate.confidence > 80 ? 'merge' : 'review'
        });
        break;
    }
  }
  
  return result;
}

/**
 * Resolve conflicts for manually reviewed duplicates
 * @param {array} conflicts - Array of conflicts with user resolutions
 * @returns {promise<object>} - { resolved: array, errors: array }
 */
export async function resolveConflicts(conflicts) {
  const result = {
    resolved: [],
    errors: []
  };
  
  for (const conflict of conflicts) {
    try {
      const { existingId, resolution, newData, mergedData } = conflict;
      
      switch (resolution) {
        case 'keep':
          result.resolved.push({
            existingId,
            action: 'kept',
            timestamp: new Date()
          });
          break;
          
        case 'replace':
          result.resolved.push({
            existingId,
            action: 'replaced',
            newData,
            timestamp: new Date()
          });
          break;
          
        case 'merge':
          result.resolved.push({
            existingId,
            action: 'merged',
            mergedData,
            timestamp: new Date()
          });
          break;
      }
    } catch (error) {
      result.errors.push({
        conflictId: conflict.existingId,
        error: error.message
      });
    }
  }
  
  return result;
}

/**
 * Get deduplication summary
 * @param {object} deduplicationResult - Result from applyDeduplicationStrategy
 * @returns {object} - Summary statistics
 */
export function getSummary(deduplicationResult) {
  return {
    strategy: deduplicationResult.strategy,
    totalProcessed: deduplicationResult.applied.length + deduplicationResult.skipped.length + deduplicationResult.flagged.length,
    applied: deduplicationResult.applied.length,
    skipped: deduplicationResult.skipped.length,
    flagged: deduplicationResult.flagged.length,
    errors: deduplicationResult.errors.length,
    timestamp: new Date()
  };
}

export default {
  detectDuplicates,
  applyDeduplicationStrategy,
  resolveConflicts,
  getSummary
};
