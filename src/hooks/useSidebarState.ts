// src/hooks/useSidebarState.ts
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
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
  selectActiveSidebarItem,
  selectSearchQuery,
  selectFavorites,
  selectIsCollapsed,
  selectViewMode,
  selectFilters,
  selectCurrentPage,
  selectSidebarConfig,
} from '../store/slices/sidebarUISlice';

/**
 * Hook for managing sidebar state
 * @param sidebarName - Name of the sidebar ('left' or 'right')
 */
export const useSidebarState = (sidebarName: string) => {
  const dispatch = useDispatch();

  // Selectors
  const config = useSelector(selectSidebarConfig(sidebarName));
  const activeSidebarItem = useSelector(selectActiveSidebarItem(sidebarName));
  const searchQuery = useSelector(selectSearchQuery(sidebarName));
  const favorites = useSelector(selectFavorites(sidebarName));
  const isCollapsed = useSelector(selectIsCollapsed(sidebarName));
  const viewMode = useSelector(selectViewMode(sidebarName));
  const filters = useSelector(selectFilters(sidebarName));
  const currentPage = useSelector(selectCurrentPage(sidebarName));

  // Item Management
  const setActive = useCallback(
    (itemId: string) => {
      dispatch(setActiveSidebarItem({ sidebar: sidebarName, itemId }));
    },
    [dispatch, sidebarName]
  );

  // Search Management
  const setSearch = useCallback(
    (query: string) => {
      dispatch(setSearchQuery({ sidebar: sidebarName, query }));
    },
    [dispatch, sidebarName]
  );

  const clearSearch = useCallback(() => {
    dispatch(clearSearchQuery(sidebarName));
  }, [dispatch, sidebarName]);

  // Section Management
  const toggleExpanded = useCallback(
    (sectionId: string) => {
      dispatch(toggleSection({ sidebar: sidebarName, sectionId }));
    },
    [dispatch, sidebarName]
  );

  const isExpanded = useCallback(
    (sectionId: string) => config.expandedSections.has(sectionId),
    [config.expandedSections]
  );

  // Favorites Management
  const toggleFav = useCallback(
    (itemId: string) => {
      dispatch(toggleFavorite({ sidebar: sidebarName, itemId }));
    },
    [dispatch, sidebarName]
  );

  const addFav = useCallback(
    (itemId: string) => {
      dispatch(addFavorite({ sidebar: sidebarName, itemId }));
    },
    [dispatch, sidebarName]
  );

  const removeFav = useCallback(
    (itemId: string) => {
      dispatch(removeFavorite({ sidebar: sidebarName, itemId }));
    },
    [dispatch, sidebarName]
  );

  const isFavorited = useCallback(
    (itemId: string) => favorites.has(itemId),
    [favorites]
  );

  // Collapse Management
  const toggleCollapse = useCallback(() => {
    dispatch(toggleCollapseSidebar(sidebarName));
  }, [dispatch, sidebarName]);

  const setCollapsed = useCallback(
    (collapsed: boolean) => {
      dispatch(setCollapsedState({ sidebar: sidebarName, isCollapsed: collapsed }));
    },
    [dispatch, sidebarName]
  );

  // Mobile Management
  const setMobileOpen = useCallback(
    (isOpen: boolean) => {
      dispatch(setMobileSidebarOpen({ sidebar: sidebarName, isOpen }));
    },
    [dispatch, sidebarName]
  );

  // View Mode Management
  const setView = useCallback(
    (mode: 'grid' | 'list' | 'table' | 'map' | 'timeline') => {
      dispatch(setViewMode({ sidebar: sidebarName, viewMode: mode }));
    },
    [dispatch, sidebarName]
  );

  // Sorting
  const setSort = useCallback(
    (sortBy: string) => {
      dispatch(setSortBy({ sidebar: sidebarName, sortBy }));
    },
    [dispatch, sidebarName]
  );

  // Pagination
  const setPage = useCallback(
    (page: number) => {
      dispatch(setCurrentPage({ sidebar: sidebarName, page }));
    },
    [dispatch, sidebarName]
  );

  const setPageSize = useCallback(
    (itemsPerPage: number) => {
      dispatch(setItemsPerPage({ sidebar: sidebarName, itemsPerPage }));
    },
    [dispatch, sidebarName]
  );

  // Filters
  const addFilter = useCallback(
    (filterKey: string, filterValue: any) => {
      dispatch(setFilter({ sidebar: sidebarName, filterKey, filterValue }));
    },
    [dispatch, sidebarName]
  );

  const removeFilterKey = useCallback(
    (filterKey: string) => {
      dispatch(removeFilter({ sidebar: sidebarName, filterKey }));
    },
    [dispatch, sidebarName]
  );

  const clearAllFilters = useCallback(() => {
    dispatch(clearFilters(sidebarName));
  }, [dispatch, sidebarName]);

  // Reset
  const reset = useCallback(() => {
    dispatch(resetSidebar(sidebarName));
  }, [dispatch, sidebarName]);

  return {
    // State
    config,
    activeSidebarItem,
    searchQuery,
    favorites,
    isCollapsed,
    viewMode,
    filters,
    currentPage,
    isMobileOpen: config.isMobileOpen,
    sortBy: config.sortBy,
    itemsPerPage: config.itemsPerPage,

    // Item management
    setActive,

    // Search management
    setSearch,
    clearSearch,

    // Section management
    toggleExpanded,
    isExpanded,

    // Favorites management
    toggleFav,
    addFav,
    removeFav,
    isFavorited,

    // Collapse management
    toggleCollapse,
    setCollapsed,

    // Mobile management
    setMobileOpen,

    // View mode management
    setView,

    // Sorting
    setSort,

    // Pagination
    setPage,
    setPageSize,

    // Filters
    addFilter,
    removeFilterKey,
    clearAllFilters,

    // Reset
    reset,
  };
};

/**
 * Hook for filtering and sorting items in a sidebar
 */
export const useSidebarFiltering = (
  items: any[],
  sidebarName: string,
  filterFn?: (item: any, filters: Record<string, any>, search: string) => boolean
) => {
  const { searchQuery, filters, sortBy } = useSidebarState(sidebarName);

  const filtered = useMemo(() => {
    let result = items;

    // Search filter
    if (searchQuery) {
      result = result.filter(item =>
        JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Custom filter function
    if (filterFn) {
      result = result.filter(item => filterFn(item, filters, searchQuery));
    }

    // Sort
    if (sortBy === 'a-z') {
      result.sort((a, b) => {
        const aStr = (a.name || a.label || '').toString();
        const bStr = (b.name || b.label || '').toString();
        return aStr.localeCompare(bStr);
      });
    } else if (sortBy === 'z-a') {
      result.sort((a, b) => {
        const aStr = (a.name || a.label || '').toString();
        const bStr = (b.name || b.label || '').toString();
        return bStr.localeCompare(aStr);
      });
    } else if (sortBy === 'newest') {
      result.sort((a, b) => {
        const aDate = new Date(a.createdAt || a.date || 0).getTime();
        const bDate = new Date(b.createdAt || b.date || 0).getTime();
        return bDate - aDate;
      });
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => {
        const aDate = new Date(a.createdAt || a.date || 0).getTime();
        const bDate = new Date(b.createdAt || b.date || 0).getTime();
        return aDate - bDate;
      });
    }

    return result;
  }, [items, searchQuery, filters, sortBy, filterFn]);

  return filtered;
};

/**
 * Hook for sidebar pagination
 */
export const useSidebarPagination = (
  items: any[],
  sidebarName: string
) => {
  const { currentPage, itemsPerPage, setPage, setPageSize } =
    useSidebarState(sidebarName);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    paginatedItems,
    currentPage,
    totalPages,
    itemsPerPage,
    setPage,
    setPageSize,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};
