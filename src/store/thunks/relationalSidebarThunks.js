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

      const response = await sidebarAPI.getDepartments();

      if (!response.success) {
        
        return rejectWithValue(response.error);
      }

      return response.data;
    } catch (error) {
      
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

      const response = await sidebarAPI.getDepartmentById(departmentId);

      if (!response.success) {
        
        return rejectWithValue(response.error);
      }

      return response.data;
    } catch (error) {
      
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

      const response = await sidebarAPI.getAssistants(filters);

      if (!response.success) {
        
        return rejectWithValue(response.error);
      }

      return {
        assistants: response.data,
        filters: filters,
      };
    } catch (error) {
      
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

      const response = await sidebarAPI.getAssistantById(assistantId);

      if (!response.success) {
        
        return rejectWithValue(response.error);
      }

      return response.data;
    } catch (error) {
      
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

      const response = await sidebarAPI.getContextualData(assistantId, context);

      if (!response.success) {
        
        return rejectWithValue(response.error);
      }

      return {
        assistantId,
        context,
        data: response.data,
      };
    } catch (error) {
      
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

      const response = await sidebarAPI.sendNotification(assistantId, message, type);

      if (!response.success) {
        
        return rejectWithValue(response.error);
      }

      return {
        assistantId,
        notification: response.data,
      };
    } catch (error) {
      
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

      const response = await sidebarAPI.initializeSidebarData();

      if (!response.success) {
        
        return rejectWithValue(response.error);
      }

      return {
        departments: response.data.departments,
        assistants: response.data.assistants,
      };
    } catch (error) {
      
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

      const response = await sidebarAPI.getFilteredAssistants(filterType, filterId);

      if (!response.success) {
        return rejectWithValue(response.error);
      }

      return {
        assistants: response.data,
        filter: {
          type: filterType,
          id: filterId,
        },
      };
    } catch (error) {
      
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

      const response = await sidebarAPI.loadContextFull(assistantId, context);

      if (!response.success) {
        
        return rejectWithValue(response.error);
      }

      return {
        assistantId,
        context,
        assistant: response.data.assistant,
        contextData: response.data.contextData,
      };
    } catch (error) {
      
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
