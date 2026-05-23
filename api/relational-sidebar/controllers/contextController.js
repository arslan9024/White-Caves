/**
 * Context Controller
 * Handles context-specific data retrieval (inventory, campaigns, etc.)
 */

const { contextData } = require('../data/mockData');

/**
 * Get contextual data for an assistant
 * @param {string} assistantId - Assistant ID
 * @param {string} context - Context name (inventory, campaigns, clients, messages)
 */
async function getContextualData(assistantId, context) {
  try {
    console.debug(`[Controller] Getting context data for ${assistantId}/${context}`);

    if (!assistantId || !context) {
      throw new Error('Assistant ID and context are required');
    }

    // If using database, replace with:
    // return await ContextData.findOne({
    //   assistantId,
    //   context,
    // }).lean();

    const data = contextData.find(
      cd => cd.assistantId === assistantId && cd.context === context
    );

    if (!data) {
      console.warn(
        `[Controller] Context data not found for ${assistantId}/${context}`
      );
      return null;
    }

    return {
      ...data,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[Controller] Error getting context data:', error);
    throw new Error(`Failed to retrieve context data: ${error.message}`);
  }
}

/**
 * Get all contexts for an assistant
 * @param {string} assistantId - Assistant ID
 */
async function getAllContextsForAssistant(assistantId) {
  try {
    console.debug(`[Controller] Getting all contexts for ${assistantId}`);

    if (!assistantId) {
      throw new Error('Assistant ID is required');
    }

    // If using database, replace with:
    // return await ContextData.find({ assistantId });

    const contexts = contextData.filter(cd => cd.assistantId === assistantId);

    return contexts.map(c => ({
      context: c.context,
      itemCount: Array.isArray(c.items) ? c.items.length : 0,
      lastUpdated: c.lastUpdated,
    }));
  } catch (error) {
    console.error('[Controller] Error getting contexts:', error);
    throw new Error(`Failed to retrieve contexts: ${error.message}`);
  }
}

/**
 * Update context data
 * @param {string} assistantId - Assistant ID
 * @param {string} context - Context name
 * @param {Object} updates - Data to update
 */
async function updateContextData(assistantId, context, updates) {
  try {
    console.debug(`[Controller] Updating context ${assistantId}/${context}`);

    if (!assistantId || !context) {
      throw new Error('Assistant ID and context are required');
    }

    // If using database, replace with:
    // return await ContextData.findOneAndUpdate(
    //   { assistantId, context },
    //   { ...updates, lastUpdated: new Date() },
    //   { new: true }
    // );

    const data = contextData.find(
      cd => cd.assistantId === assistantId && cd.context === context
    );

    if (!data) {
      return null;
    }

    // Update data
    Object.assign(data, updates, { lastUpdated: new Date().toISOString() });

    return data;
  } catch (error) {
    console.error('[Controller] Error updating context data:', error);
    throw new Error(`Failed to update context data: ${error.message}`);
  }
}

/**
 * Search within context
 * @param {string} assistantId - Assistant ID
 * @param {string} context - Context name
 * @param {string} searchTerm - Search term
 */
async function searchContext(assistantId, context, searchTerm) {
  try {
    console.debug(`[Controller] Searching ${assistantId}/${context} for "${searchTerm}"`);

    if (!assistantId || !context || !searchTerm) {
      throw new Error('Assistant ID, context, and search term are required');
    }

    // If using database, replace with:
    // return await ContextData.findOne({ assistantId, context })
    //   .select('items')
    //   .exec()
    //   .then(doc => ({
    //     ...doc,
    //     items: doc.items.filter(item =>
    //       JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
    //     ),
    //   }));

    const data = contextData.find(
      cd => cd.assistantId === assistantId && cd.context === context
    );

    if (!data || !Array.isArray(data.items)) {
      return null;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = {
      ...data,
      items: data.items.filter(item =>
        JSON.stringify(item).toLowerCase().includes(searchLower)
      ),
    };

    return filtered;
  } catch (error) {
    console.error('[Controller] Error searching context:', error);
    throw new Error(`Failed to search context: ${error.message}`);
  }
}

module.exports = {
  getContextualData,
  getAllContextsForAssistant,
  updateContextData,
  searchContext,
};
