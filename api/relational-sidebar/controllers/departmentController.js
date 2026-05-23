/**
 * Department Controller
 * Handles department-related business logic
 */

const { departments } = require('../data/mockData');

/**
 * Get all departments
 */
async function getAllDepartments() {
  try {
    console.debug('[Controller] Getting all departments');

    // If using database, replace with:
    // return await Department.find().populate('services');

    // For now, return mock data
    return departments;
  } catch (error) {
    console.error('[Controller] Error getting departments:', error);
    throw new Error(`Failed to retrieve departments: ${error.message}`);
  }
}

/**
 * Get department by ID
 * @param {string} id - Department ID
 */
async function getDepartmentById(id) {
  try {
    console.debug(`[Controller] Getting department: ${id}`);

    if (!id) {
      throw new Error('Department ID is required');
    }

    // If using database, replace with:
    // return await Department.findOne({ id }).populate('services');

    const department = departments.find(d => d.id === id);

    if (!department) {
      console.warn(`[Controller] Department not found: ${id}`);
      return null;
    }

    return department;
  } catch (error) {
    console.error(`[Controller] Error getting department ${id}:`, error);
    throw new Error(`Failed to retrieve department: ${error.message}`);
  }
}

/**
 * Get departments by service
 * @param {string} serviceId - Service ID
 */
async function getDepartmentsByService(serviceId) {
  try {
    console.debug(`[Controller] Getting departments for service: ${serviceId}`);

    // If using database, replace with:
    // return await Department.find({ 'services.id': serviceId });

    const filtered = departments.filter(d =>
      d.services?.some(s => s.id === serviceId)
    );

    return filtered;
  } catch (error) {
    console.error('[Controller] Error filtering departments:', error);
    throw new Error(`Failed to filter departments: ${error.message}`);
  }
}

module.exports = {
  getAllDepartments,
  getDepartmentById,
  getDepartmentsByService,
};
