import { configureStore } from '@reduxjs/toolkit';
import relationalSidebarSlice, {
  setSelectedDepartment,
  setSelectedService,
  setSelectedSubitem,
  addToSelectionHistory,
  clearSelectionHistory,
  setMainContentLoading,
  setMainContentError,
  selectSelectedDepartment,
  selectSelectedService,
  selectSelectedSubitem,
  selectSelectionHistory,
  selectMainContentLoading,
  selectMainContentError,
} from '../../redux/slices/relationalSidebarSlice';

/**
 * Redux State Management Tests
 * Tests for sidebar state management and selectors
 */

describe('relationalSidebarSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        relationalSidebar: relationalSidebarSlice,
      },
    });
  });

  describe('Department Selection', () => {
    test('should set selected department', () => {
      store.dispatch(setSelectedDepartment('EXECUTIVE'));
      const state = store.getState();
      expect(selectSelectedDepartment(state)).toBe('EXECUTIVE');
    });

    test('should update selected department on new selection', () => {
      store.dispatch(setSelectedDepartment('EXECUTIVE'));
      store.dispatch(setSelectedDepartment('SALES'));
      const state = store.getState();
      expect(selectSelectedDepartment(state)).toBe('SALES');
    });

    test('should reset service when department changes', () => {
      store.dispatch(setSelectedDepartment('EXECUTIVE'));
      store.dispatch(setSelectedService('strategic-overview'));
      store.dispatch(setSelectedDepartment('SALES'));
      const state = store.getState();
      expect(selectSelectedService(state)).toBeNull();
    });
  });

  describe('Service Selection', () => {
    test('should set selected service', () => {
      store.dispatch(setSelectedService('lead-pipeline'));
      const state = store.getState();
      expect(selectSelectedService(state)).toBe('lead-pipeline');
    });

    test('should update selected service', () => {
      store.dispatch(setSelectedService('lead-pipeline'));
      store.dispatch(setSelectedService('active-deals'));
      const state = store.getState();
      expect(selectSelectedService(state)).toBe('active-deals');
    });

    test('should reset subitem when service changes', () => {
      store.dispatch(setSelectedService('lead-pipeline'));
      store.dispatch(setSelectedSubitem('pipeline-board'));
      store.dispatch(setSelectedService('active-deals'));
      const state = store.getState();
      expect(selectSelectedSubitem(state)).toBeNull();
    });
  });

  describe('Subitem Selection', () => {
    test('should set selected subitem', () => {
      store.dispatch(setSelectedSubitem('kpi-dashboard'));
      const state = store.getState();
      expect(selectSelectedSubitem(state)).toBe('kpi-dashboard');
    });

    test('should update selected subitem', () => {
      store.dispatch(setSelectedSubitem('kpi-dashboard'));
      store.dispatch(setSelectedSubitem('announcements'));
      const state = store.getState();
      expect(selectSelectedSubitem(state)).toBe('announcements');
    });
  });

  describe('Selection History', () => {
    test('should add selection to history', () => {
      store.dispatch(setSelectedDepartment('EXECUTIVE'));
      store.dispatch(setSelectedService('strategic-overview'));
      store.dispatch(
        addToSelectionHistory({
          department: 'EXECUTIVE',
          service: 'strategic-overview',
        })
      );
      const state = store.getState();
      const history = selectSelectionHistory(state);
      expect(history.length).toBeGreaterThan(0);
    });

    test('should limit history to max 3 entries', () => {
      for (let i = 0; i < 5; i++) {
        store.dispatch(
          addToSelectionHistory({
            department: `DEPT_${i}`,
            service: `service_${i}`,
          })
        );
      }
      const state = store.getState();
      const history = selectSelectionHistory(state);
      expect(history.length).toBeLessThanOrEqual(3);
    });

    test('should clear history', () => {
      store.dispatch(
        addToSelectionHistory({
          department: 'EXECUTIVE',
          service: 'strategic-overview',
        })
      );
      store.dispatch(clearSelectionHistory());
      const state2 = store.getState();
      const history2 = selectSelectionHistory(state2);
      expect(history2.length).toBe(0);
    });
  });

  describe('Loading & Error States', () => {
    test('should set loading state', () => {
      store.dispatch(setMainContentLoading(true));
      let state = store.getState();
      expect(selectMainContentLoading(state)).toBe(true);

      store.dispatch(setMainContentLoading(false));
      state = store.getState();
      expect(selectMainContentLoading(state)).toBe(false);
    });

    test('should set error message', () => {
      const errorMsg = 'Failed to load data';
      store.dispatch(setMainContentError(errorMsg));
      let state = store.getState();
      expect(selectMainContentError(state)).toBe(errorMsg);

      store.dispatch(setMainContentError(null));
      state = store.getState();
      expect(selectMainContentError(state)).toBeNull();
    });

    test('should preserve error on new selection', () => {
      store.dispatch(setMainContentError('Previous error'));
      store.dispatch(setSelectedDepartment('SALES'));
      const state = store.getState();
      expect(selectMainContentError(state)).toBe('Previous error');
    });
  });

  describe('Selectors', () => {
    test('selectSelectedDepartment returns correct value', () => {
      store.dispatch(setSelectedDepartment('EXECUTIVE'));
      const state = store.getState();
      const dept = selectSelectedDepartment(state);
      expect(dept).toBe('EXECUTIVE');
    });

    test('selectSelectedService returns correct value', () => {
      store.dispatch(setSelectedService('lead-pipeline'));
      const state = store.getState();
      const service = selectSelectedService(state);
      expect(service).toBe('lead-pipeline');
    });

    test('selectSelectedSubitem returns correct value', () => {
      store.dispatch(setSelectedSubitem('pipeline-board'));
      const state = store.getState();
      const subitem = selectSelectedSubitem(state);
      expect(subitem).toBe('pipeline-board');
    });
  });
});
