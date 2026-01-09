const dataCache = {};

export const loadAssistantData = async (assistantId) => {
  if (dataCache[assistantId]) {
    return dataCache[assistantId];
  }
  
  try {
    const data = await import(`../data/assistants/${assistantId}.json`);
    dataCache[assistantId] = data.default || data;
    return dataCache[assistantId];
  } catch (error) {
    console.warn(`Failed to load data for ${assistantId}:`, error);
    return null;
  }
};

export const loadAllAssistantsData = async () => {
  const assistantIds = [
    'linda', 'nina', 'mary', 'clara', 'sophia', 'daisy', 'theodora', 'olivia',
    'zoe', 'aurora', 'laila', 'nancy', 'hazel', 'willow', 'henry', 'cipher',
    'atlas', 'hunter', 'kairos', 'maven', 'sentinel', 'vesta', 'juno', 'evangeline'
  ];
  
  const results = {};
  await Promise.all(
    assistantIds.map(async (id) => {
      results[id] = await loadAssistantData(id);
    })
  );
  
  return results;
};

export const loadPropertiesData = async () => {
  if (dataCache.properties) {
    return dataCache.properties;
  }
  
  try {
    const data = await import('../data/damacHills2/properties.json');
    dataCache.properties = data.default || data;
    return dataCache.properties;
  } catch (error) {
    console.warn('Failed to load properties data:', error);
    return { properties: [] };
  }
};

export const loadWorkflowsData = async () => {
  if (dataCache.workflows) {
    return dataCache.workflows;
  }
  
  try {
    const [services, events, property] = await Promise.all([
      import('../data/workflows/services.json'),
      import('../data/workflows/events.json'),
      import('../data/workflows/property.json')
    ]);
    
    dataCache.workflows = {
      services: services.default || services,
      events: events.default || events,
      property: property.default || property
    };
    
    return dataCache.workflows;
  } catch (error) {
    console.warn('Failed to load workflows data:', error);
    return { services: [], events: [], property: [] };
  }
};

export const clearCache = () => {
  Object.keys(dataCache).forEach(key => delete dataCache[key]);
};

export default {
  loadAssistantData,
  loadAllAssistantsData,
  loadPropertiesData,
  loadWorkflowsData,
  clearCache
};
