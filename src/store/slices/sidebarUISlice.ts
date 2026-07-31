// src/store/slices/sidebarUISlice.ts
import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';

interface SidebarState {
  [sidebarName: string]: {
    activeSidebarItem: string | null;
    searchQuery: string;
    expandedSections: Set<string>;
    favorites: Set<string>;
    isCollapsed: boolean;
    isMobileOpen: boolean;
    viewMode: 'grid' | 'list' | 'table' | 'map' | 'timeline';
    sortBy: string;
    currentPage: number;
    itemsPerPage: number;
    filters: Record<string, any>;
  };
}

const initialSidebarState = {
  activeSidebarItem: null,
  searchQuery: '',
  expandedSections: new Set<string>(),
  favorites: new Set<string>(),
  isCollapsed: false,
  isMobileOpen: false,
  viewMode: 'grid' as const,
  sortBy: 'newest',
  currentPage: 1,
  itemsPerPage: 12,
  filters: {},
};

const initialState: SidebarState = {
  left: { ...initialSidebarState },
  right: { ...initialSidebarState },
};

const sidebarUISlice = createSlice({
  name: 'sidebarUI',
  initialState,
  reducers: {
    // Active Item Management
    setActiveSidebarItem: (
      state,
      action: PayloadAction<{ sidebar: string; itemId: string }>
    ) => {
      const { sidebar, itemId } = action.payload;
      if (state[sidebar]) {
        state[sidebar].activeSidebarItem = itemId;
        state[sidebar].currentPage = 1; // Reset to first page
      }
    },

    // Search Query
    setSearchQuery: (
      state,
      action: PayloadAction<{ sidebar: string; query: string }>
    ) => {
      const { sidebar, query } = action.payload;
      if (state[sidebar]) {
        state[sidebar].searchQuery = query;
        state[sidebar].currentPage = 1;
      }
    },

    clearSearchQuery: (state, action: PayloadAction<string>) => {
      if (state[action.payload]) {
        state[action.payload].searchQuery = '';
      }
    },

    // Section Expand/Collapse
    toggleSection: (
      state,
      action: PayloadAction<{ sidebar: string; sectionId: string }>
    ) => {
      const { sidebar, sectionId } = action.payload;
      if (state[sidebar]) {
        const sections = new Set(state[sidebar].expandedSections);
        if (sections.has(sectionId)) {
          sections.delete(sectionId);
        } else {
          sections.add(sectionId);
        }
        state[sidebar].expandedSections = sections;
      }
    },

    // Favorites Management
    toggleFavorite: (
      state,
      action: PayloadAction<{ sidebar: string; itemId: string }>
    ) => {
      const { sidebar, itemId } = action.payload;
      if (state[sidebar]) {
        const favorites = new Set(state[sidebar].favorites);
        if (favorites.has(itemId)) {
          favorites.delete(itemId);
        } else {
          favorites.add(itemId);
        }
        state[sidebar].favorites = favorites;
      }
    },

    addFavorite: (
      state,
      action: PayloadAction<{ sidebar: string; itemId: string }>
    ) => {
      const { sidebar, itemId } = action.payload;
      if (state[sidebar]) {
        state[sidebar].favorites.add(itemId);
      }
    },

    removeFavorite: (
      state,
      action: PayloadAction<{ sidebar: string; itemId: string }>
    ) => {
      const { sidebar, itemId } = action.payload;
      if (state[sidebar]) {
        state[sidebar].favorites.delete(itemId);
      }
    },

    // Collapse/Expand
    toggleCollapseSidebar: (state, action: PayloadAction<string>) => {
      if (state[action.payload]) {
        state[action.payload].isCollapsed = !state[action.payload].isCollapsed;
      }
    },

    setCollapsedState: (
      state,
      action: PayloadAction<{ sidebar: string; isCollapsed: boolean }>
    ) => {
      const { sidebar, isCollapsed } = action.payload;
      if (state[sidebar]) {
        state[sidebar].isCollapsed = isCollapsed;
      }
    },

    // Mobile Sidebar
    setMobileSidebarOpen: (
      state,
      action: PayloadAction<{ sidebar: string; isOpen: boolean }>
    ) => {
      const { sidebar, isOpen } = action.payload;
      if (state[sidebar]) {
        state[sidebar].isMobileOpen = isOpen;
      }
    },

    // View Mode
    setViewMode: (
      state,
      action: PayloadAction<{
        sidebar: string;
        viewMode: 'grid' | 'list' | 'table' | 'map' | 'timeline';
      }>
    ) => {
      const { sidebar, viewMode } = action.payload;
      if (state[sidebar]) {
        state[sidebar].viewMode = viewMode;
      }
    },

    // Sorting
    setSortBy: (
      state,
      action: PayloadAction<{ sidebar: string; sortBy: string }>
    ) => {
      const { sidebar, sortBy } = action.payload;
      if (state[sidebar]) {
        state[sidebar].sortBy = sortBy;
      }
    },

    // Pagination
    setCurrentPage: (
      state,
      action: PayloadAction<{ sidebar: string; page: number }>
    ) => {
      const { sidebar, page } = action.payload;
      if (state[sidebar]) {
        state[sidebar].currentPage = page;
      }
    },

    setItemsPerPage: (
      state,
      action: PayloadAction<{ sidebar: string; itemsPerPage: number }>
    ) => {
      const { sidebar, itemsPerPage } = action.payload;
      if (state[sidebar]) {
        state[sidebar].itemsPerPage = itemsPerPage;
      }
    },

    // Filters
    setFilter: (
      state,
      action: PayloadAction<{
        sidebar: string;
        filterKey: string;
        filterValue: unknown;
      }>
    ) => {
      const { sidebar, filterKey, filterValue } = action.payload;
      if (state[sidebar]) {
        state[sidebar].filters[filterKey] = filterValue;
        state[sidebar].currentPage = 1;
      }
    },

    removeFilter: (
      state,
      action: PayloadAction<{ sidebar: string; filterKey: string }>
    ) => {
      const { sidebar, filterKey } = action.payload;
      if (state[sidebar]) {
        delete state[sidebar].filters[filterKey];
      }
    },

    clearFilters: (state, action: PayloadAction<string>) => {
      if (state[action.payload]) {
        state[action.payload].filters = {};
      }
    },

    // Reset Everything
    resetSidebar: (state, action: PayloadAction<string>) => {
      const sidebar = action.payload;
      state[sidebar] = { ...initialSidebarState };
    },
  },
});

export const {
  setActiveSidebarItem,
  setSearchQuery,
  clearSearchQuery,
  toggleSection,
  toggleFavorite,
  addFavorite,
  removeFavorite,
  toggleCollapseSidebar,
  setCollapsedState,
  setMobileSidebarOpen,
  setViewMode,
  setSortBy,
  setCurrentPage,
  setItemsPerPage,
  setFilter,
  removeFilter,
  clearFilters,
  resetSidebar,
} = sidebarUISlice.actions;

// Selectors
const selectSidebarState = (state: { sidebarUI?: SidebarState }) => state.sidebarUI || initialState;

export const selectSidebarConfig = (sidebarName: string) =>
  createSelector(
    [selectSidebarState],
    state => state[sidebarName] || initialSidebarState
  );

export const selectActiveSidebarItem = (sidebarName: string) =>
  createSelector(
    [selectSidebarConfig(sidebarName)],
    config => config.activeSidebarItem
  );

export const selectSearchQuery = (sidebarName: string) =>
  createSelector(
    [selectSidebarConfig(sidebarName)],
    config => config.searchQuery
  );

export const selectFavorites = (sidebarName: string) =>
  createSelector([selectSidebarConfig(sidebarName)], config => config.favorites);

export const selectIsCollapsed = (sidebarName: string) =>
  createSelector(
    [selectSidebarConfig(sidebarName)],
    config => config.isCollapsed
  );

export const selectViewMode = (sidebarName: string) =>
  createSelector(
    [selectSidebarConfig(sidebarName)],
    config => config.viewMode
  );

export const selectFilters = (sidebarName: string) =>
  createSelector(
    [selectSidebarConfig(sidebarName)],
    config => config.filters
  );

export const selectCurrentPage = (sidebarName: string) =>
  createSelector(
    [selectSidebarConfig(sidebarName)],
    config => config.currentPage
  );

export default sidebarUISlice.reducer;
