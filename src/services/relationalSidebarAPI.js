/**
 * Relational Sidebar API Service
 * Handles all API calls for the relational sidebar system
 *
 * Base URL: /api/relational-sidebar
 * API Version: v1
 */

import { authFetch } from '../utils/authFetch';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000';
const SIDEBAR_API = `${API_BASE}/api/relational-sidebar`;

// Response interceptor
const handleResponse = async response => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText || 'Unknown error',
    }));
    throw new Error(error.message || `API error: ${response.status}`);
  }
  return response.json();
};

// Request wrapper with error handling
const apiCall = async (endpoint, options = {}) => {
  try {
    const url = `${SIDEBAR_API}${endpoint}`;
    const response = await authFetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await handleResponse(response);

    // Log successful request
    console.warn(`[API] ${options.method || 'GET'} ${endpoint} - Success`, data);

    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (error) {
    // Log error
    console.error(`[API] ${options.method || 'GET'} ${endpoint} - Error:`, error.message);

    return {
      success: false,
      error: error.message,
      data: null,
    };
  }
};

/**
 * ENDPOINT 1: Get all departments
 * GET /departments
 *
 * Returns list of all departments with their services
 */
export const getDepartments = async () => {
  return apiCall('/departments', {
    method: 'GET',
  });
};

/**
 * ENDPOINT 2: Get department details
 * GET /departments/:id
 *
 * Returns specific department with full details
 * @param {string} departmentId - Department ID (e.g., 'OPERATIONS')
 */
export const getDepartmentById = async departmentId => {
  if (!departmentId) {
    return {
      success: false,
      error: 'Department ID is required',
      data: null,
    };
  }

  return apiCall(`/departments/${departmentId}`, {
    method: 'GET',
  });
};

/**
 * ENDPOINT 3: Get all assistants (with optional filtering)
 * GET /assistants?department=OPERATIONS&service=inventory&hasPermission=true
 *
 * Returns list of assistants, optionally filtered
 */
export const getAssistants = async (filters = {}) => {
  const queryParams = new URLSearchParams();

  if (filters.department) queryParams.append('department', filters.department);
  if (filters.service) queryParams.append('service', filters.service);
  if (filters.hasPermission !== undefined) {
    queryParams.append('hasPermission', filters.hasPermission);
  }

  const query = queryParams.toString();
  const endpoint = `/assistants${query ? `?${query}` : ''}`;

  return apiCall(endpoint, {
    method: 'GET',
  });
};

/**
 * ENDPOINT 4: Get assistant details
 * GET /assistants/:id
 *
 * Returns specific assistant with full profile and available contexts
 * @param {string} assistantId - Assistant ID (e.g., 'mary_001')
 */
export const getAssistantById = async assistantId => {
  if (!assistantId) {
    return {
      success: false,
      error: 'Assistant ID is required',
      data: null,
    };
  }

  return apiCall(`/assistants/${assistantId}`, {
    method: 'GET',
  });
};

/**
 * ENDPOINT 5: Get contextual data for assistant
 * GET /assistants/:id/contexts/:context
 *
 * Returns context-specific data (e.g., inventory data for Mary)
 * @param {string} assistantId - Assistant ID (e.g., 'mary_001')
 * @param {string} context - Context name (e.g., 'inventory')
 */
export const getContextualData = async (assistantId, context) => {
  if (!assistantId || !context) {
    return {
      success: false,
      error: 'Assistant ID and context are required',
      data: null,
    };
  }

  return apiCall(`/assistants/${assistantId}/contexts/${context}`, {
    method: 'GET',
  });
};

/**
 * ENDPOINT 6: Send notification to assistant
 * POST /assistants/:id/notifications
 *
 * Creates a notification for the specified assistant
 * @param {string} assistantId - Assistant ID (e.g., 'linda_001')
 * @param {string} message - Notification message
 * @param {string} type - Type: 'info', 'warning', 'error', 'success'
 */
export const sendNotification = async (assistantId, message, type = 'info') => {
  if (!assistantId || !message) {
    return {
      success: false,
      error: 'Assistant ID and message are required',
      data: null,
    };
  }

  return apiCall(`/assistants/${assistantId}/notifications`, {
    method: 'POST',
    body: JSON.stringify({
      message,
      type,
      timestamp: new Date().toISOString(),
    }),
  });
};

/**
 * BATCH OPERATIONS
 */

/**
 * Get all data for initial load
 * Calls getDepartments() and getAssistants()
 */
export const initializeSidebarData = async () => {
  try {
    const [departmentsRes, assistantsRes] = await Promise.all([getDepartments(), getAssistants()]);

    if (!departmentsRes.success || !assistantsRes.success) {
      throw new Error('Failed to load sidebar data');
    }

    return {
      success: true,
      data: {
        departments: departmentsRes.data,
        assistants: assistantsRes.data,
      },
    };
  } catch (error) {
    console.error('[API] initializeSidebarData failed:', error);
    return {
      success: false,
      error: error.message,
      data: null,
    };
  }
};

/**
 * Get filtered assistants for department or service
 * @param {string} filterType - 'department' or 'service'
 * @param {string} filterId - Department ID or Service ID
 */
export const getFilteredAssistants = async (filterType, filterId) => {
  if (!filterType || !filterId) {
    return {
      success: false,
      error: 'Filter type and ID are required',
      data: null,
    };
  }

  const filters = {
    [filterType]: filterId,
  };

  return getAssistants(filters);
};

/**
 * Load full context with assistant and data
 * @param {string} assistantId - Assistant ID
 * @param {string} context - Context name
 */
export const loadContextFull = async (assistantId, context) => {
  try {
    const [assistantRes, dataRes] = await Promise.all([
      getAssistantById(assistantId),
      getContextualData(assistantId, context),
    ]);

    if (!assistantRes.success || !dataRes.success) {
      throw new Error('Failed to load context');
    }

    return {
      success: true,
      data: {
        assistant: assistantRes.data,
        contextData: dataRes.data,
      },
    };
  } catch (error) {
    console.error('[API] loadContextFull failed:', error);
    return {
      success: false,
      error: error.message,
      data: null,
    };
  }
};

/**
 * Health check - test API connectivity
 */
export const healthCheck = async () => {
  try {
    const response = await fetch(`${SIDEBAR_API}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return {
      success: response.ok,
      status: response.status,
    };
  } catch (error) {
    console.error('[API] Health check failed:', error);
    return {
      success: false,
      status: 0,
    };
  }
};

/**
 * API configuration
 */
export const API_CONFIG = {
  BASE_URL: SIDEBAR_API,
  ENDPOINTS: {
    DEPARTMENTS: '/departments',
    DEPARTMENT_BY_ID: '/departments/:id',
    ASSISTANTS: '/assistants',
    ASSISTANT_BY_ID: '/assistants/:id',
    CONTEXTUAL_DATA: '/assistants/:id/contexts/:context',
    SEND_NOTIFICATION: '/assistants/:id/notifications',
    HEALTH: '/health',
  },
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

export default {
  getDepartments,
  getDepartmentById,
  getAssistants,
  getAssistantById,
  getContextualData,
  sendNotification,
  initializeSidebarData,
  getFilteredAssistants,
  loadContextFull,
  healthCheck,
  API_CONFIG,
};
