import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

import propertiesData from '../../data/damacHills2/properties.json';
import ownersData from '../../data/damacHills2/owners.json';
import ownershipsData from '../../data/damacHills2/ownerships.json';
import manifestData from '../../data/damacHills2/manifest.json';

export const loadInventoryData = createAsyncThunk(
  'inventory/loadData',
  async () => {
    const propertiesById = {};
    const propertyIds = [];
    propertiesData.forEach(p => {
      propertiesById[p.pNumber] = p;
      propertyIds.push(p.pNumber);
    });
    
    const ownersById = {};
    const ownerIds = [];
    ownersData.forEach(o => {
      ownersById[o.id] = o;
      ownerIds.push(o.id);
    });
    
    return {
      properties: { byId: propertiesById, allIds: propertyIds },
      owners: { byId: ownersById, allIds: ownerIds },
      ownerships: ownershipsData,
      manifest: manifestData
    };
  }
);

const initialState = {
  properties: { byId: {}, allIds: [] },
  owners: { byId: {}, allIds: [] },
  ownerships: { byPropertyId: {}, byOwnerId: {} },
  manifest: { sheets: [], clusters: [], stats: {} },
  filters: {
    cluster: 'all',
    status: 'all',
    area: 'all',
    searchQuery: '',
    showMultiOwner: false,
    showMultiPhone: false,
    showMultiProperty: false
  },
  selectedPropertyId: null,
  selectedOwnerId: null,
  loading: false,
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
        state.owners = action.payload.owners;
        state.ownerships = action.payload.ownerships;
        state.manifest = action.payload.manifest;
      })
      .addCase(loadInventoryData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
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

const selectInventory = (state) => state.inventory;
const selectProperties = (state) => state.inventory.properties;
export const selectOwners = (state) => state.inventory.owners;
const selectOwnerships = (state) => state.inventory.ownerships;
export const selectFilters = (state) => state.inventory.filters;
const selectManifest = (state) => state.inventory.manifest;

export const selectAllProperties = createSelector(
  [selectProperties],
  (properties) => properties.allIds.map(id => properties.byId[id])
);

export const selectAllOwners = createSelector(
  [selectOwners],
  (owners) => owners.allIds.map(id => owners.byId[id])
);

export const selectMultiOwnerProperties = createSelector(
  [selectAllProperties],
  (properties) => properties.filter(p => p.owners && p.owners.length > 1)
);

export const selectOwnersWithMultipleProperties = createSelector(
  [selectAllOwners],
  (owners) => owners.filter(o => o.properties && o.properties.length > 1)
);

export const selectOwnersWithMultiplePhones = createSelector(
  [selectAllOwners],
  (owners) => owners.filter(o => {
    const phones = o.contacts?.filter(c => c.type === 'mobile' || c.type === 'phone') || [];
    return phones.length > 1;
  })
);

export const selectUniqueClusters = createSelector(
  [selectManifest],
  (manifest) => manifest.clusters || []
);

export const selectUniqueAreas = createSelector(
  [selectAllProperties],
  (properties) => [...new Set(properties.map(p => p.area).filter(Boolean))].sort()
);

export const selectUniqueStatuses = createSelector(
  [selectAllProperties],
  (properties) => [...new Set(properties.map(p => p.status).filter(Boolean))].sort()
);

export const selectFilteredProperties = createSelector(
  [selectAllProperties, selectFilters, selectOwners],
  (properties, filters, owners) => {
    return properties.filter(property => {
      if (filters.cluster !== 'all' && property.cluster !== filters.cluster) return false;
      if (filters.status !== 'all' && property.status !== filters.status) return false;
      if (filters.area !== 'all' && property.area !== filters.area) return false;
      
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesPNumber = property.pNumber?.toLowerCase().includes(query);
        const matchesProject = property.project?.toLowerCase().includes(query);
        const matchesOwnerName = property.owners?.some(oid => {
          const owner = owners.byId[oid];
          return owner?.name?.toLowerCase().includes(query);
        });
        if (!matchesPNumber && !matchesProject && !matchesOwnerName) return false;
      }
      
      if (filters.showMultiOwner && (!property.owners || property.owners.length <= 1)) return false;
      
      return true;
    });
  }
);

export const selectFilteredOwners = createSelector(
  [selectAllOwners, selectFilters],
  (owners, filters) => {
    return owners.filter(owner => {
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        if (!owner.name?.toLowerCase().includes(query)) return false;
      }
      
      if (filters.showMultiPhone) {
        const phones = owner.contacts?.filter(c => c.type === 'mobile' || c.type === 'phone') || [];
        if (phones.length <= 1) return false;
      }
      
      if (filters.showMultiProperty) {
        if (!owner.properties || owner.properties.length <= 1) return false;
      }
      
      return true;
    });
  }
);

export const selectPropertyById = (propertyId) => createSelector(
  [selectProperties],
  (properties) => properties.byId[propertyId]
);

export const selectOwnerById = (ownerId) => createSelector(
  [selectOwners],
  (owners) => owners.byId[ownerId]
);

export const selectOwnersByPropertyId = (propertyId) => createSelector(
  [selectOwnerships, selectOwners],
  (ownerships, owners) => {
    const ownerIds = ownerships.byPropertyId[propertyId] || [];
    return ownerIds.map(id => owners.byId[id]).filter(Boolean);
  }
);

export const selectPropertiesByOwnerId = (ownerId) => createSelector(
  [selectOwnerships, selectProperties],
  (ownerships, properties) => {
    const propertyIds = ownerships.byOwnerId[ownerId] || [];
    return propertyIds.map(id => properties.byId[id]).filter(Boolean);
  }
);

export const selectInventoryStats = createSelector(
  [selectManifest],
  (manifest) => manifest.stats || {}
);

export const selectSheetsMeta = createSelector(
  [selectManifest],
  (manifest) => manifest.sheets || []
);

export default inventorySlice.reducer;
