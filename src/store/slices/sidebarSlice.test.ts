import { describe, it, expect } from 'vitest';
import reducer, {
  toggleLeftSidebar,
  toggleRightSidebar,
  setLeftCollapsed,
  setRightCollapsed,
  selectAssistant,
  setShowRightDrawer,
  toggleShowRightDrawer,
  clearSelectedAssistant,
  selectDepartment,
  selectService,
  clearDepartmentSelection,
  selectLeftCollapsed,
  selectRightCollapsed,
  selectSelectedAssistant,
  selectShowRightDrawer,
  selectSelectedDepartment,
} from './sidebarSlice';
import { logout } from '../authSlice';

// ─── Helpers ───────────────────────────────────────────────────────
const initialState = () => reducer(undefined, { type: '@@INIT' });
type SidebarState = ReturnType<typeof initialState>;
const rootWith = (overrides: Partial<SidebarState> = {}) =>
  ({ sidebar: { ...initialState(), ...overrides } });

// ─── Initial state ────────────────────────────────────────────────
describe('sidebarSlice', () => {
  describe('initial state', () => {
    it('starts with both sidebars collapsed', () => {
      const state = initialState();
      expect(state.leftCollapsed).toBe(true);
      expect(state.rightCollapsed).toBe(true);
    });

    it('starts with no selections', () => {
      const state = initialState();
      expect(state.selectedAssistant).toBeNull();
      expect(state.selectedDepartment).toBeNull();
      expect(state.selectedService).toBeNull();
    });

    it('starts with right drawer hidden', () => {
      expect(initialState().showRightDrawer).toBe(false);
    });
  });

  // ─── Left sidebar ──────────────────────────────────────────────
  describe('left sidebar', () => {
    it('toggleLeftSidebar flips collapsed state', () => {
      let state = initialState();
      expect(state.leftCollapsed).toBe(true);

      state = reducer(state, toggleLeftSidebar());
      expect(state.leftCollapsed).toBe(false);

      state = reducer(state, toggleLeftSidebar());
      expect(state.leftCollapsed).toBe(true);
    });

    it('setLeftCollapsed sets explicit value', () => {
      const state = reducer(initialState(), setLeftCollapsed(false));
      expect(state.leftCollapsed).toBe(false);
    });

    it('setLeftCollapsed does not affect right sidebar', () => {
      const state = reducer(initialState(), setLeftCollapsed(false));
      expect(state.rightCollapsed).toBe(true);
    });
  });

  // ─── Right sidebar ─────────────────────────────────────────────
  describe('right sidebar', () => {
    it('toggleRightSidebar flips collapsed state', () => {
      let state = initialState();
      state = reducer(state, toggleRightSidebar());
      expect(state.rightCollapsed).toBe(false);

      state = reducer(state, toggleRightSidebar());
      expect(state.rightCollapsed).toBe(true);
    });

    it('setRightCollapsed sets explicit value', () => {
      const state = reducer(initialState(), setRightCollapsed(false));
      expect(state.rightCollapsed).toBe(false);
    });

    it('setRightCollapsed does not affect left sidebar', () => {
      const state = reducer(initialState(), setRightCollapsed(false));
      expect(state.leftCollapsed).toBe(true);
    });
  });

  // ─── Right drawer ──────────────────────────────────────────────
  describe('right drawer', () => {
    it('setShowRightDrawer sets value', () => {
      const state = reducer(initialState(), setShowRightDrawer(true));
      expect(state.showRightDrawer).toBe(true);
    });

    it('toggleShowRightDrawer flips value', () => {
      let state = initialState();
      state = reducer(state, toggleShowRightDrawer());
      expect(state.showRightDrawer).toBe(true);

      state = reducer(state, toggleShowRightDrawer());
      expect(state.showRightDrawer).toBe(false);
    });
  });

  // ─── Assistant selection ────────────────────────────────────────
  describe('assistant selection', () => {
    it('selectAssistant sets selectedAssistant', () => {
      const state = reducer(initialState(), selectAssistant('nadia'));
      expect(state.selectedAssistant).toBe('nadia');
    });

    it('selectAssistant can set to null', () => {
      let state = reducer(initialState(), selectAssistant('nadia'));
      state = reducer(state, selectAssistant(null));
      expect(state.selectedAssistant).toBeNull();
    });

    it('clearSelectedAssistant clears selection', () => {
      let state = reducer(initialState(), selectAssistant('nadia'));
      state = reducer(state, clearSelectedAssistant());
      expect(state.selectedAssistant).toBeNull();
    });

    it('replaces previous assistant', () => {
      let state = reducer(initialState(), selectAssistant('nadia'));
      state = reducer(state, selectAssistant('olivia'));
      expect(state.selectedAssistant).toBe('olivia');
    });
  });

  // ─── Department / Service selection ─────────────────────────────
  describe('department & service selection', () => {
    it('selectDepartment sets department', () => {
      const state = reducer(initialState(), selectDepartment('sales'));
      expect(state.selectedDepartment).toBe('sales');
    });

    it('selectDepartment can set to null', () => {
      let state = reducer(initialState(), selectDepartment('sales'));
      state = reducer(state, selectDepartment(null));
      expect(state.selectedDepartment).toBeNull();
    });

    it('selectService sets both department and service', () => {
      const state = reducer(
        initialState(),
        selectService({ department: 'sales', service: 'property-listing' })
      );
      expect(state.selectedDepartment).toBe('sales');
      expect(state.selectedService).toBe('property-listing');
    });

    it('clearDepartmentSelection clears both department and service', () => {
      let state = reducer(
        initialState(),
        selectService({ department: 'sales', service: 'property-listing' })
      );
      state = reducer(state, clearDepartmentSelection());
      expect(state.selectedDepartment).toBeNull();
      expect(state.selectedService).toBeNull();
    });

    it('selectDepartment does not clear service', () => {
      let state = reducer(
        initialState(),
        selectService({ department: 'sales', service: 'listing' })
      );
      state = reducer(state, selectDepartment('marketing'));
      expect(state.selectedDepartment).toBe('marketing');
      expect(state.selectedService).toBe('listing'); // unchanged
    });
  });

  // ─── logout (extraReducer) ─────────────────────────────────────
  describe('logout (extraReducer)', () => {
    it('resets to initial state on logout', () => {
      let state = initialState();
      state = reducer(state, setLeftCollapsed(false));
      state = reducer(state, selectAssistant('nadia'));
      state = reducer(state, selectDepartment('sales'));
      state = reducer(state, setShowRightDrawer(true));

      state = reducer(state, logout());
      expect(state).toEqual(initialState());
    });
  });

  // ─── Selectors ─────────────────────────────────────────────────
  describe('selectors', () => {
    it('selectLeftCollapsed', () => {
      expect(selectLeftCollapsed(rootWith())).toBe(true);
      expect(selectLeftCollapsed(rootWith({ leftCollapsed: false }))).toBe(false);
    });

    it('selectRightCollapsed', () => {
      expect(selectRightCollapsed(rootWith())).toBe(true);
      expect(selectRightCollapsed(rootWith({ rightCollapsed: false }))).toBe(false);
    });

    it('selectSelectedAssistant', () => {
      expect(selectSelectedAssistant(rootWith())).toBeNull();
      expect(selectSelectedAssistant(rootWith({ selectedAssistant: 'nadia' }))).toBe('nadia');
    });

    it('selectShowRightDrawer', () => {
      expect(selectShowRightDrawer(rootWith())).toBe(false);
      expect(selectShowRightDrawer(rootWith({ showRightDrawer: true }))).toBe(true);
    });

    it('selectSelectedDepartment', () => {
      expect(selectSelectedDepartment(rootWith())).toBeNull();
      expect(selectSelectedDepartment(rootWith({ selectedDepartment: 'sales' }))).toBe('sales');
    });
  });

  // ─── Action sequences ──────────────────────────────────────────
  describe('action sequences', () => {
    it('open left → select department → select service → close', () => {
      let state = initialState();
      state = reducer(state, setLeftCollapsed(false));
      state = reducer(state, selectDepartment('sales'));
      state = reducer(state, selectService({ department: 'sales', service: 'listings' }));
      expect(state.selectedDepartment).toBe('sales');
      expect(state.selectedService).toBe('listings');

      state = reducer(state, clearDepartmentSelection());
      state = reducer(state, setLeftCollapsed(true));
      expect(state.leftCollapsed).toBe(true);
      expect(state.selectedDepartment).toBeNull();
    });

    it('open right → select assistant → clear → close', () => {
      let state = initialState();
      state = reducer(state, setRightCollapsed(false));
      state = reducer(state, selectAssistant('nadia'));
      expect(state.selectedAssistant).toBe('nadia');

      state = reducer(state, clearSelectedAssistant());
      state = reducer(state, setRightCollapsed(true));
      expect(state.rightCollapsed).toBe(true);
      expect(state.selectedAssistant).toBeNull();
    });
  });
});
