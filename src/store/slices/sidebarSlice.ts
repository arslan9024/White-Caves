import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { logout } from '../authSlice';

interface SidebarState {
  /** Icon-rail flyout open state */
  flyoutOpen: boolean;
  /** Which department's flyout is shown */
  flyoutDepartment: string | null;
  /** Right AI assistant panel open */
  rightPanelOpen: boolean;
  /** Selected AI assistant */
  selectedAssistant: string | null;
  /** Selected department */
  selectedDepartment: string | null;
  /** Selected service within a department */
  selectedService: string | null;
  /** Command palette (Cmd+K) open */
  commandPaletteOpen: boolean;
  /** Mobile bottom sheet open */
  mobileSheetOpen: boolean;
}

const initialState: SidebarState = {
  flyoutOpen: false,
  flyoutDepartment: null,
  rightPanelOpen: false,
  selectedAssistant: null,
  selectedDepartment: null,
  selectedService: null,
  commandPaletteOpen: false,
  mobileSheetOpen: false,
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    // ── Flyout (icon-rail submenu) ──────────────────────────────────
    openFlyout: (state, action: PayloadAction<string>) => {
      state.flyoutOpen = true;
      state.flyoutDepartment = action.payload;
    },
    closeFlyout: (state) => {
      state.flyoutOpen = false;
      state.flyoutDepartment = null;
    },
    toggleFlyout: (state, action: PayloadAction<string>) => {
      if (state.flyoutOpen && state.flyoutDepartment === action.payload) {
        state.flyoutOpen = false;
        state.flyoutDepartment = null;
      } else {
        state.flyoutOpen = true;
        state.flyoutDepartment = action.payload;
      }
    },

    // ── Right panel (AI assistants) ─────────────────────────────────
    openRightPanel: (state) => {
      state.rightPanelOpen = true;
    },
    closeRightPanel: (state) => {
      state.rightPanelOpen = false;
    },
    toggleRightPanel: (state) => {
      state.rightPanelOpen = !state.rightPanelOpen;
    },

    // ── Selection ───────────────────────────────────────────────────
    selectAssistant: (state, action: PayloadAction<string | null>) => {
      state.selectedAssistant = action.payload;
      if (action.payload) {
        state.rightPanelOpen = true;
      }
    },
    clearSelectedAssistant: (state) => {
      state.selectedAssistant = null;
    },
    selectDepartment: (state, action: PayloadAction<string | null>) => {
      state.selectedDepartment = action.payload;
    },
    selectService: (state, action: PayloadAction<{ department: string; service: string }>) => {
      const { department, service } = action.payload;
      state.selectedDepartment = department;
      state.selectedService = service;
      state.flyoutOpen = false;
      state.flyoutDepartment = null;
    },
    clearDepartmentSelection: (state) => {
      state.selectedDepartment = null;
      state.selectedService = null;
    },

    // ── Command Palette ─────────────────────────────────────────────
    openCommandPalette: (state) => {
      state.commandPaletteOpen = true;
    },
    closeCommandPalette: (state) => {
      state.commandPaletteOpen = false;
    },
    toggleCommandPalette: (state) => {
      state.commandPaletteOpen = !state.commandPaletteOpen;
    },

    // ── Mobile ──────────────────────────────────────────────────────
    toggleMobileSheet: (state) => {
      state.mobileSheetOpen = !state.mobileSheetOpen;
    },
    closeMobileSheet: (state) => {
      state.mobileSheetOpen = false;
    },

    // ── Legacy compatibility aliases ────────────────────────────────
    toggleLeftSidebar: (state) => {
      state.flyoutOpen = !state.flyoutOpen;
    },
    toggleRightSidebar: (state) => {
      state.rightPanelOpen = !state.rightPanelOpen;
    },
    setLeftCollapsed: (state, action: PayloadAction<boolean>) => {
      state.flyoutOpen = !action.payload;
    },
    setRightCollapsed: (state, action: PayloadAction<boolean>) => {
      state.rightPanelOpen = !action.payload;
    },
    setShowRightDrawer: (state, action: PayloadAction<boolean>) => {
      state.rightPanelOpen = action.payload;
    },
    toggleShowRightDrawer: (state) => {
      state.rightPanelOpen = !state.rightPanelOpen;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const {
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
} = sidebarSlice.actions;

// ─── Named Selectors (stable references for useSelector) ─────────────────
export const selectFlyoutOpen = (state: { sidebar: SidebarState }) => state.sidebar.flyoutOpen;
export const selectFlyoutDepartment = (state: { sidebar: SidebarState }) => state.sidebar.flyoutDepartment;
export const selectRightPanelOpen = (state: { sidebar: SidebarState }) => state.sidebar.rightPanelOpen;
export const selectSelectedAssistant = (state: { sidebar: SidebarState }) => state.sidebar.selectedAssistant;
export const selectSelectedDepartment = (state: { sidebar: SidebarState }) => state.sidebar.selectedDepartment;
export const selectSelectedService = (state: { sidebar: SidebarState }) => state.sidebar.selectedService;
export const selectCommandPaletteOpen = (state: { sidebar: SidebarState }) => state.sidebar.commandPaletteOpen;
export const selectMobileSheetOpen = (state: { sidebar: SidebarState }) => state.sidebar.mobileSheetOpen;

// Legacy selectors (backward compat)
export const selectLeftCollapsed = (state: { sidebar: SidebarState }) => !state.sidebar.flyoutOpen;
export const selectRightCollapsed = (state: { sidebar: SidebarState }) => !state.sidebar.rightPanelOpen;
export const selectShowRightDrawer = (state: { sidebar: SidebarState }) => state.sidebar.rightPanelOpen;

export default sidebarSlice.reducer;
