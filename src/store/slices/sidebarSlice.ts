import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SidebarState {
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  selectedAssistant: string | null;
  showRightDrawer: boolean;
  selectedDepartment: string | null;
  selectedService: string | null;
}

const initialState: SidebarState = {
  leftCollapsed: true,
  rightCollapsed: true,
  selectedAssistant: null,
  showRightDrawer: false,
  selectedDepartment: null,
  selectedService: null,
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleLeftSidebar: (state) => {
      state.leftCollapsed = !state.leftCollapsed;
    },
    toggleRightSidebar: (state) => {
      state.rightCollapsed = !state.rightCollapsed;
    },
    setLeftCollapsed: (state, action: PayloadAction<boolean>) => {
      state.leftCollapsed = action.payload;
    },
    setRightCollapsed: (state, action: PayloadAction<boolean>) => {
      state.rightCollapsed = action.payload;
    },
    selectAssistant: (state, action: PayloadAction<string | null>) => {
      state.selectedAssistant = action.payload;
    },
    setShowRightDrawer: (state, action: PayloadAction<boolean>) => {
      state.showRightDrawer = action.payload;
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
    },
    clearDepartmentSelection: (state) => {
      state.selectedDepartment = null;
      state.selectedService = null;
    },
  },
});

export const {
  toggleLeftSidebar,
  toggleRightSidebar,
  setLeftCollapsed,
  setRightCollapsed,
  selectAssistant,
  setShowRightDrawer,
  clearSelectedAssistant,
  selectDepartment,
  selectService,
  clearDepartmentSelection,
} = sidebarSlice.actions;

export default sidebarSlice.reducer;
