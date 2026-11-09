import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface DashboardDrawerState {
  drawer: string | null;
  selectedId: string | null;
  mode: 'create' | 'edit' | 'view' | null;
}

export interface UseDashboardQueryStateReturn {
  drawerState: DashboardDrawerState;
  openDrawer: (drawerName: string, id?: string | null, mode?: 'create' | 'edit' | 'view') => void;
  closeDrawer: () => void;
  setSearchParam: (key: string, value: string | null) => void;
}

/**
 * useDashboardQueryState
 * Deep URL query param synchronization for dashboard drawers, edit modes, and active record IDs.
 * Ensures the browser's Back/Forward buttons smoothly step in and out of active drawers,
 * and preserves exact state on page reload or bookmarking.
 */
export function useDashboardQueryState(): UseDashboardQueryStateReturn {
  const [searchParams, setSearchParams] = useSearchParams();

  const drawerState = useMemo<DashboardDrawerState>(() => {
    return {
      drawer: searchParams.get('drawer'),
      selectedId: searchParams.get('id') || searchParams.get('selectedId'),
      mode: (searchParams.get('mode') as 'create' | 'edit' | 'view') || null,
    };
  }, [searchParams]);

  const openDrawer = useCallback(
    (drawerName: string, id: string | null = null, mode: 'create' | 'edit' | 'view' = 'edit') => {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        next.set('drawer', drawerName);
        if (id) {
          next.set('id', id);
        } else {
          next.delete('id');
        }
        next.set('mode', mode);
        return next;
      });
    },
    [setSearchParams]
  );

  const closeDrawer = useCallback(() => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.delete('drawer');
      next.delete('id');
      next.delete('selectedId');
      if (next.get('mode') !== 'view' && next.get('mode') !== 'execution') {
        next.delete('mode');
      }
      return next;
    });
  }, [setSearchParams]);

  const setSearchParam = useCallback(
    (key: string, value: string | null) => {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        if (value === null || value === '') {
          next.delete(key);
        } else {
          next.set(key, value);
        }
        return next;
      });
    },
    [setSearchParams]
  );

  return {
    drawerState,
    openDrawer,
    closeDrawer,
    setSearchParam,
  };
}
