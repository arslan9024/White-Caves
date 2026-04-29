/**
 * Cluster Auto Assigner Utility
 * Intelligently derives cluster assignments from plot numbers, areas, and project names
 * Provides confidence scoring for manual override capability
 */

/**
 * Master list of DAMAC Hills 2 clusters
 */
const MASTER_CLUSTERS = [
  'Amazonia',
  'Akoya Oxygen',
  'Centaury',
  'Claret',
  'Dahlia',
  'Edelweiss',
  'Fern',
  'Gerbera',
  'Hazel',
  'Ivy',
  'Jasmine',
  'Zinnia',
  'Mulberry',
  'Orchid',
  'Primrose',
  'Queenland',
  'Reem',
  'Sundream',
  'Aster',
  'Juniper',
  'Coursetia',
  'Odora',
  'Basswood',
  'Amargo',
  'Mimosa',
  'Avencia',
  'Victoria',
  'Janusia',
  'Albizia',
  'Acuna',
  'Sycamore',
  'Trixis',
  'Pacifica',
  'Sanctuary',
  'Viridis',
  'Hawthorn',
  'Navitas',
  'Vardon',
  'Aquilegia'
];

/**
 * Plot number patterns mapped to clusters
 * Each range maps to a specific cluster based on historical data
 */
const PLOT_CLUSTER_MAPPING = {
  // Example patterns - these should be populated based on actual data
  '690-699': 'Aster',
  '700-709': 'Juniper',
  '710-719': 'Coursetia',
  '720-729': 'Claret',
  '730-739': 'Odora',
  '740-749': 'Basswood',
  '750-759': 'Amargo',
  '760-769': 'Mimosa',
  '770-779': 'Avencia',
  '780-789': 'Victoria',
  '790-799': 'Janusia',
  '800-809': 'Albizia',
  '810-819': 'Zinnia',
  '820-829': 'Acuna',
  '830-839': 'Primrose',
  '840-849': 'Sycamore'
};

/**
 * Assign cluster from plot number
 * Parses plot number pattern and matches against known ranges
 * @param {string} plotNumber - Plot number (e.g., "696-0")
 * @param {string} area - Area name for fallback
 * @returns {object} - { cluster: string, confidence: number, source: string }
 */
export function assignClusterFromPlotNumber(plotNumber, area = '') {
  if (!plotNumber || plotNumber === '.' || plotNumber === '') {
    return { cluster: null, confidence: 0, source: 'none' };
  }
  
  const plotStr = plotNumber.toString().trim();
  
  // Extract numeric prefix (before dash or first letters)
  const matches = plotStr.match(/^(\d+)/);
  if (!matches) {
    return { cluster: null, confidence: 0, source: 'none' };
  }
  
  const plotPrefix = parseInt(matches[1]);
  
  // Find matching range
  for (const [range, cluster] of Object.entries(PLOT_CLUSTER_MAPPING)) {
    const [start, end] = range.split('-').map(Number);
    if (plotPrefix >= start && plotPrefix <= end) {
      return {
        cluster,
        confidence: 96,
        source: 'plotNumber',
        reason: `Plot ${plotPrefix} falls in range ${range} → ${cluster}`
      };
    }
  }
  
  return { cluster: null, confidence: 0, source: 'none' };
}

/**
 * Assign cluster from project/area name
 * Extracts cluster name from project or area text
 * @param {string} projectName - Project name
 * @param {string} areaName - Area name
 * @returns {object} - { cluster: string, confidence: number, source: string }
 */
export function assignClusterFromProject(projectName, areaName) {
  const searchText = `${projectName || ''} ${areaName || ''}`.toUpperCase().trim();
  
  if (!searchText) {
    return { cluster: null, confidence: 0, source: 'none' };
  }
  
  // Direct match against master clusters
  for (const cluster of MASTER_CLUSTERS) {
    if (searchText.includes(cluster.toUpperCase())) {
      return {
        cluster,
        confidence: 88,
        source: 'projectName',
        reason: `Cluster "${cluster}" found in project/area text`
      };
    }
  }
  
  // Fuzzy matching - first word
  const words = searchText.split(/[\s-]+/).filter(w => w.length > 3);
  for (const word of words) {
    for (const cluster of MASTER_CLUSTERS) {
      if (cluster.toUpperCase().startsWith(word)) {
        return {
          cluster,
          confidence: 70,
          source: 'projectName',
          reason: `Fuzzy match: "${word}" → "${cluster}"`
        };
      }
    }
  }
  
  return { cluster: null, confidence: 0, source: 'none' };
}

/**
 * Smart cluster assignment with priority
 * @param {string} plotNumber - Plot number
 * @param {string} area - Area name
 * @param {string} project - Project name
 * @param {string} manualOverride - User-selected cluster override
 * @returns {object} - { cluster: string, confidence: number, source: string, reason: string }
 */
export function assignCluster(plotNumber, area, project, manualOverride = null) {
  // Priority 1: Manual override (user has final say)
  if (manualOverride && MASTER_CLUSTERS.includes(manualOverride)) {
    return {
      cluster: manualOverride,
      confidence: 100,
      source: 'manual_override',
      reason: 'User selected'
    };
  }
  
  // Priority 2: Extract from plot number (most reliable)
  const plotMatch = assignClusterFromPlotNumber(plotNumber, area);
  if (plotMatch.cluster && plotMatch.confidence >= 95) {
    return plotMatch;
  }
  
  // Priority 3: Extract from project/area name
  const projectMatch = assignClusterFromProject(project, area);
  if (projectMatch.cluster && projectMatch.confidence >= 80) {
    return projectMatch;
  }
  
  // Priority 4: Use lower confidence project match
  if (projectMatch.cluster) {
    return projectMatch;
  }
  
  // Priority 5: Unassigned (requires manual review)
  return {
    cluster: 'Unassigned',
    confidence: 0,
    source: 'none',
    reason: 'Could not derive cluster automatically'
  };
}

/**
 * Bulk assign unassigned properties to a selected cluster
 * @param {array} unassignedProperties - Properties without cluster
 * @param {string} selectedCluster - Cluster selected by user
 * @param {string} reason - Reason for assignment
 * @returns {object} - { updated: number, cluster: string }
 */
export function bulkAssignUnassigned(unassignedProperties, selectedCluster, reason = '') {
  if (!MASTER_CLUSTERS.includes(selectedCluster)) {
    return {
      success: false,
      error: `Invalid cluster: ${selectedCluster}`,
      updated: 0
    };
  }
  
  const updates = unassignedProperties.map(prop => ({
    propertyId: prop._id || prop.id,
    cluster: selectedCluster,
    confidence: 50,
    source: 'bulk_manual',
    reason: reason || `Bulk assigned to ${selectedCluster}`
  }));
  
  return {
    success: true,
    updated: updates.length,
    cluster: selectedCluster,
    updates
  };
}

/**
 * Get master cluster list
 * @returns {array} - Array of valid cluster names
 */
export function getMasterClusterList() {
  return MASTER_CLUSTERS;
}

/**
 * Validate cluster value
 * @param {string} cluster - Cluster name to validate
 * @returns {boolean} - True if valid cluster
 */
export function isValidCluster(cluster) {
  if (!cluster) return false;
  return MASTER_CLUSTERS.includes(cluster) || cluster === 'Unassigned';
}

/**
 * Get cluster suggestions based on partial input
 * @param {string} partialInput - Partial cluster name
 * @returns {array} - Matching cluster suggestions
 */
export function getClusterSuggestions(partialInput) {
  if (!partialInput || partialInput.length < 2) {
    return MASTER_CLUSTERS;
  }
  
  const search = partialInput.toLowerCase();
  return MASTER_CLUSTERS.filter(cluster =>
    cluster.toLowerCase().includes(search)
  );
}

export default {
  assignClusterFromPlotNumber,
  assignClusterFromProject,
  assignCluster,
  bulkAssignUnassigned,
  getMasterClusterList,
  isValidCluster,
  getClusterSuggestions
};
