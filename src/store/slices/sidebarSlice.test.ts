import { describe, it, expect } from 'vitest';
import reducer, {
  openFlyout,
  closeFlyout,
  toggleFlyout,
  openRightPanel,
  closeRightPanel,
  toggleRightPanel,
  selectAssistant,
  clearSelectedAssistant,
  selectDepartment,
  selectService,
  clearDepartmentSelection,
  openCommandPalette,
  closeCommandPalette,
  toggleCommandPalette,
  toggleMobileSheet,
  closeMobileSheet,
  // Legacy aliases
  toggleLeftSidebar,
  toggleRightSidebar,
  setLeftCollapsed,
  setRightCollapsed,
  setShowRightDrawer,
  toggleShowRightDrawer,
  // Selectors
  selectFlyoutOpen,
  selectFlyoutDepartment,
  selectRightPanelOpen,
  selectSelectedAssistant,
  selectSelectedDepartment,
  selectSelectedService,
  selectCommandPaletteOpen,
  selectMobileSheetOpen,
  selectLeftCollapsed,
  selectRightCollapsed,
  selectShowRightDrawer,
} from './sidebarSlice';
import { logout } from '../authSlice';

// ─── Helpers ───────────────────────────────────────────────────────
const initialState = () => reducer(undefined, { type: '@@INIT' });
type SidebarState = ReturnType<typeof initialState>;
const rootWith = (overrides: Partial<SidebarState> = {}) =>
  ({ sidebar: { ...initialState(), ...overrides } });

// ─── Tests ─────────────────────────────────────────────────────────
describe('sidebarSlice', () => {
  describe('initial state', () => {
    it('starts with flyout closed', () => {
      const state = initialState();
      expect(state.flyoutOpen).toBe(false);
      expect(state.flyoutDepartment).toBeNull();
    });

    it('starts with right panel closed', () => {
      expect(initialState().rightPanelOpen).toBe(false);
    });

    it('starts with no selections', () => {
      const state = initialState();
      expect(state.selectedAssistant).toBeNull();
      expect(state.selectedDepartment).toBeNull();
      expect(state.selectedService).toBeNull();
    });

    it('starts with command palette closed', () => {
      expect(initialState().commandPaletteOpen).toBe(false);
    });

    it('starts with mobile sheet closed', () => {
      expect(initialState().mobileSheetOpen).toBe(false);
    });
  });

  // ─── Flyout ─────────────────────────────────────────────────────
  describe('flyout', () => {
    it('openFlyout opens and sets department', () => {
      const state = reducer(initialState(), openFlyout('sales'));
      expect(state.flyoutOpen).toBe(true);
      expect(state.flyoutDepartment).toBe('sales');
    });

    it('closeFlyout closes and clears department', () => {
      let state = reducer(initialState(), openFlyout('sales'));
      state = reducer(state, closeFlyout());
      expect(state.flyoutOpen).toBe(false);
      expect(state.flyoutDepartment).toBeNull();
    });

    it('toggleFlyout opens if closed', () => {
      const state = reducer(initialState(), toggleFlyout('finance'));
      expect(state.flyoutOpen).toBe(true);
      expect(state.flyoutDepartment).toBe('finance');
    });

    it('toggleFlyout closes if same dept is open', () => {
      let state = reducer(initialState(), openFlyout('finance'));
      state = reducer(state, toggleFlyout('finance'));
      expect(state.flyoutOpen).toBe(false);
    });

    it('toggleFlyout switches dept if different dept is open', () => {
      let state = reducer(initialState(), openFlyout('finance'));
      state = reducer(state, toggleFlyout('sales'));
      expect(state.flyoutOpen).toBe(true);
      expect(state.flyoutDepartment).toBe('sales');
    });
  });

  // ─── Right panel (legacy → now maps to aiCommandOpen) ─────────
  describe('right panel', () => {
    it('openRightPanel opens AI command', () => {
      const state = reducer(initialState(), openRightPanel());
      expect(state.aiCommandOpen).toBe(true);
    });

    it('closeRightPanel closes AI command', () => {
      let state = reducer(initialState(), openRightPanel());
      state = reducer(state, closeRightPanel());
      expect(state.aiCommandOpen).toBe(false);
    });

    it('toggleRightPanel flips aiCommandOpen', () => {
      let state = initialState();
      state = reducer(state, toggleRightPanel());
      expect(state.aiCommandOpen).toBe(true);
      state = reducer(state, toggleRightPanel());
      expect(state.aiCommandOpen).toBe(false);
    });
  });

  // ─── Assistant selection ────────────────────────────────────────
  describe('assistant selection', () => {
    it('selectAssistant sets selectedAssistant and opens AI command', () => {
      const state = reducer(initialState(), selectAssistant('hazel'));
      expect(state.selectedAssistant).toBe('hazel');
      expect(state.aiCommandOpen).toBe(true);
    });

    it('selectAssistant(null) clears without opening', () => {
      let state = reducer(initialState(), selectAssistant('hazel'));
      state = reducer(state, selectAssistant(null));
      expect(state.selectedAssistant).toBeNull();
    });

    it('clearSelectedAssistant clears selection', () => {
      let state = reducer(initialState(), selectAssistant('hazel'));
      state = reducer(state, clearSelectedAssistant());
      expect(state.selectedAssistant).toBeNull();
    });

    it('replaces previous assistant', () => {
      let state = reducer(initialState(), selectAssistant('hazel'));
      state = reducer(state, selectAssistant('clara'));
      expect(state.selectedAssistant).toBe('clara');
    });
  });

  // ─── Department / Service selection ─────────────────────────────
  describe('department & service selection', () => {
    it('selectDepartment sets department', () => {
      const state = reducer(initialState(), selectDepartment('sales'));
      expect(state.selectedDepartment).toBe('sales');
    });

    it('selectDepartment(null) clears', () => {
      let state = reducer(initialState(), selectDepartment('sales'));
      state = reducer(state, selectDepartment(null));
      expect(state.selectedDepartment).toBeNull();
    });

    it('selectService sets both and closes flyout', () => {
      let state = reducer(initialState(), openFlyout('sales'));
      state = reducer(state, selectService({ department: 'sales', service: 'Lead Management' }));
      expect(state.selectedDepartment).toBe('sales');
      expect(state.selectedService).toBe('Lead Management');
      expect(state.flyoutOpen).toBe(false);
    });

    it('clearDepartmentSelection clears both', () => {
      let state = reducer(
        initialState(),
        selectService({ department: 'sales', service: 'Lead Management' })
      );
      state = reducer(state, clearDepartmentSelection());
      expect(state.selectedDepartment).toBeNull();
      expect(state.selectedService).toBeNull();
    });
  });

  // ─── Command palette ───────────────────────────────────────────
  describe('command palette', () => {
    it('openCommandPalette opens', () => {
      const state = reducer(initialState(), openCommandPalette());
      expect(state.commandPaletteOpen).toBe(true);
    });

    it('closeCommandPalette closes', () => {
      let state = reducer(initialState(), openCommandPalette());
      state = reducer(state, closeCommandPalette());
      expect(state.commandPaletteOpen).toBe(false);
    });

    it('toggleCommandPalette flips', () => {
      let state = initialState();
      state = reducer(state, toggleCommandPalette());
      expect(state.commandPaletteOpen).toBe(true);
      state = reducer(state, toggleCommandPalette());
      expect(state.commandPaletteOpen).toBe(false);
    });
  });

  // ─── Mobile ─────────────────────────────────────────────────────
  describe('mobile', () => {
    it('toggleMobileSheet flips', () => {
      let state = initialState();
      state = reducer(state, toggleMobileSheet());
      expect(state.mobileSheetOpen).toBe(true);
      state = reducer(state, toggleMobileSheet());
      expect(state.mobileSheetOpen).toBe(false);
    });

    it('closeMobileSheet closes', () => {
      let state = reducer(initialState(), toggleMobileSheet());
      state = reducer(state, closeMobileSheet());
      expect(state.mobileSheetOpen).toBe(false);
    });
  });

  // ─── Legacy aliases ─────────────────────────────────────────────
  describe('legacy aliases', () => {
    it('toggleLeftSidebar flips flyoutOpen', () => {
      let state = initialState();
      state = reducer(state, toggleLeftSidebar());
      expect(state.flyoutOpen).toBe(true);
      state = reducer(state, toggleLeftSidebar());
      expect(state.flyoutOpen).toBe(false);
    });

    it('toggleRightSidebar flips aiCommandOpen', () => {
      let state = initialState();
      state = reducer(state, toggleRightSidebar());
      expect(state.aiCommandOpen).toBe(true);
    });

    it('setLeftCollapsed(true) closes flyout', () => {
      let state = reducer(initialState(), openFlyout('sales'));
      state = reducer(state, setLeftCollapsed(true));
      expect(state.flyoutOpen).toBe(false);
    });

    it('setLeftCollapsed(false) opens flyout', () => {
      const state = reducer(initialState(), setLeftCollapsed(false));
      expect(state.flyoutOpen).toBe(true);
    });

    it('setRightCollapsed(false) opens AI command', () => {
      const state = reducer(initialState(), setRightCollapsed(false));
      expect(state.aiCommandOpen).toBe(true);
    });

    it('setShowRightDrawer sets aiCommandOpen', () => {
      const state = reducer(initialState(), setShowRightDrawer(true));
      expect(state.aiCommandOpen).toBe(true);
    });

    it('toggleShowRightDrawer flips aiCommandOpen', () => {
      let state = initialState();
      state = reducer(state, toggleShowRightDrawer());
      expect(state.aiCommandOpen).toBe(true);
    });
  });

  // ─── logout (extraReducer) ─────────────────────────────────────
  describe('logout', () => {
    it('resets to initial state on logout', () => {
      let state = initialState();
      state = reducer(state, openFlyout('sales'));
      state = reducer(state, selectAssistant('hazel'));
      state = reducer(state, openCommandPalette());
      state = reducer(state, toggleMobileSheet());

      state = reducer(state, logout());
      expect(state).toEqual(initialState());
    });
  });

  // ─── Selectors ─────────────────────────────────────────────────
  describe('selectors', () => {
    it('selectFlyoutOpen', () => {
      expect(selectFlyoutOpen(rootWith())).toBe(false);
      expect(selectFlyoutOpen(rootWith({ flyoutOpen: true }))).toBe(true);
    });

    it('selectFlyoutDepartment', () => {
      expect(selectFlyoutDepartment(rootWith())).toBeNull();
      expect(selectFlyoutDepartment(rootWith({ flyoutDepartment: 'sales' }))).toBe('sales');
    });

    it('selectRightPanelOpen (legacy → reads aiCommandOpen)', () => {
      expect(selectRightPanelOpen(rootWith())).toBe(false);
      expect(selectRightPanelOpen(rootWith({ aiCommandOpen: true }))).toBe(true);
    });

    it('selectSelectedAssistant', () => {
      expect(selectSelectedAssistant(rootWith())).toBeNull();
      expect(selectSelectedAssistant(rootWith({ selectedAssistant: 'hazel' }))).toBe('hazel');
    });

    it('selectSelectedDepartment', () => {
      expect(selectSelectedDepartment(rootWith())).toBeNull();
      expect(selectSelectedDepartment(rootWith({ selectedDepartment: 'sales' }))).toBe('sales');
    });

    it('selectSelectedService', () => {
      expect(selectSelectedService(rootWith())).toBeNull();
      expect(selectSelectedService(rootWith({ selectedService: 'Lead Management' }))).toBe('Lead Management');
    });

    it('selectCommandPaletteOpen', () => {
      expect(selectCommandPaletteOpen(rootWith())).toBe(false);
      expect(selectCommandPaletteOpen(rootWith({ commandPaletteOpen: true }))).toBe(true);
    });

    it('selectMobileSheetOpen', () => {
      expect(selectMobileSheetOpen(rootWith())).toBe(false);
      expect(selectMobileSheetOpen(rootWith({ mobileSheetOpen: true }))).toBe(true);
    });

    // Legacy selectors (derived)
    it('selectLeftCollapsed (legacy) inverts flyoutOpen', () => {
      expect(selectLeftCollapsed(rootWith())).toBe(true);
      expect(selectLeftCollapsed(rootWith({ flyoutOpen: true }))).toBe(false);
    });

    it('selectRightCollapsed (legacy) inverts aiCommandOpen', () => {
      expect(selectRightCollapsed(rootWith())).toBe(true);
      expect(selectRightCollapsed(rootWith({ aiCommandOpen: true }))).toBe(false);
    });

    it('selectShowRightDrawer (legacy) mirrors aiCommandOpen', () => {
      expect(selectShowRightDrawer(rootWith())).toBe(false);
      expect(selectShowRightDrawer(rootWith({ aiCommandOpen: true }))).toBe(true);
    });
  });

  // ─── Action sequences ──────────────────────────────────────────
  describe('action sequences', () => {
    it('open flyout → select dept → select service → close', () => {
      let state = initialState();
      state = reducer(state, openFlyout('sales'));
      state = reducer(state, selectDepartment('sales'));
      state = reducer(state, selectService({ department: 'sales', service: 'Pipeline' }));
      expect(state.selectedDepartment).toBe('sales');
      expect(state.selectedService).toBe('Pipeline');
      expect(state.flyoutOpen).toBe(false);

      state = reducer(state, clearDepartmentSelection());
      expect(state.selectedDepartment).toBeNull();
    });

    it('open AI → select assistant → clear → close', () => {
      let state = initialState();
      state = reducer(state, openRightPanel());
      state = reducer(state, selectAssistant('hazel'));
      expect(state.selectedAssistant).toBe('hazel');

      state = reducer(state, clearSelectedAssistant());
      state = reducer(state, closeRightPanel());
      expect(state.aiCommandOpen).toBe(false);
      expect(state.selectedAssistant).toBeNull();
    });
  });
});
