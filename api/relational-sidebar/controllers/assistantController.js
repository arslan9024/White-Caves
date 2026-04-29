/**
 * Assistant Controller
 * Handles assistant-related business logic
 */

const { assistants } = require('../data/mockData');

/**
 * Get all assistants with optional filtering
 * @param {Object} filters - Filter options
 * @param {string} filters.department - Department ID
 * @param {string} filters.service - Service ID
 * @param {boolean} filters.hasPermission - Only active assistants
 */
async function getAssistants(filters = {}) {
  try {
    console.debug('[Controller] Getting assistants', filters);

    // If using database, replace with:
    // const query = {};
    // if (filters.department) query.department = filters.department;
    // if (filters.service) query.services = { $in: [filters.service] };
    // if (filters.hasPermission) query.isActive = true;
    // return await Assistant.find(query);

    let filtered = [...assistants];

    // Apply filters
    if (filters.department) {
      filtered = filtered.filter(a => a.department === filters.department);
    }

    if (filters.service) {
      filtered = filtered.filter(a =>
        a.services?.some(s => s.id === filters.service)
      );
    }

    if (filters.hasPermission !== undefined) {
      filtered = filtered.filter(a => a.isActive === filters.hasPermission);
    }

    return filtered;
  } catch (error) {
    console.error('[Controller] Error getting assistants:', error);
    throw new Error(`Failed to retrieve assistants: ${error.message}`);
  }
}

/**
 * Get assistant by ID
 * @param {string} id - Assistant ID
 */
async function getAssistantById(id) {
  try {
    console.debug(`[Controller] Getting assistant: ${id}`);

    if (!id) {
      throw new Error('Assistant ID is required');
    }

    // If using database, replace with:
    // return await Assistant.findOne({ id }).populate(['department', 'services']);

    const assistant = assistants.find(a => a.id === id);

    if (!assistant) {
      console.warn(`[Controller] Assistant not found: ${id}`);
      return null;
    }

    return assistant;
  } catch (error) {
    console.error(`[Controller] Error getting assistant ${id}:`, error);
    throw new Error(`Failed to retrieve assistant: ${error.message}`);
  }
}

/**
 * Get assistants by department
 * @param {string} departmentId - Department ID
 */
async function getAssistantsByDepartment(departmentId) {
  try {
    console.debug(`[Controller] Getting assistants for department: ${departmentId}`);

    // If using database, replace with:
    // return await Assistant.find({ department: departmentId });

    const filtered = assistants.filter(a => a.department === departmentId);

    return filtered;
  } catch (error) {
    console.error('[Controller] Error filtering by department:', error);
    throw new Error(`Failed to filter assistants: ${error.message}`);
  }
}

/**
 * Update assistant status
 * @param {string} id - Assistant ID
 * @param {Object} updates - Fields to update
 */
async function updateAssistant(id, updates) {
  try {
    console.debug(`[Controller] Updating assistant: ${id}`, updates);

    if (!id) {
      throw new Error('Assistant ID is required');
    }

    // If using database, replace with:
    // return await Assistant.findByIdAndUpdate(id, updates, { new: true });

    const assistant = assistants.find(a => a.id === id);

    if (!assistant) {
      return null;
    }

    // Update only allowed fields
    const allowedUpdates = ['isActive', 'lastActivity', 'status'];
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        assistant[key] = updates[key];
      }
    });

    return assistant;
  } catch (error) {
    console.error(`[Controller] Error updating assistant ${id}:`, error);
    throw new Error(`Failed to update assistant: ${error.message}`);
  }
}

module.exports = {
  getAssistants,
  getAssistantById,
  getAssistantsByDepartment,
  updateAssistant,
};
