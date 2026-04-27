import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { logout } from '../authSlice';

interface SidebarState {
  /** Icon-rail flyout open state */
  flyoutOpen: boolean;
  /** Which department's flyout is shown */
  flyoutDepartment: string | null;
  /** AI Command Center flyout open (replaces right panel) */
  aiCommandOpen: boolean;
  /** AI assistant search query */
  aiAssistantSearch: string;
  /** AI assistant filter mode */
  aiAssistantFilter: 'all' | 'active' | 'idle';
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
  aiCommandOpen: false,
  aiAssistantSearch: '',
  aiAssistantFilter: 'all',
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
      state.aiCommandOpen = false; // Close AI when dept opens
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
        state.aiCommandOpen = false; // Close AI when dept opens
      }
    },

    // ── AI Command Center (unified sidebar flyout) ──────────────────
    openAICommand: (state) => {
      state.aiCommandOpen = true;
      state.flyoutOpen = false;
      state.flyoutDepartment = null;
    },
    closeAICommand: (state) => {
      state.aiCommandOpen = false;
    },
    toggleAICommand: (state) => {
      if (state.aiCommandOpen) {
        state.aiCommandOpen = false;
      } else {
        state.aiCommandOpen = true;
        state.flyoutOpen = false;
        state.flyoutDepartment = null;
      }
    },

    // ── Selection ───────────────────────────────────────────────────
    selectAssistant: (state, action: PayloadAction<string | null>) => {
      state.selectedAssistant = action.payload;
      if (action.payload) {
        state.aiCommandOpen = true;
        state.flyoutOpen = false;
        state.flyoutDepartment = null;
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

    // ── AI Assistant Search / Filter ─────────────────────────────────
    setAIAssistantSearch: (state, action: PayloadAction<string>) => {
      state.aiAssistantSearch = action.payload;
    },
    setAIAssistantFilter: (state, action: PayloadAction<'all' | 'active' | 'idle'>) => {
      state.aiAssistantFilter = action.payload;
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
  // AI Command Center
  openAICommand,
  closeAICommand,
  toggleAICommand,
  setAIAssistantSearch,
  setAIAssistantFilter,
  // Selection
  selectAssistant,
  clearSelectedAssistant,
  selectDepartment,
  selectService,
  clearDepartmentSelection,
  // Command Palette
  openCommandPalette,
  closeCommandPalette,
  toggleCommandPalette,
  // Mobile
  toggleMobileSheet,
  closeMobileSheet,
} = sidebarSlice.actions;

// ─── Named Selectors (stable references for useSelector) ─────────────────
export const selectFlyoutOpen = (state: { sidebar: SidebarState }) => state.sidebar.flyoutOpen;
export const selectFlyoutDepartment = (state: { sidebar: SidebarState }) => state.sidebar.flyoutDepartment;
export const selectAICommandOpen = (state: { sidebar: SidebarState }) => state.sidebar.aiCommandOpen;
export const selectAIAssistantSearch = (state: { sidebar: SidebarState }) => state.sidebar.aiAssistantSearch;
export const selectAIAssistantFilter = (state: { sidebar: SidebarState }) => state.sidebar.aiAssistantFilter;
export const selectSelectedAssistant = (state: { sidebar: SidebarState }) => state.sidebar.selectedAssistant;
export const selectSelectedDepartment = (state: { sidebar: SidebarState }) => state.sidebar.selectedDepartment;
export const selectSelectedService = (state: { sidebar: SidebarState }) => state.sidebar.selectedService;
export const selectCommandPaletteOpen = (state: { sidebar: SidebarState }) => state.sidebar.commandPaletteOpen;
export const selectMobileSheetOpen = (state: { sidebar: SidebarState }) => state.sidebar.mobileSheetOpen;

export default sidebarSlice.reducer;
