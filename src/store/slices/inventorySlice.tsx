import { createSlice, createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit';

// JSON data loaded at runtime from public/ via fetch — never bundled into JS

interface InventoryData {
  properties: {
    byId: Record<string, any>;
    allIds: string[];
  };
  owners: {
    byId: Record<string, any>;
    allIds: string[];
  };
  ownerships: any;
  manifest: any;
}

interface InventoryFilters {
  cluster: string | null;
  status: string | null;
  area: string | null;
  layout: string | null;
  view: string | null;
  floor: string | null;
  rooms: string | null;
  masterProject: string | null;
  searchQuery: string;
  showMultiOwner: boolean;
  showMultiPhone: boolean;
  showMultiProperty: boolean;
}

interface InventoryState {
  properties: {
    byId: Record<string, any>;
    allIds: string[];
  };
  owners: {
    byId: Record<string, any>;
    allIds: string[];
  };
  ownerships: any;
  manifest: any;
  filters: InventoryFilters;
  selectedPropertyId: string | null;
  selectedOwnerId: string | null;
  loading: boolean;
  error: string | null;
}

export const loadInventoryData = createAsyncThunk<
  InventoryData,
  void,
  { rejectValue: string }
>(
  'inventory/loadData',
  async (_, { rejectWithValue }) => {
    try {
      // Fetch JSON data from public/ at runtime — zero bundle size impact
      const [propertiesData, ownersData, ownershipsData, manifestData] = await Promise.all([
        fetch('/data/damacHills2/properties.json').then(r => r.json()),
        fetch('/data/damacHills2/owners.json').then(r => r.json()),
        fetch('/data/damacHills2/ownerships.json').then(r => r.json()),
        fetch('/data/damacHills2/manifest.json').then(r => r.json())
      ]);

      const propertiesById: Record<string, any> = {};
      const propertyIds: string[] = [];
      propertiesData.forEach((p: any) => {
        propertiesById[p.pNumber] = p;
        propertyIds.push(p.pNumber);
      });
      
      const ownersById: Record<string, any> = {};
      const ownerIds: string[] = [];
      ownersData.forEach((o: any) => {
        ownersById[o.id] = o;
        ownerIds.push(o.id);
      });
      
      return {
        properties: { byId: propertiesById, allIds: propertyIds },
        owners: { byId: ownersById, allIds: ownerIds },
        ownerships: ownershipsData,
        manifest: manifestData
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load inventory data');
    }
  }
);

const initialState: InventoryState = {
  properties: { byId: {}, allIds: [] },
  owners: { byId: {}, allIds: [] },
  ownerships: { byPropertyId: {}, byOwnerId: {} },
  manifest: { sheets: [], clusters: [], stats: {}, filterOptions: {} },
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
  error: null
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<{ key: string; value: any }>) => {
      const { key, value } = action.payload;
      (state.filters as any)[key] = value;
    },
    clearFilters: (state) => {
      state.filters = {
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
      };
    },
    selectProperty: (state, action: PayloadAction<string>) => {
      state.selectedPropertyId = action.payload;
    },
    selectOwner: (state, action: PayloadAction<string>) => {
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
        state.error = action.payload || 'Unknown error';
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

const selectInventory = (state: any) => state.inventory;
const selectProperties = (state: any) => state.inventory.properties;
export const selectOwners = (state: any) => state.inventory.owners;
const selectOwnerships = (state: any) => state.inventory.ownerships;
export const selectFilters = (state: any) => state.inventory.filters;
const selectManifest = (state: any) => state.inventory.manifest;

export const selectAllProperties = createSelector(
  [selectProperties],
  (properties: any) => properties.allIds.map((id: string) => properties.byId[id])
);

export const selectAllOwners = createSelector(
  [selectOwners],
  (owners: any) => owners.allIds.map((id: string) => owners.byId[id])
);

export const selectMultiOwnerProperties = createSelector(
  [selectAllProperties],
  (properties: any[]) => properties.filter(p => p.owners && p.owners.length > 1)
);

export const selectOwnersWithMultipleProperties = createSelector(
  [selectAllOwners],
  (owners: any[]) => owners.filter(o => o.properties && o.properties.length > 1)
);

export const selectOwnersWithMultiplePhones = createSelector(
  [selectAllOwners],
  (owners: any[]) => owners.filter((o: any) => {
    const phones = o.contacts?.filter((c: any) => c.type === 'mobile' || c.type === 'phone') || [];
    return phones.length > 1;
  })
);

export const selectUniqueClusters = createSelector(
  [selectManifest],
  (manifest: any) => manifest.clusters || []
);

export const selectUniqueAreas = createSelector(
  [selectAllProperties],
  (properties: any[]) => [...new Set(properties.map(p => p.area).filter(Boolean))].sort()
);

export const selectUniqueStatuses = createSelector(
  [selectAllProperties],
  (properties: any[]) => [...new Set(properties.map(p => p.status).filter(Boolean))].sort()
);

export const selectFilterOptions = createSelector(
  [selectManifest],
  (manifest: any) => ({
    ...manifest.filterOptions,
    clusters: manifest.clusters || []
  })
);

export const selectActiveFiltersCount = createSelector(
  [selectFilters],
  (filters: any) => {
    const filterKeys = ['cluster', 'status', 'area', 'layout', 'view', 'floor', 'rooms', 'masterProject'];
    return filterKeys.filter(key => filters[key] !== null).length;
  }
);

export const selectFilteredProperties = createSelector(
  [selectAllProperties, selectFilters, selectOwners],
  (properties: any[], filters: any, owners: any) => {
    return properties.filter((property: any) => {
      if (filters.cluster && property.cluster !== filters.cluster) return false;
      if (filters.status && property.status !== filters.status) return false;
      if (filters.area && property.area !== filters.area) return false;
      if (filters.layout && property.layout !== filters.layout) return false;
      if (filters.view && property.view !== filters.view) return false;
      if (filters.floor && String(property.floor) !== filters.floor) return false;
      if (filters.rooms && String(property.rooms) !== filters.rooms) return false;
      if (filters.masterProject && property.masterProject !== filters.masterProject) return false;
      
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesPNumber = property.pNumber?.toLowerCase().includes(query);
        const matchesProject = property.project?.toLowerCase().includes(query);
        const matchesPlot = property.plotNumber?.toLowerCase().includes(query);
        const matchesOwnerName = property.owners?.some((oid: string) => {
          const owner = owners.byId[oid];
          return owner?.name?.toLowerCase().includes(query);
        });
        if (!matchesPNumber && !matchesProject && !matchesPlot && !matchesOwnerName) return false;
      }
      
      if (filters.showMultiOwner && (!property.owners || property.owners.length <= 1)) return false;
      
      if (filters.showMultiPhone) {
        const hasOwnerWithMultiPhone = property.owners?.some((oid: string) => {
          const owner = owners.byId[oid];
          if (!owner) return false;
          const phones = owner.contacts?.filter((c: any) => ['mobile', 'phone', 'secondaryMobile'].includes(c.type)) || [];
          return phones.length > 1;
        });
        if (!hasOwnerWithMultiPhone) return false;
      }
      
      if (filters.showMultiProperty) {
        const hasOwnerWithMultiProps = property.owners?.some((oid: string) => {
          const owner = owners.byId[oid];
          return owner?.properties?.length > 1;
        });
        if (!hasOwnerWithMultiProps) return false;
      }
      
      return true;
    });
  }
);

export const selectFilteredOwners = createSelector(
  [selectAllOwners, selectFilters],
  (owners: any[], filters: any) => {
    return owners.filter((owner: any) => {
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        if (!owner.name?.toLowerCase().includes(query)) return false;
      }
      
      if (filters.showMultiPhone) {
        const phones = owner.contacts?.filter((c: any) => c.type === 'mobile' || c.type === 'phone') || [];
        if (phones.length <= 1) return false;
      }
      
      if (filters.showMultiProperty) {
        if (!owner.properties || owner.properties.length <= 1) return false;
      }
      
      return true;
    });
  }
);

export const selectPropertyById = (propertyId: string) => createSelector(
  [selectProperties],
  (properties: any) => properties.byId[propertyId]
);

export const selectOwnerById = (ownerId: string) => createSelector(
  [selectOwners],
  (owners: any) => owners.byId[ownerId]
);

export const selectOwnersByPropertyId = (propertyId: string) => createSelector(
  [selectOwnerships, selectOwners],
  (ownerships: any, owners: any) => {
    const ownerIds = ownerships.byPropertyId[propertyId] || [];
    return ownerIds.map((id: string) => owners.byId[id]).filter(Boolean);
  }
);

export const selectPropertiesByOwnerId = (ownerId: string) => createSelector(
  [selectOwnerships, selectProperties],
  (ownerships: any, properties: any) => {
    const propertyIds = ownerships.byOwnerId[ownerId] || [];
    return propertyIds.map((id: string) => properties.byId[id]).filter(Boolean);
  }
);

export const selectInventoryStats = createSelector(
  [selectManifest],
  (manifest: any) => manifest.stats || {}
);

export const selectSheetsMeta = createSelector(
  [selectManifest],
  (manifest: any) => manifest.sheets || []
);

export default inventorySlice.reducer;
