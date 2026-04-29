/**
 * Relational Filtering Logic
 * Handles smart filtering between departments, services, and assistants
 */

// Import assistant data (from your existing data)
const ASSISTANTS = {
  linda_001: {
    name: 'Linda',
    description: 'WhatsApp CRM Agent',
    color: '#25D366',
    departments: ['COMMUNICATIONS', 'SALES'],
    services: ['whatsapp', 'crm', 'client-management'],
    contexts: ['crm', 'messaging'],
    icon: 'MessageCircle',
  },
  nina_001: {
    name: 'Nina',
    description: 'WhatsApp Bot Developer',
    color: '#25D366',
    departments: ['COMMUNICATIONS'],
    services: ['whatsapp', 'automation'],
    contexts: ['automation'],
    icon: 'Bot',
  },
  kai_001: {
    name: 'Kai',
    description: 'Voice Assistant',
    color: '#25D366',
    departments: ['COMMUNICATIONS'],
    services: ['voice', 'communication'],
    contexts: ['voice'],
    icon: 'Phone',
  },
  mary_001: {
    name: 'Mary',
    description: 'Inventory Manager',
    color: '#3B82F6',
    departments: ['OPERATIONS'],
    services: ['inventory', 'properties'],
    contexts: ['inventory', 'property-management'],
    icon: 'Package',
  },
  daisy_001: {
    name: 'Daisy',
    description: 'Leasing Manager',
    color: '#3B82F6',
    departments: ['OPERATIONS', 'LEASING'],
    services: ['leasing', 'contracts'],
    contexts: ['leasing'],
    icon: 'FileText',
  },
  sentinel_001: {
    name: 'Sentinel',
    description: 'Property Monitor',
    color: '#3B82F6',
    departments: ['OPERATIONS'],
    services: ['monitoring', 'alerts'],
    contexts: ['monitoring'],
    icon: 'AlertCircle',
  },
  nancy_001: {
    name: 'Nancy',
    description: 'HR Coordinator',
    color: '#3B82F6',
    departments: ['OPERATIONS', 'HR'],
    services: ['hr', 'recruitment'],
    contexts: ['hr'],
    icon: 'Users',
  },
  clara_001: {
    name: 'Clara',
    description: 'Leads Manager',
    color: '#10B981',
    departments: ['SALES'],
    services: ['leads', 'pipeline'],
    contexts: ['sales', 'leads'],
    icon: 'Target',
  },
  sophia_001: {
    name: 'Sophia',
    description: 'Sales Pipeline',
    color: '#10B981',
    departments: ['SALES'],
    services: ['pipeline', 'sales-analytics'],
    contexts: ['sales'],
    icon: 'TrendingUp',
  },
  hunter_001: {
    name: 'Hunter',
    description: 'Lead Prospector',
    color: '#10B981',
    departments: ['SALES'],
    services: ['prospecting', 'outreach'],
    contexts: ['sales', 'leads'],
    icon: 'Search',
  },
  theodora_001: {
    name: 'Theodora',
    description: 'Finance Director',
    color: '#F59E0B',
    departments: ['FINANCE'],
    services: ['accounting', 'finance'],
    contexts: ['finance'],
    icon: 'DollarSign',
  },
  penny_001: {
    name: 'Penny',
    description: 'Commission Tracker',
    color: '#F59E0B',
    departments: ['FINANCE'],
    services: ['commissions', 'payments'],
    contexts: ['finance'],
    icon: 'CreditCard',
  },
  quinn_001: {
    name: 'Quinn',
    description: 'Payment Processor',
    color: '#F59E0B',
    departments: ['FINANCE'],
    services: ['payments', 'transactions'],
    contexts: ['finance'],
    icon: 'Wallet',
  },
  olivia_001: {
    name: 'Olivia',
    description: 'Marketing Manager',
    color: '#EC4899',
    departments: ['MARKETING'],
    services: ['marketing', 'campaigns'],
    contexts: ['marketing'],
    icon: 'Megaphone',
  },
  marcus_001: {
    name: 'Marcus',
    description: 'Campaign Manager',
    color: '#EC4899',
    departments: ['MARKETING'],
    services: ['campaigns', 'analytics'],
    contexts: ['marketing'],
    icon: 'BarChart3',
  },
  stella_001: {
    name: 'Stella',
    description: 'Content Creator',
    color: '#EC4899',
    departments: ['MARKETING'],
    services: ['content', 'creative'],
    contexts: ['marketing'],
    icon: 'PenTool',
  },
  nova_001: {
    name: 'Nova',
    description: 'Social Media Manager',
    color: '#EC4899',
    departments: ['MARKETING'],
    services: ['social-media', 'engagement'],
    contexts: ['marketing'],
    icon: 'Share2',
  },
  zoe_001: {
    name: 'Zoe',
    description: 'Executive Assistant',
    color: '#8B5CF6',
    departments: ['EXECUTIVE'],
    services: ['executive', 'strategy'],
    contexts: ['executive'],
    icon: 'Crown',
  },
  cipher_001: {
    name: 'Cipher',
    description: 'Market Analyst',
    color: '#8B5CF6',
    departments: ['EXECUTIVE', 'ANALYTICS'],
    services: ['analytics', 'reporting'],
    contexts: ['analytics'],
    icon: 'LineChart',
  },
  laila_001: {
    name: 'Laila',
    description: 'Compliance Officer',
    color: '#EF4444',
    departments: ['COMPLIANCE'],
    services: ['compliance', 'audit'],
    contexts: ['compliance'],
    icon: 'CheckCircle',
  },
  evangeline_001: {
    name: 'Evangeline',
    description: 'Legal Risk Analyst',
    color: '#EF4444',
    departments: ['COMPLIANCE', 'LEGAL'],
    services: ['legal', 'risk-management'],
    contexts: ['legal'],
    icon: 'Scale',
  },
  jasper_001: {
    name: 'Jasper',
    description: 'Document Processor',
    color: '#6B7280',
    departments: ['LEGAL'],
    services: ['documents', 'processing'],
    contexts: ['legal'],
    icon: 'FileText',
  },
  max_001: {
    name: 'Max',
    description: 'OCR Engine',
    color: '#6B7280',
    departments: ['LEGAL', 'TECHNOLOGY'],
    services: ['ocr', 'document-processing'],
    contexts: ['legal', 'technology'],
    icon: 'Eye',
  },
  aurora_001: {
    name: 'Aurora',
    description: 'CTO & Architect',
    color: '#14B8A6',
    departments: ['TECHNOLOGY'],
    services: ['architecture', 'strategy'],
    contexts: ['technology'],
    icon: 'Layers',
  },
  hazel_001: {
    name: 'Hazel',
    description: 'Frontend Engineer',
    color: '#14B8A6',
    departments: ['TECHNOLOGY'],
    services: ['frontend', 'ui'],
    contexts: ['technology'],
    icon: 'Layout',
  },
  willow_001: {
    name: 'Willow',
    description: 'Backend Engineer',
    color: '#14B8A6',
    departments: ['TECHNOLOGY'],
    services: ['backend', 'api'],
    contexts: ['technology'],
    icon: 'Server',
  },
  henry_001: {
    name: 'Henry',
    description: 'Record Keeper',
    color: '#14B8A6',
    departments: ['TECHNOLOGY'],
    services: ['database', 'records'],
    contexts: ['technology'],
    icon: 'Database',
  },
  orion_001: {
    name: 'Orion',
    description: 'QA Master',
    color: '#14B8A6',
    departments: ['TECHNOLOGY'],
    services: ['qa', 'testing'],
    contexts: ['technology'],
    icon: 'CheckSquare',
  },
  celeste_001: {
    name: 'Celeste',
    description: 'AI/ML Specialist',
    color: '#14B8A6',
    departments: ['TECHNOLOGY'],
    services: ['ai', 'machine-learning'],
    contexts: ['technology', 'ai'],
    icon: 'Cpu',
  },
  coral_001: {
    name: 'Coral',
    description: 'DB Architect',
    color: '#14B8A6',
    departments: ['TECHNOLOGY'],
    services: ['database', 'architecture'],
    contexts: ['technology'],
    icon: 'Database',
  },
  marina_001: {
    name: 'Marina',
    description: 'DevOps Engineer',
    color: '#14B8A6',
    departments: ['TECHNOLOGY'],
    services: ['devops', 'infrastructure'],
    contexts: ['technology'],
    icon: 'Cloud',
  },
  ember_001: {
    name: 'Ember',
    description: 'Frontend Engineer',
    color: '#14B8A6',
    departments: ['TECHNOLOGY'],
    services: ['frontend', 'ui'],
    contexts: ['technology'],
    icon: 'Layout',
  },
};

const DEPARTMENTS = [
  'EXECUTIVE',
  'OPERATIONS',
  'SALES',
  'FINANCE',
  'MARKETING',
  'LEASING',
  'COMPLIANCE',
  'LEGAL',
  'TECHNOLOGY',
  'HR',
  'ANALYTICS',
  'COMMUNICATIONS',
];

/**
 * Filter assistants based on selected department
 * @param {string} departmentId - Selected department ID
 * @param {Object} userPermissions - User's access permissions
 * @returns {Array} Filtered assistants
 */
export const filterAssistantsByDepartment = (departmentId, userPermissions = {}) => {
  try {
    return Object.entries(ASSISTANTS)
      .filter(([id, assistant]) => {
        // Check if assistant works in this department
        const isInDepartment = assistant.departments.includes(departmentId);
        // Check if user has permission to access this assistant
        const hasPermission = userPermissions[id] !== false;
        return isInDepartment && hasPermission;
      })
      .map(([id, assistant]) => ({ id, ...assistant }));
  } catch (error) {
    console.error('Error filtering assistants by department:', error);
    return [];
  }
};

/**
 * Filter assistants based on selected service
 * @param {string} serviceId - Selected service ID
 * @param {Object} userPermissions - User's access permissions
 * @returns {Array} Filtered assistants
 */
export const filterAssistantsByService = (serviceId, userPermissions = {}) => {
  try {
    return Object.entries(ASSISTANTS)
      .filter(([id, assistant]) => {
        const isInService = assistant.services.includes(serviceId);
        const hasPermission = userPermissions[id] !== false;
        return isInService && hasPermission;
      })
      .map(([id, assistant]) => ({ id, ...assistant }));
  } catch (error) {
    console.error('Error filtering assistants by service:', error);
    return [];
  }
};

/**
 * Filter services based on selected assistant
 * @param {string} assistantId - Selected assistant ID
 * @returns {Array} Services the assistant can access
 */
export const filterServicesByAssistant = (assistantId) => {
  try {
    const assistant = ASSISTANTS[assistantId];
    if (!assistant) return [];
    return assistant.services || [];
  } catch (error) {
    console.error('Error filtering services by assistant:', error);
    return [];
  }
};

/**
 * Filter departments based on selected assistant
 * @param {string} assistantId - Selected assistant ID
 * @returns {Array} Departments the assistant works in
 */
export const filterDepartmentsByAssistant = (assistantId) => {
  try {
    const assistant = ASSISTANTS[assistantId];
    if (!assistant) return [];
    return assistant.departments || [];
  } catch (error) {
    console.error('Error filtering departments by assistant:', error);
    return [];
  }
};

/**
 * Get default assistant selection based on department or user history
 * @param {string} departmentId - Selected department
 * @param {Array} selectionHistory - User's selection history
 * @param {Object} userPermissions - User permissions
 * @returns {string} Assistant ID to select
 */
export const getDefaultAssistant = (
  departmentId,
  selectionHistory = [],
  userPermissions = {}
) => {
  try {
    // Check if user previously selected an assistant in this department
    const lastAssistantInDept = selectionHistory
      .reverse()
      .find((item) => {
        if (item.type !== 'assistant') return false;
        const assistant = ASSISTANTS[item.id];
        return assistant?.departments.includes(departmentId);
      });

    if (lastAssistantInDept) return lastAssistantInDept.id;

    // Otherwise, return first accessible assistant in department
    const filtered = filterAssistantsByDepartment(departmentId, userPermissions);
    return filtered.length > 0 ? filtered[0].id : null;
  } catch (error) {
    console.error('Error getting default assistant:', error);
    return null;
  }
};

/**
 * Get default department based on user history
 * @param {Array} selectionHistory - User's selection history
 * @returns {string} Department ID to select
 */
export const getDefaultDepartment = (selectionHistory = []) => {
  try {
    // Check if user previously selected a department
    const lastDept = selectionHistory
      .reverse()
      .find((item) => item.type === 'department');

    if (lastDept) return lastDept.id;

    // Default to first department
    return DEPARTMENTS[0];
  } catch (error) {
    console.error('Error getting default department:', error);
    return DEPARTMENTS[0];
  }
};

/**
 * Get context options for selected assistant
 * @param {string} assistantId - Assistant ID
 * @returns {Array} Available contexts for this assistant
 */
export const getContextsForAssistant = (assistantId) => {
  try {
    const assistant = ASSISTANTS[assistantId];
    if (!assistant) return [];
    return assistant.contexts || [];
  } catch (error) {
    console.error('Error getting contexts for assistant:', error);
    return [];
  }
};

/**
 * Check if assistant+context combination exists
 * @param {string} assistantId - Assistant ID
 * @param {string} context - Context name
 * @returns {boolean}
 */
export const isValidAssistantContext = (assistantId, context) => {
  try {
    const assistant = ASSISTANTS[assistantId];
    if (!assistant) return false;
    return assistant.contexts.includes(context);
  } catch (error) {
    console.error('Error checking valid assistant context:', error);
    return false;
  }
};

/**
 * Build complete relationship map
 * Maps all department -> assistants and assistants -> services relationships
 * @param {Object} userPermissions - User permissions
 * @returns {Object} Complete relationship map
 */
export const buildRelationshipMap = (userPermissions = {}) => {
  try {
    const map = {
      departmentAssistants: {},
      assistantDepartments: {},
      assistantServices: {},
      serviceAssistants: {},
    };

    // Build department -> assistants
    DEPARTMENTS.forEach((dept) => {
      map.departmentAssistants[dept] = filterAssistantsByDepartment(
        dept,
        userPermissions
      ).map((a) => a.id);
    });

    // Build assistant -> departments & services
    Object.entries(ASSISTANTS).forEach(([id, assistant]) => {
      if (userPermissions[id] !== false) {
        map.assistantDepartments[id] = assistant.departments;
        map.assistantServices[id] = assistant.services;

        // Build service -> assistants
        assistant.services.forEach((service) => {
          if (!map.serviceAssistants[service]) {
            map.serviceAssistants[service] = [];
          }
          map.serviceAssistants[service].push(id);
        });
      }
    });

    return map;
  } catch (error) {
    console.error('Error building relationship map:', error);
    return {};
  }
};

/**
 * Get sidebar render configuration based on current selections
 * @param {string} selectedAssistant - Currently selected assistant
 * @param {string} selectedDepartment - Currently selected department
 * @param {string} activeContext - Currently active context
 * @returns {Object} Configuration for what sidebars to show
 */
export const getSidebarRenderConfig = (
  selectedAssistant,
  selectedDepartment,
  activeContext
) => {
  try {
    return {
      showLeftSidebar: true, // Always show department/service sidebar
      showRightSidebar: true, // Always show assistant sidebar
      showFeatureSidebar:
        selectedAssistant && activeContext
          ? isValidAssistantContext(selectedAssistant, activeContext)
          : false,
      featureSidebarType: activeContext, // 'inventory', 'leasing', etc.
      breadcrumb: {
        department: selectedDepartment,
        service:
          filterServicesByAssistant(selectedAssistant)[0] || null,
        assistant: selectedAssistant,
        context: activeContext,
      },
    };
  } catch (error) {
    console.error('Error getting sidebar render config:', error);
    return {
      showLeftSidebar: true,
      showRightSidebar: true,
      showFeatureSidebar: false,
    };
  }
};

export { ASSISTANTS, DEPARTMENTS };
