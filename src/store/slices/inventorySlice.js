import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import crmDataService from '../../services/CRMDataService';

export const loadInventoryData = createAsyncThunk(
  'inventory/loadData',
  async (_, { rejectWithValue }) => {
    try {
      const [propertiesRes, statsRes, areasRes] = await Promise.all([
        crmDataService.getProperties(),
        crmDataService.getPropertyStats(),
        crmDataService.getPropertyAreas()
      ]);

      const properties = propertiesRes.properties || propertiesRes.data || [];
      const propertiesById = {};
      const propertyIds = [];
      
      properties.forEach(p => {
        const id = p.pNumber || p._id || p.id;
        propertiesById[id] = { ...p, pNumber: id };
        propertyIds.push(id);
      });

      return {
        properties: { byId: propertiesById, allIds: propertyIds },
        stats: statsRes.stats || statsRes,
        areas: areasRes.areas || areasRes,
        manifest: {
          sheets: [],
          clusters: [],
          stats: statsRes.stats || {},
          filterOptions: {
            areas: areasRes.areas || [],
            statuses: ['Available', 'Rented', 'Sold', 'Reserved'],
            propertyTypes: ['Villa', 'Townhouse', 'Apartment']
          }
        }
      };
    } catch (error) {
      console.error('Failed to load inventory from API:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const loadOwnersData = createAsyncThunk(
  'inventory/loadOwners',
  async (_, { rejectWithValue }) => {
    try {
      const response = await crmDataService.getOwners();
      const owners = response.owners || response.data || [];
      
      const ownersById = {};
      const ownerIds = [];
      
      owners.forEach(o => {
        const id = o.id || o._id;
        ownersById[id] = { ...o, id };
        ownerIds.push(id);
      });

      return { byId: ownersById, allIds: ownerIds };
    } catch (error) {
      console.error('Failed to load owners from API:', error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  properties: { byId: {}, allIds: [] },
  owners: { byId: {}, allIds: [] },
  ownerships: { byPropertyId: {}, byOwnerId: {} },
  manifest: { sheets: [], clusters: [], stats: {}, filterOptions: {} },
  stats: {},
  areas: [],
  filters: {
    cluster: null,
    status: null,
    area: null,
    layout: null,
    view: null,
    floor: null,
    rooms: null,
    masterProject: null,
    searchQuery: '',
    showMultiOwner: false,
    showMultiPhone: false,
    showMultiProperty: false
  },
  selectedPropertyId: null,
  selectedOwnerId: null,
  loading: false,
  ownersLoading: false,
  error: null
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    selectProperty: (state, action) => {
      state.selectedPropertyId = action.payload;
    },
    selectOwner: (state, action) => {
      state.selectedOwnerId = action.payload;
    },
    toggleMultiOwnerFilter: (state) => {
      state.filters.showMultiOwner = !state.filters.showMultiOwner;
    },
    toggleMultiPhoneFilter: (state) => {
      state.filters.showMultiPhone = !state.filters.showMultiPhone;
    },
    toggleMultiPropertyFilter: (state) => {
      state.filters.showMultiProperty = !state.filters.showMultiProperty;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadInventoryData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadInventoryData.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload.properties;
        state.stats = action.payload.stats;
        state.areas = action.payload.areas;
        state.manifest = action.payload.manifest;
      })
      .addCase(loadInventoryData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(loadOwnersData.pending, (state) => {
        state.ownersLoading = true;
      })
      .addCase(loadOwnersData.fulfilled, (state, action) => {
        state.ownersLoading = false;
        state.owners = action.payload;
      })
      .addCase(loadOwnersData.rejected, (state, action) => {
        state.ownersLoading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

export const {
  setFilter,
  clearFilters,
  selectProperty,
  selectOwner,
  toggleMultiOwnerFilter,
  toggleMultiPhoneFilter,
  toggleMultiPropertyFilter
} = inventorySlice.actions;

const selectInventory = state => state.inventory;

export const selectFilters = createSelector(
  [selectInventory],
  (inventory) => inventory?.filters || initialState.filters
);

export const selectProperties = createSelector(
  [selectInventory],
  (inventory) => {
    const byId = inventory?.properties?.byId || {};
    return Object.values(byId);
  }
);

export const selectFilteredProperties = createSelector(
  [selectProperties, selectFilters],
  (properties, filters) => {
    return properties.filter(property => {
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchableFields = [
          property.pNumber,
          property.project,
          property.area,
          property.cluster,
          property.status
        ].filter(Boolean).join(' ').toLowerCase();
        if (!searchableFields.includes(query)) return false;
      }
      
      if (filters.status && property.status !== filters.status) return false;
      if (filters.area && property.area !== filters.area) return false;
      if (filters.cluster && property.cluster !== filters.cluster) return false;
      
      return true;
    });
  }
);

export const selectInventoryStats = createSelector(
  [selectInventory, selectProperties],
  (inventory, properties) => {
    const apiStats = inventory?.stats || {};
    
    return {
      totalProperties: properties.length || apiStats.totalProperties || 0,
      availableProperties: properties.filter(p => p.status === 'Available').length || apiStats.available || 0,
      rentedProperties: properties.filter(p => p.status === 'Rented').length || apiStats.rented || 0,
      soldProperties: properties.filter(p => p.status === 'Sold').length || apiStats.sold || 0,
      reservedProperties: properties.filter(p => p.status === 'Reserved').length || apiStats.reserved || 0,
      totalOwners: inventory?.owners?.allIds?.length || apiStats.totalOwners || 0,
      ...apiStats
    };
  }
);

export const selectOwners = createSelector(
  [selectInventory],
  (inventory) => inventory?.owners || { byId: {}, allIds: [] }
);

export const selectFilterOptions = createSelector(
  [selectInventory],
  (inventory) => inventory?.manifest?.filterOptions || {}
);

export const selectActiveFiltersCount = createSelector(
  [selectFilters],
  (filters) => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === 'searchQuery') return value !== '';
      if (typeof value === 'boolean') return value === true;
      return value !== null;
    }).length;
  }
);

export default inventorySlice.reducer;
