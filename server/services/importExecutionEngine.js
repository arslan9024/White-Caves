/**
 * Import Execution Engine
 * Core processor for data import with batch processing
 * Separates property and owner data into distinct models
 */

import InventoryProperty from '../models/InventoryProperty.js';
import Owner from '../models/Owner.js';
import OwnerPropertyMapping from '../models/OwnerPropertyMapping.js';
import ImportSession from '../models/ImportSession.js';
import {
  mapLegacyStatusToMultiDimensions,
  extractFurnishingLevel,
  extractLegalStatus,
} from '../utils/statusAutoMapper.js';
import { assignCluster } from '../utils/clusterAutoAssigner.js';

/**
 * Normalize phone number - remove non-numeric except +
 * @param {string} phone - Phone number
 * @returns {string} - Normalized phone
 */
function normalizePhone(phone) {
  if (!phone) return null;

  const cleaned = phone.toString().replace(/[^\d+]/g, '');

  // Require at least 7 digits
  if (cleaned.replace(/\D/g, '').length < 7) {
    return null;
  }

  return cleaned;
}

/**
 * Prepare property data from Excel row
 * Extracts and transforms property-specific fields
 * @param {object} excelRow - Row from Excel
 * @param {object} columnMapping - Column to field mapping
 * @param {object} statusMap - Status value mappings
 * @param {object} clusterAssignments - Cluster assignments
 * @returns {object} - Property data ready for InventoryProperty model
 */
export function preparePropertyData(excelRow, columnMapping, statusMap, clusterAssignments = {}) {
  // Extract mapped values
  const pNumber = excelRow[columnMapping.pNumber] || null;
  const area = excelRow[columnMapping.area] || null;
  const project = excelRow[columnMapping.project] || null;
  const plotNumber = excelRow[columnMapping.plotNumber] || null;
  const unitNumber = excelRow[columnMapping.unitNumber] || null;
  const building = excelRow[columnMapping.building] || null;
  const floor = excelRow[columnMapping.floor] || null;
  const layout = excelRow[columnMapping.layout] || null;
  const rooms = parseInt(excelRow[columnMapping.rooms]) || null;
  const actualArea = parseInt(excelRow[columnMapping.actualArea]) || null;
  const viewType = excelRow[columnMapping.viewType] || null;
  const askingPrice = parseInt(excelRow[columnMapping.askingPrice]) || 0;
  const registration = excelRow[columnMapping.registration] || null;
  const municipalityNo = excelRow[columnMapping.municipalityNo] || null;
  const dewaPremiseNumber = excelRow[columnMapping.dewaPremiseNumber] || null;
  const otpDubaiRest = excelRow[columnMapping.otpDubaiRest] || null;
  const excelStatus = excelRow[columnMapping.status] || 'Available';

  // Map status to multi-dimensional system
  const statusMapping = mapLegacyStatusToMultiDimensions(excelStatus, {
    registrationField: registration,
    offPlanIndicator: false,
  });

  // Extract furnishing level
  const furnishingLevel = extractFurnishingLevel(area, layout);

  // Extract legal status
  const legalStatus = extractLegalStatus(registration);

  // Assign cluster
  const clusterAssignment = assignCluster(
    plotNumber,
    area,
    project,
    clusterAssignments[pNumber] || null
  );

  // Build property object
  const propertyData = {
    pNumber,
    area,
    cluster: clusterAssignment.cluster,
    clusterSource: clusterAssignment.source,
    clusterConfidence: clusterAssignment.confidence,
    project,
    plotNumber,
    building,
    unitNumber,
    floor: floor !== null ? parseInt(floor) : null,
    layout,
    viewType,
    rooms,
    actualArea,

    // Multi-dimensional status
    constructionStage: statusMapping.constructionStage || 'handed_over',
    occupancyStatus: statusMapping.occupancyStatus || 'vacant',
    marketAvailability: statusMapping.marketAvailability || 'available_for_both',
    furnishingLevel: furnishingLevel,
    legalStatus: statusMapping.legalStatus || 'clear_title',

    // Legacy status for backward compatibility
    status: statusMap[excelStatus] || excelStatus.toLowerCase(),

    // Pricing
    askingPrice,
    currency: 'AED',

    // Legal/Compliance
    registration: registration && registration !== '.' ? registration : null,
    municipalityNo: municipalityNo && municipalityNo !== '.' ? municipalityNo : null,
    dewaPremiseNumber: dewaPremiseNumber && dewaPremiseNumber !== '.' ? dewaPremiseNumber : null,
    otpDubaiRest: otpDubaiRest && otpDubaiRest !== '.' ? otpDubaiRest : null,

    // Tracking
    source: 'excel_import',
    importSessionId: null, // Set by executor
    tags: ['imported', new Date().toISOString().split('T')[0]],
    notes: `Imported from Excel: ${new Date().toLocaleString()}`,
  };

  return propertyData;
}

/**
 * Prepare owner data from Excel row
 * Extracts and transforms owner-specific fields
 * @param {object} excelRow - Row from Excel
 * @param {object} columnMapping - Column to field mapping
 * @returns {object} - Owner data ready for Owner model
 */
export function prepareOwnerData(excelRow, columnMapping) {
  const ownerName = excelRow[columnMapping.ownerName] || null;
  const nationality = excelRow[columnMapping.nationality] || null;
  const emiratesId = excelRow[columnMapping.emiratesId] || null;
  const passportNumber = excelRow[columnMapping.passportNumber] || null;
  const dateOfBirth = excelRow[columnMapping.dateOfBirth] || null;
  const mobile = excelRow[columnMapping.mobile] || null;
  const phone = excelRow[columnMapping.phone] || null;
  const secondaryMobile = excelRow[columnMapping.secondaryMobile] || null;
  const email = excelRow[columnMapping.email] || null;

  // Build contacts array
  const contacts = [];

  const normalizedMobile = normalizePhone(mobile);
  if (normalizedMobile) {
    contacts.push({
      type: 'mobile',
      value: normalizedMobile,
      isPrimary: true,
      label: 'Primary Mobile',
    });
  }

  const normalizedPhone = normalizePhone(phone);
  if (normalizedPhone && normalizedPhone !== normalizedMobile) {
    contacts.push({
      type: 'phone',
      value: normalizedPhone,
      isPrimary: false,
      label: 'Landline',
    });
  }

  const normalizedSecondary = normalizePhone(secondaryMobile);
  if (
    normalizedSecondary &&
    normalizedSecondary !== normalizedMobile &&
    normalizedSecondary !== normalizedPhone
  ) {
    contacts.push({
      type: 'mobile',
      value: normalizedSecondary,
      isPrimary: false,
      label: 'Secondary Mobile',
    });
  }

  if (email && email !== '.' && email !== '') {
    contacts.push({
      type: 'email',
      value: email.toLowerCase().trim(),
      isPrimary: false,
      label: 'Email',
    });
  }

  // Build owner object
  const ownerData = {
    name: ownerName ? ownerName.trim() : null,
    nationality,
    emiratesId: emiratesId && emiratesId !== '.' ? emiratesId : null,
    passportNumber: passportNumber && passportNumber !== '.' ? passportNumber : null,
    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
    contacts,
    source: 'excel_import',
    importSessionId: null, // Set by executor
    tags: ['imported', new Date().toISOString().split('T')[0]],
    notes: `Imported from Excel: ${new Date().toLocaleString()}`,
  };

  return ownerData;
}

/**
 * Execute import with batch processing
 * @param {string} sessionId - ImportSession ID
 * @param {array} rows - Excel rows to import
 * @param {object} options - Import options
 * @returns {promise<object>} - Import result statistics
 */
export async function executeImport(sessionId, rows, options = {}) {
  const stats = {
    totalRows: rows.length,
    processedRows: 0,
    propertiesCreated: 0,
    propertiesUpdated: 0,
    ownersCreated: 0,
    ownersUpdated: 0,
    duplicatesFound: 0,
    duplicatesResolved: 0,
    relationshipsCreated: 0,
    skipped: 0,
    errorsCount: 0,
    errors: [],
    duplicates: [],
    timestamp: new Date(),
  };

  const {
    columnMapping = {},
    statusMap = {},
    clusterAssignments = {},
    deduplicationStrategy = 'keep',
    importStrategy = 'balanced',
    dryRun = false,
    batchSize = 100,
  } = options;

  // Load session
  let session = null;
  try {
    session = await ImportSession.findById(sessionId);
    if (!session) {
      stats.errors.push({ error: 'Import session not found', sessionId });
      return stats;
    }
  } catch (error) {
    stats.errors.push({ error: error.message, sessionId });
    return stats;
  }

  // Process in batches
  for (let batchStart = 0; batchStart < rows.length; batchStart += batchSize) {
    const batchEnd = Math.min(batchStart + batchSize, rows.length);
    const batch = rows.slice(batchStart, batchEnd);

    for (let i = 0; i < batch.length; i++) {
      const rowIndex = batchStart + i;
      const excelRow = batch[i];

      try {
        // Prepare data
        const propertyData = preparePropertyData(
          excelRow,
          columnMapping,
          statusMap,
          clusterAssignments
        );
        const ownerData = prepareOwnerData(excelRow, columnMapping);

        // Validate required fields
        if (!propertyData.pNumber || !propertyData.area || !ownerData.name) {
          stats.errors.push({
            rowIndex,
            error: 'Missing required fields (pNumber, area, or ownerName)',
            pNumber: propertyData.pNumber,
            ownerName: ownerData.name,
          });
          stats.errorsCount++;
          stats.skipped++;
          continue;
        }

        // Check for duplicates
        const existingProperty = await InventoryProperty.findOne({
          $or: [
            { pNumber: propertyData.pNumber },
            { area: propertyData.area, plotNumber: propertyData.plotNumber },
          ],
        });

        if (existingProperty) {
          stats.duplicatesFound++;

          switch (deduplicationStrategy) {
            case 'keep':
              stats.skipped++;
              stats.duplicates.push({
                rowIndex,
                action: 'skipped',
                existingId: existingProperty._id,
                pNumber: propertyData.pNumber,
              });
              continue;

            case 'overwrite':
              if (!dryRun) {
                await InventoryProperty.findByIdAndUpdate(
                  existingProperty._id,
                  { ...propertyData, importSessionId: sessionId },
                  { new: true }
                );
              }
              stats.propertiesUpdated++;
              stats.duplicatesResolved++;
              break;

            case 'version':
              // Create new record with version metadata
              if (!dryRun) {
                propertyData.versionMetadata = {
                  previousId: existingProperty._id,
                  versionNumber: 1,
                  createdAt: new Date(),
                };
              }
              // Falls through to create new
              break;

            case 'manual':
              // Flag for review
              stats.duplicates.push({
                rowIndex,
                action: 'flagged_for_review',
                existingId: existingProperty._id,
                existingData: existingProperty.toObject(),
                newData: propertyData,
                suggestedAction: 'manual_review',
              });
              continue;
          }
        }

        // Create or update owner
        let owner = null;
        if (!dryRun) {
          owner = await Owner.findOneAndUpdate(
            {
              $or: [
                { name: ownerData.name },
                { 'contacts.value': { $in: ownerData.contacts.map(c => c.value) } },
              ],
            },
            { $set: { ...ownerData, importSessionId: sessionId } },
            { upsert: true, new: true }
          );

          if (owner.isNew) {
            stats.ownersCreated++;
          } else {
            stats.ownersUpdated++;
          }
        }

        // Create or update property
        let property = null;
        if (!dryRun) {
          propertyData.owners = owner ? [owner._id] : [];
          propertyData.primaryOwner = owner ? owner._id : null;
          propertyData.importSessionId = sessionId;

          property = await InventoryProperty.findOneAndUpdate(
            { pNumber: propertyData.pNumber, area: propertyData.area },
            { $set: propertyData },
            { upsert: true, new: true }
          );

          if (property.isNew) {
            stats.propertiesCreated++;
          } else {
            stats.propertiesUpdated++;
          }

          // Create owner-property mapping
          if (owner && property) {
            await OwnerPropertyMapping.findOneAndUpdate(
              { ownerId: owner._id, propertyId: property._id },
              {
                ownerId: owner._id,
                propertyId: property._id,
                ownershipType: 'sole',
                ownershipPercentage: 100,
                relationshipType: 'owner',
                acquisitionDate: new Date(),
                isActive: true,
                importSessionId: sessionId,
              },
              { upsert: true, new: true }
            );
            stats.relationshipsCreated++;
          }
        }

        stats.processedRows++;
      } catch (error) {
        stats.errors.push({
          rowIndex,
          error: error.message,
          pNumber: excelRow[columnMapping.pNumber],
        });
        stats.errorsCount++;
      }
    }

    // Update session progress
    if (!dryRun && session) {
      session.processedRows = stats.processedRows;
      await session.save();
    }
  }

  // Update import session with final results
  if (!dryRun && session) {
    const hasErrors = stats.errors.length > 0 || stats.errorsCount > 0;
    const hasSuccessfulWork =
      stats.processedRows > 0 ||
      stats.propertiesCreated > 0 ||
      stats.propertiesUpdated > 0 ||
      stats.ownersCreated > 0 ||
      stats.ownersUpdated > 0 ||
      stats.relationshipsCreated > 0;

    if (hasErrors && hasSuccessfulWork) {
      session.status = 'partial';
    } else if (hasErrors) {
      session.status = 'failed';
    } else {
      session.status = 'completed';
    }

    const attemptedRows = stats.processedRows + stats.skipped;
    const successRate = attemptedRows > 0 ? (stats.processedRows / attemptedRows) * 100 : 0;

    session.totalRows = stats.totalRows;
    session.totalRowsProcessed = stats.processedRows;
    session.successRate = Number(successRate.toFixed(1));
    session.propertiesCreated = stats.propertiesCreated;
    session.propertiesUpdated = stats.propertiesUpdated;
    session.ownersCreated = stats.ownersCreated;
    session.ownersUpdated = stats.ownersUpdated;
    session.duplicatesFound = stats.duplicatesFound;
    session.errorsCount = stats.errorsCount;
    session.totalErrors = stats.errors.length;
    session.importErrors = stats.errors;
    session.duplicates = stats.duplicates;
    session.completedAt = new Date();
    await session.save();
  }

  return stats;
}

export default {
  preparePropertyData,
  prepareOwnerData,
  executeImport,
  normalizePhone,
};
