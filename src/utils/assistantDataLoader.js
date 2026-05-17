const dataCache = new Map();

export const loadAssistantData = async assistantId => {
  if (dataCache.has(assistantId)) {
    return dataCache.get(assistantId);
  }

  try {
    const data = await import(`../data/assistants/${assistantId}.json`);
    const loaded = data.default || data;
    dataCache.set(assistantId, loaded);
    return loaded;
  } catch {
    return null;
  }
};

export const loadAllAssistantsData = async () => {
  const assistantIds = [
    'linda',
    'nina',
    'mary',
    'clara',
    'sophia',
    'daisy',
    'theodora',
    'olivia',
    'zoe',
    'aurora',
    'laila',
    'nancy',
    'hazel',
    'willow',
    'henry',
    'cipher',
    'atlas',
    'hunter',
    'kairos',
    'maven',
    'sentinel',
    'vesta',
    'juno',
    'evangeline',
  ];

  const entries = await Promise.all(
    assistantIds.map(async id => [id, await loadAssistantData(id)])
  );

  return Object.fromEntries(entries);
};

export const loadPropertiesData = async () => {
  if (dataCache.has('properties')) {
    return dataCache.get('properties');
  }

  try {
    const data = await import('../data/damacHills2/properties.json');
    const loaded = data.default || data;
    dataCache.set('properties', loaded);
    return loaded;
  } catch {
    return { properties: [] };
  }
};

export const loadWorkflowsData = async () => {
  if (dataCache.has('workflows')) {
    return dataCache.get('workflows');
  }

  try {
    const [services, events, property] = await Promise.all([
      import('../data/workflows/services.json'),
      import('../data/workflows/events.json'),
      import('../data/workflows/property.json'),
    ]);

    const loaded = {
      services: services.default || services,
      events: events.default || events,
      property: property.default || property,
    };
    dataCache.set('workflows', loaded);
    return loaded;
  } catch {
    return { services: [], events: [], property: [] };
  }
};

export const clearCache = () => {
  dataCache.clear();
};

export default {
  loadAssistantData,
  loadAllAssistantsData,
  loadPropertiesData,
  loadWorkflowsData,
  clearCache,
};
