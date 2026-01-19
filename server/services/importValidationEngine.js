/**
 * Import Validation Engine
 * Comprehensive pre-flight checks for import data
 * Supports Strict, Lenient, and Balanced strategies
 */

const PHONE_REGEX = /^\+?[0-9\s\-\(\)]{7,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate single row based on strategy
 * @param {object} rowData - Single row of import data
 * @param {array} requiredFields - Fields that must be present
 * @param {object} fieldTypes - Field type definitions
 * @param {string} strategy - 'strict' | 'lenient' | 'balanced'
 * @returns {object} - { isValid: boolean, errors: array, warnings: array }
 */
export function validateRow(rowData, requiredFields = ['ownerName', 'area'], fieldTypes = {}, strategy = 'balanced') {
  const errors = [];
  const warnings = [];
  
  // Check required fields
  for (const field of requiredFields) {
    if (!rowData[field] || rowData[field] === '' || rowData[field] === '.') {
      errors.push(`Required field "${field}" is missing or empty`);
    }
  }
  
  // Validate data types
  if (rowData.rooms && typeof rowData.rooms !== 'number') {
    if (strategy === 'strict') {
      errors.push(`Field "rooms" must be numeric, got "${rowData.rooms}"`);
    } else {
      warnings.push(`Field "rooms" is not numeric: "${rowData.rooms}"`);
    }
  }
  
  if (rowData.actualArea && typeof rowData.actualArea !== 'number') {
    if (strategy === 'strict') {
      errors.push(`Field "actualArea" must be numeric, got "${rowData.actualArea}"`);
    } else {
      warnings.push(`Field "actualArea" is not numeric: "${rowData.actualArea}"`);
    }
  }
  
  if (rowData.askingPrice && typeof rowData.askingPrice !== 'number') {
    if (strategy === 'strict') {
      errors.push(`Field "askingPrice" must be numeric, got "${rowData.askingPrice}"`);
    } else {
      warnings.push(`Field "askingPrice" is not numeric: "${rowData.askingPrice}"`);
    }
  }
  
  // Validate phone numbers
  if (rowData.mobile || rowData.phone || rowData.secondaryMobile) {
    const phones = [rowData.mobile, rowData.phone, rowData.secondaryMobile].filter(Boolean);
    
    for (const phone of phones) {
      const cleaned = phone.toString().replace(/\D/g, '');
      
      if (cleaned.length < 7) {
        if (strategy === 'strict') {
          errors.push(`Phone number "${phone}" is too short (minimum 7 digits)`);
        } else {
          warnings.push(`Phone number "${phone}" is too short`);
        }
      }
    }
  }
  
  // Validate email
  if (rowData.email && !EMAIL_REGEX.test(rowData.email)) {
    if (strategy === 'strict') {
      errors.push(`Invalid email format: "${rowData.email}"`);
    } else {
      warnings.push(`Email format may be invalid: "${rowData.email}"`);
    }
  }
  
  // Validate date format
  if (rowData.dateOfBirth && !(rowData.dateOfBirth instanceof Date)) {
    try {
      const date = new Date(rowData.dateOfBirth);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
    } catch (error) {
      if (strategy === 'strict') {
        errors.push(`Invalid date format for dateOfBirth: "${rowData.dateOfBirth}"`);
      } else {
        warnings.push(`Date format unclear for dateOfBirth: "${rowData.dateOfBirth}"`);
      }
    }
  }
  
  const isValid = strategy === 'strict' ? errors.length === 0 : errors.length === 0;
  
  return {
    isValid,
    errors,
    warnings,
    rowData: rowData.pNumber || rowData.ownerName || 'Unknown',
    strategy
  };
}

/**
 * Validate all rows in batch
 * @param {array} rows - Array of row objects
 * @param {string} strategy - 'strict' | 'lenient' | 'balanced'
 * @param {object} options - Validation options
 * @returns {promise<object>} - Comprehensive validation report
 */
export async function validateAllRows(rows, strategy = 'balanced', options = {}) {
  const requiredFields = options.requiredFields || ['ownerName', 'area'];
  const fieldTypes = options.fieldTypes || {};
  
  const report = {
    strategy,
    totalRows: rows.length,
    validRows: 0,
    rowsWithErrors: [],
    rowsWithWarnings: [],
    rowsOK: 0,
    rowsWithIssues: 0,
    totalErrors: 0,
    totalWarnings: 0,
    isValid: true,
    summary: {
      missingOwnerNames: 0,
      missingAreas: 0,
      invalidPhones: 0,
      invalidEmails: 0,
      missingValues: 0
    },
    timestamp: new Date()
  };
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const validation = validateRow(row, requiredFields, fieldTypes, strategy);
    
    if (validation.isValid) {
      report.validRows++;
      report.rowsOK++;
    } else {
      report.rowsWithIssues++;
      
      if (validation.errors.length > 0) {
        report.rowsWithErrors.push({
          rowIndex: i,
          rowIdentifier: validation.rowData,
          errors: validation.errors
        });
        report.totalErrors += validation.errors.length;
        
        // Track specific issues
        for (const error of validation.errors) {
          if (error.includes('ownerName')) report.summary.missingOwnerNames++;
          if (error.includes('area')) report.summary.missingAreas++;
          if (error.includes('Phone')) report.summary.invalidPhones++;
          if (error.includes('email')) report.summary.invalidEmails++;
        }
      }
      
      if (validation.warnings.length > 0) {
        report.rowsWithWarnings.push({
          rowIndex: i,
          rowIdentifier: validation.rowData,
          warnings: validation.warnings
        });
        report.totalWarnings += validation.warnings.length;
      }
    }
  }
  
  // Set overall validity based on strategy
  if (strategy === 'strict') {
    report.isValid = report.totalErrors === 0;
  } else if (strategy === 'lenient') {
    report.isValid = report.summary.missingOwnerNames === 0 && report.summary.missingAreas === 0;
  } else {
    // balanced: allow some issues, flag critical ones
    report.isValid = report.summary.missingOwnerNames === 0 && report.summary.missingAreas === 0;
  }
  
  return report;
}

/**
 * Detect orphaned records (area specified but no cluster derivable)
 * @param {array} rows - Array of rows
 * @param {array} masterClusterList - List of valid clusters
 * @returns {array} - Array of orphaned records
 */
export function detectOrphanedRecords(rows, masterClusterList = []) {
  const orphaned = [];
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    if (!row.area || row.area === '.' || row.area === '') {
      continue;
    }
    
    // Check if cluster can be derived
    const hasCluster = row.cluster && row.cluster !== '.' && row.cluster !== '';
    const hasPlotThatCanDeriveCluster = row.plotNumber && row.plotNumber !== '.' && row.plotNumber !== '';
    const hasProjectThatCanDeriveCluster = row.project && row.project !== '.' && row.project !== '';
    
    if (!hasCluster && !hasPlotThatCanDeriveCluster && !hasProjectThatCanDeriveCluster) {
      orphaned.push({
        rowIndex: i,
        area: row.area,
        pNumber: row.pNumber || 'Unknown',
        issue: 'Cannot derive cluster from plot number or project name',
        suggestions: ['Manually assign cluster', 'Verify area name', 'Check plot number format']
      });
    }
  }
  
  return orphaned;
}

/**
 * Perform dry-run validation
 * Process data without saving to database
 * @param {array} rows - Rows to validate
 * @param {string} sessionId - Import session ID
 * @param {object} options - Dry-run options
 * @returns {promise<object>} - Dry-run results
 */
export async function dryRun(rows, sessionId, options = {}) {
  const validation = await validateAllRows(rows, options.strategy || 'balanced', options);
  
  const dryRunResult = {
    sessionId,
    strategy: options.strategy || 'balanced',
    validation,
    estimates: {
      wouldCreate: rows.length - validation.rowsWithErrors.length,
      wouldUpdate: 0, // Would be calculated after dedup check
      wouldSkip: validation.rowsWithErrors.length,
      duplicatesWould: 0, // Would be calculated after dedup check
      errorsExpected: validation.totalErrors,
      warningsExpected: validation.totalWarnings
    },
    recommendedActions: generateRecommendations(validation),
    timestamp: new Date(),
    dryRunData: true
  };
  
  return dryRunResult;
}

/**
 * Generate recommendations based on validation results
 * @param {object} validation - Validation report
 * @returns {array} - Array of recommended actions
 */
function generateRecommendations(validation) {
  const recommendations = [];
  
  if (validation.summary.missingOwnerNames > 0) {
    recommendations.push(`Remove or fill ${validation.summary.missingOwnerNames} rows with missing owner names`);
  }
  
  if (validation.summary.missingAreas > 0) {
    recommendations.push(`Verify or add area information for ${validation.summary.missingAreas} rows`);
  }
  
  if (validation.summary.invalidPhones > 0) {
    recommendations.push(`Review ${validation.summary.invalidPhones} phone numbers - ensure proper format`);
  }
  
  if (validation.summary.invalidEmails > 0) {
    recommendations.push(`Verify ${validation.summary.invalidEmails} email addresses`);
  }
  
  if (validation.totalErrors > validation.totalRows * 0.1) {
    recommendations.push('Error rate exceeds 10% - consider reviewing source data');
  }
  
  if (validation.isValid) {
    recommendations.push('Data validation passed - ready for import');
  }
  
  return recommendations;
}

export default {
  validateRow,
  validateAllRows,
  detectOrphanedRecords,
  dryRun
};
