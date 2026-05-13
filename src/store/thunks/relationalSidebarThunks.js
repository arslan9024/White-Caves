/**
 * Redux Thunks for Relational Sidebar API Integration
 *
 * These thunks connect the Redux state to the API service
 * They handle async operations and dispatch actions to update state
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import * as sidebarAPI from '../../services/relationalSidebarAPI';

/**
 * THUNK 1: Fetch all departments
 * Dispatches to relationalSidebarSlice.fetchDepartments
 */
export const fetchDepartments = createAsyncThunk(
  'relationalSidebar/fetchDepartments',
  async (_, { rejectWithValue }) => {
    try {
      console.warn('[Thunk] Fetching departments...');

      const response = await sidebarAPI.getDepartments();

      if (!response.success) {
        console.error('[Thunk] Failed to fetch departments:', response.error);
        return rejectWithValue(response.error);
      }

      console.warn('[Thunk] Departments fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('[Thunk] Error in fetchDepartments:', error);
      return rejectWithValue(error.message);
    }
  }
);

/**
 * THUNK 2: Fetch specific department by ID
 * @param {string} departmentId - Department ID (e.g., 'OPERATIONS')
 */
export const fetchDepartmentById = createAsyncThunk(
  'relationalSidebar/fetchDepartmentById',
  async (departmentId, { rejectWithValue }) => {
    try {
      if (!departmentId) {
        return rejectWithValue('Department ID is required');
      }

      console.warn(`[Thunk] Fetching department: ${departmentId}`);

      const response = await sidebarAPI.getDepartmentById(departmentId);

      if (!response.success) {
        console.error(`[Thunk] Failed to fetch department ${departmentId}:`, response.error);
        return rejectWithValue(response.error);
      }

      console.warn(`[Thunk] Department ${departmentId} fetched successfully`);
      return response.data;
    } catch (error) {
      console.error('[Thunk] Error in fetchDepartmentById:', error);
      return rejectWithValue(error.message);
    }
  }
);

/**
 * THUNK 3: Fetch all assistants with optional filtering
 * @param {Object} filters - Filter options
 */
export const fetchAssistants = createAsyncThunk(
  'relationalSidebar/fetchAssistants',
  async (filters = {}, { rejectWithValue }) => {
    try {
      console.warn('[Thunk] Fetching assistants...', filters);

      const response = await sidebarAPI.getAssistants(filters);

      if (!response.success) {
        console.error('[Thunk] Failed to fetch assistants:', response.error);
        return rejectWithValue(response.error);
      }

      console.warn('[Thunk] Assistants fetched successfully:', response.data);
      return {
        assistants: response.data,
        filters: filters,
      };
    } catch (error) {
      console.error('[Thunk] Error in fetchAssistants:', error);
      return rejectWithValue(error.message);
    }
  }
);

/**
 * THUNK 4: Fetch specific assistant by ID
 * @param {string} assistantId - Assistant ID
 */
export const fetchAssistantById = createAsyncThunk(
  'relationalSidebar/fetchAssistantById',
  async (assistantId, { rejectWithValue }) => {
    try {
      if (!assistantId) {
        return rejectWithValue('Assistant ID is required');
      }

      console.warn(`[Thunk] Fetching assistant: ${assistantId}`);

      const response = await sidebarAPI.getAssistantById(assistantId);

      if (!response.success) {
        console.error(`[Thunk] Failed to fetch assistant ${assistantId}:`, response.error);
        return rejectWithValue(response.error);
      }

      console.warn(`[Thunk] Assistant ${assistantId} fetched successfully`);
      return response.data;
    } catch (error) {
      console.error('[Thunk] Error in fetchAssistantById:', error);
      return rejectWithValue(error.message);
    }
  }
);

/**
 * THUNK 5: Fetch contextual data for assistant
 * @param {Object} payload - { assistantId, context }
 */
export const fetchContextualData = createAsyncThunk(
  'relationalSidebar/fetchContextualData',
  async ({ assistantId, context }, { rejectWithValue }) => {
    try {
      if (!assistantId || !context) {
        return rejectWithValue('Assistant ID and context are required');
      }

      console.warn(`[Thunk] Fetching context data: ${assistantId}/${context}`);

      const response = await sidebarAPI.getContextualData(assistantId, context);

      if (!response.success) {
        console.error(
          `[Thunk] Failed to fetch context data ${assistantId}/${context}:`,
          response.error
        );
        return rejectWithValue(response.error);
      }

      console.warn(`[Thunk] Context data ${assistantId}/${context} fetched successfully`);
      return {
        assistantId,
        context,
        data: response.data,
      };
    } catch (error) {
      console.error('[Thunk] Error in fetchContextualData:', error);
      return rejectWithValue(error.message);
    }
  }
);

/**
 * THUNK 6: Send notification to assistant
 * @param {Object} payload - { assistantId, message, type }
 */
export const sendNotification = createAsyncThunk(
  'relationalSidebar/sendNotification',
  async ({ assistantId, message, type = 'info' }, { rejectWithValue }) => {
    try {
      if (!assistantId || !message) {
        return rejectWithValue('Assistant ID and message are required');
      }

      console.warn(`[Thunk] Sending notification to ${assistantId}:`, message);

      const response = await sidebarAPI.sendNotification(assistantId, message, type);

      if (!response.success) {
        console.error(`[Thunk] Failed to send notification to ${assistantId}:`, response.error);
        return rejectWithValue(response.error);
      }

      console.warn(`[Thunk] Notification sent to ${assistantId} successfully`);
      return {
        assistantId,
        notification: response.data,
      };
    } catch (error) {
      console.error('[Thunk] Error in sendNotification:', error);
      return rejectWithValue(error.message);
    }
  }
);

/**
 * THUNK 7: Initialize sidebar (load departments and assistants)
 * This is called on app mount to load all initial data
 */
export const initializeSidebar = createAsyncThunk(
  'relationalSidebar/initializeSidebar',
  async (_, { rejectWithValue, dispatch: _dispatch }) => {
    try {
      console.warn('[Thunk] Initializing sidebar...');

      const response = await sidebarAPI.initializeSidebarData();

      if (!response.success) {
        console.error('[Thunk] Failed to initialize sidebar:', response.error);
        return rejectWithValue(response.error);
      }

      console.warn('[Thunk] Sidebar initialized successfully');
      return {
        departments: response.data.departments,
        assistants: response.data.assistants,
      };
    } catch (error) {
      console.error('[Thunk] Error in initializeSidebar:', error);
      return rejectWithValue(error.message);
    }
  }
);

/**
 * THUNK 8: Fetch filtered assistants
 * @param {Object} payload - { filterType: 'department'|'service', filterId }
 */
export const fetchFilteredAssistants = createAsyncThunk(
  'relationalSidebar/fetchFilteredAssistants',
  async ({ filterType, filterId }, { rejectWithValue }) => {
    try {
      if (!filterType || !filterId) {
        return rejectWithValue('Filter type and ID are required');
      }

      console.warn(`[Thunk] Fetching filtered assistants: ${filterType}=${filterId}`);

      const response = await sidebarAPI.getFilteredAssistants(filterType, filterId);

      if (!response.success) {
        console.error('[Thunk] Failed to fetch filtered assistants:', response.error);
        return rejectWithValue(response.error);
      }

      console.warn(`[Thunk] Filtered assistants (${filterType}=${filterId}) fetched successfully`);
      return {
        assistants: response.data,
        filter: {
          type: filterType,
          id: filterId,
        },
      };
    } catch (error) {
      console.error('[Thunk] Error in fetchFilteredAssistants:', error);
      return rejectWithValue(error.message);
    }
  }
);

/**
 * THUNK 9: Load full context (assistant + contextual data)
 * @param {Object} payload - { assistantId, context }
 */
export const loadFullContext = createAsyncThunk(
  'relationalSidebar/loadFullContext',
  async ({ assistantId, context }, { rejectWithValue }) => {
    try {
      if (!assistantId || !context) {
        return rejectWithValue('Assistant ID and context are required');
      }

      console.warn(`[Thunk] Loading full context: ${assistantId}/${context}`);

      const response = await sidebarAPI.loadContextFull(assistantId, context);

      if (!response.success) {
        console.error(
          `[Thunk] Failed to load full context ${assistantId}/${context}:`,
          response.error
        );
        return rejectWithValue(response.error);
      }

      console.warn(`[Thunk] Full context ${assistantId}/${context} loaded successfully`);
      return {
        assistantId,
        context,
        assistant: response.data.assistant,
        contextData: response.data.contextData,
      };
    } catch (error) {
      console.error('[Thunk] Error in loadFullContext:', error);
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Thunk handlers for common patterns
 * These are helper functions to handle pending/fulfilled/rejected states
 */

export const handlePendingState = state => {
  state.loading = true;
  state.error = null;
};

export const handleRejectedState = (state, action) => {
  state.loading = false;
  state.error = action.payload || 'An error occurred';
};

export const handleFulfilledState = state => {
  state.loading = false;
  state.error = null;
};

export default {
  fetchDepartments,
  fetchDepartmentById,
  fetchAssistants,
  fetchAssistantById,
  fetchContextualData,
  sendNotification,
  initializeSidebar,
  fetchFilteredAssistants,
  loadFullContext,
};
