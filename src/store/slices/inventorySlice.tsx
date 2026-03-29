import { createSlice, createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { logout } from '../authSlice';

// JSON data loaded at runtime from public/ via fetch — never bundled into JS

/** Property record from properties.json */
export interface InventoryProperty {
  pNumber: string;
  area?: string;
  status?: string;
  cluster?: string;
  layout?: string;
  view?: string;
  floor?: string | number;
  rooms?: string | number;
  masterProject?: string;
  project?: string;
  plotNumber?: string;
  owners?: string[];
  [key: string]: unknown;
}

/** Owner record from owners.json */
export interface InventoryOwner {
  id: string;
  name?: string;
  properties?: string[];
  contacts?: Array<{ type: string; value: string }>;
  [key: string]: unknown;
}

/** Ownerships mapping from ownerships.json */
export interface Ownerships {
  byPropertyId: Record<string, string[]>;
  byOwnerId: Record<string, string[]>;
}

/** Manifest metadata from manifest.json */
export interface InventoryManifest {
  sheets: string[];
  clusters: string[];
  stats: Record<string, unknown>;
  filterOptions: Record<string, unknown>;
}

interface InventoryData {
  properties: {
    byId: Record<string, InventoryProperty>;
    allIds: string[];
  };
  owners: {
    byId: Record<string, InventoryOwner>;
    allIds: string[];
  };
  ownerships: Ownerships;
  manifest: InventoryManifest;
}

export interface InventoryFilters {
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
    byId: Record<string, InventoryProperty>;
    allIds: string[];
  };
  owners: {
    byId: Record<string, InventoryOwner>;
    allIds: string[];
  };
  ownerships: Ownerships;
  manifest: InventoryManifest;
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
      const safeFetch = async (url: string): Promise<unknown> => {
        const r = await fetch(url);
        if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`);
        return r.json();
      };

      // Use Promise.allSettled for error isolation — partial failures don't kill the whole load
      const results = await Promise.allSettled([
        safeFetch('/data/damacHills2/properties.json'),
        safeFetch('/data/damacHills2/owners.json'),
        safeFetch('/data/damacHills2/ownerships.json'),
        safeFetch('/data/damacHills2/manifest.json')
      ]);

      // Check for any failures
      const failures = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected');
      if (failures.length > 0) {
        throw new Error(`Failed to load inventory: ${failures.map(f => f.reason?.message || 'Unknown error').join('; ')}`);
      }

      const [propertiesData, ownersData, ownershipsData, manifestData] = (results as PromiseFulfilledResult<unknown>[]).map(r => r.value);

      const propertiesById: Record<string, InventoryProperty> = {};
      const propertyIds: string[] = [];
      (propertiesData as InventoryProperty[]).forEach((p: InventoryProperty) => {
        propertiesById[p.pNumber] = p;
        propertyIds.push(p.pNumber);
      });
      
      const ownersById: Record<string, InventoryOwner> = {};
      const ownerIds: string[] = [];
      (ownersData as InventoryOwner[]).forEach((o: InventoryOwner) => {
        ownersById[o.id] = o;
        ownerIds.push(o.id);
      });
      
      return {
        properties: { byId: propertiesById, allIds: propertyIds },
        owners: { byId: ownersById, allIds: ownerIds },
        ownerships: ownershipsData as Ownerships,
        manifest: manifestData as InventoryManifest
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to load inventory data';
      return rejectWithValue(message);
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
    setFilter: (state, action: PayloadAction<{ key: keyof InventoryFilters; value: string | boolean | null }>) => {
      const { key, value } = action.payload;
      (state.filters[key] as string | boolean | null) = value;
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

    // --- SECURITY: Reset inventory data on logout ---
    builder.addCase(logout, () => initialState);
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

const selectInventory = (state: { inventory: InventoryState }) => state.inventory;
const selectProperties = (state: { inventory: InventoryState }) => state.inventory.properties;
export const selectOwners = (state: { inventory: InventoryState }) => state.inventory.owners;
const selectOwnerships = (state: { inventory: InventoryState }) => state.inventory.ownerships;
export const selectFilters = (state: { inventory: InventoryState }) => state.inventory.filters;
const selectManifest = (state: { inventory: InventoryState }) => state.inventory.manifest;

export const selectAllProperties = createSelector(
  [selectProperties],
  (properties) => properties.allIds.map((id: string) => properties.byId[id])
);

export const selectAllOwners = createSelector(
  [selectOwners],
  (owners) => owners.allIds.map((id: string) => owners.byId[id])
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
  (owners) => owners.filter((o) => {
    const phones = o.contacts?.filter((c) => c.type === 'mobile' || c.type === 'phone') || [];
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

export const selectFilterOptions = createSelector(
  [selectManifest],
  (manifest) => ({
    ...manifest.filterOptions,
    clusters: manifest.clusters || []
  })
);

export const selectActiveFiltersCount = createSelector(
  [selectFilters],
  (filters: InventoryFilters) => {
    const filterKeys: (keyof InventoryFilters)[] = ['cluster', 'status', 'area', 'layout', 'view', 'floor', 'rooms', 'masterProject'];
    return filterKeys.filter(key => filters[key] !== null).length;
  }
);

export const selectFilteredProperties = createSelector(
  [selectAllProperties, selectFilters, selectOwners],
  (properties: InventoryProperty[], filters: InventoryFilters, owners: { byId: Record<string, InventoryOwner>; allIds: string[] }) => {
    return properties.filter((property: InventoryProperty) => {
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
          const phones = owner.contacts?.filter((c) => ['mobile', 'phone', 'secondaryMobile'].includes(c.type)) || [];
          return phones.length > 1;
        });
        if (!hasOwnerWithMultiPhone) return false;
      }
      
      if (filters.showMultiProperty) {
        const hasOwnerWithMultiProps = property.owners?.some((oid: string) => {
          const owner = owners.byId[oid];
          return owner?.properties?.length && owner.properties.length > 1;
        });
        if (!hasOwnerWithMultiProps) return false;
      }
      
      return true;
    });
  }
);

export const selectFilteredOwners = createSelector(
  [selectAllOwners, selectFilters],
  (owners: InventoryOwner[], filters: InventoryFilters) => {
    return owners.filter((owner: InventoryOwner) => {
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        if (!owner.name?.toLowerCase().includes(query)) return false;
      }
      
      if (filters.showMultiPhone) {
        const phones = owner.contacts?.filter((c) => c.type === 'mobile' || c.type === 'phone') || [];
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
  (properties) => properties.byId[propertyId]
);

export const selectOwnerById = (ownerId: string) => createSelector(
  [selectOwners],
  (owners) => owners.byId[ownerId]
);

export const selectOwnersByPropertyId = (propertyId: string) => createSelector(
  [selectOwnerships, selectOwners],
  (ownerships, owners) => {
    const ownerIds = ownerships.byPropertyId[propertyId] || [];
    return ownerIds.map((id: string) => owners.byId[id]).filter(Boolean);
  }
);

export const selectPropertiesByOwnerId = (ownerId: string) => createSelector(
  [selectOwnerships, selectProperties],
  (ownerships, properties) => {
    const propertyIds = ownerships.byOwnerId[ownerId] || [];
    return propertyIds.map((id: string) => properties.byId[id]).filter(Boolean);
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
