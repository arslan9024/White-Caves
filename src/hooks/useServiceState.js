import { useDispatch, useSelector } from 'react-redux';
import { 
  cacheServiceState, 
  restoreServiceState,
  selectCurrentServiceCache,
  selectSelectedDepartment,
  selectSelectedService,
} from '../redux/slices/relationalSidebarSlice';

/**
 * useServiceState Hook
 * Manages state persistence for filters and scroll position across service navigation
 * 
 * Usage:
 * const { cacheState, restoreState, getState } = useServiceState();
 * 
 * // When user changes filters
 * cacheState({ filters: { status: 'active' }, scrollPos: 100 });
 * 
 * // When returning to service
 * const prevState = restoreState();
 */

export const useServiceState = () => {
  const dispatch = useDispatch();
  const dept = useSelector(selectSelectedDepartment);
  const service = useSelector(selectSelectedService);
  const currentCache = useSelector(selectCurrentServiceCache);

  // Cache current state for later restoration
  const cacheState = (state) => {
    if (!dept || !service) return;
    dispatch(cacheServiceState({
      dept,
      service,
      filters: state?.filters || {},
      scrollPos: state?.scrollPos || 0,
    }));
  };

  // Get cached state for restoration
  const getState = () => {
    return currentCache || { filters: {}, scrollPos: 0 };
  };

  // Restore state (simplified - actual restoration handled in component)
  const restoreState = () => {
    return getState();
  };

  return {
    cacheState,
    restoreState,
    getState,
    currentCache,
  };
};

export default useServiceState;
