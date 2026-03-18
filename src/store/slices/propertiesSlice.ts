/**
 * Properties Redux Slice
 * Manages property inventory state (Mary - Inventory Manager)
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Property, PropertiesState, PropertySearch } from '../../types';
import apiClient from '../../services/apiClient';

const initialState: PropertiesState = {
  items: [],
  currentProperty: null,
  loading: false,
  error: null,
  filters: {},
  pagination: {
    currentPage: 1,
    pageSize: 20,
    total: 0,
  },
};

// Async thunks
export const fetchProperties = createAsyncThunk(
  'properties/fetchProperties',
  async (
    {
      page = 1,
      pageSize = 20,
      filters = {},
    }: { page?: number; pageSize?: number; filters?: PropertySearch },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.get<any>('/api/properties', {
        params: { page, pageSize, ...filters },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch properties');
    }
  }
);

export const fetchPropertyById = createAsyncThunk(
  'properties/fetchPropertyById',
  async (propertyId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<{ data: Property }>(`/api/properties/${propertyId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch property');
    }
  }
);

export const createProperty = createAsyncThunk(
  'properties/createProperty',
  async (propertyData: Partial<Property>, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<{ data: Property }>('/api/properties', propertyData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create property');
    }
  }
);

export const updateProperty = createAsyncThunk(
  'properties/updateProperty',
  async ({ id, data }: { id: string; data: Partial<Property> }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch<{ data: Property }>(`/api/properties/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update property');
    }
  }
);

export const deleteProperty = createAsyncThunk(
  'properties/deleteProperty',
  async (propertyId: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/api/properties/${propertyId}`);
      return propertyId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete property');
    }
  }
);

export const uploadPropertyMedia = createAsyncThunk(
  'properties/uploadPropertyMedia',
  async (
    { propertyId, file }: { propertyId: string; file: File },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post<any>(
        `/api/properties/${propertyId}/media`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return { propertyId, mediaUrl: response.data.url };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload media');
    }
  }
);

const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<PropertySearch>) => {
      state.filters = action.payload;
      state.pagination.currentPage = 1;
    },
    clearFilters: (state) => {
      state.filters = {};
      state.pagination.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch properties
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch property by ID
    builder
      .addCase(fetchPropertyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropertyById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProperty = action.payload;
      })
      .addCase(fetchPropertyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create property
    builder
      .addCase(createProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update property
    builder
      .addCase(updateProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentProperty?.id === action.payload.id) {
          state.currentProperty = action.payload;
        }
      })
      .addCase(updateProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete property
    builder
      .addCase(deleteProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((p) => p.id !== action.payload);
        state.pagination.total -= 1;
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters, setCurrentPage } = propertiesSlice.actions;
export default propertiesSlice.reducer;
