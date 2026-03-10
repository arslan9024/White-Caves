import { createSlice } from '@reduxjs/toolkit';

const initialState = {
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
    setLeftCollapsed: (state, action) => {
      state.leftCollapsed = action.payload;
    },
    setRightCollapsed: (state, action) => {
      state.rightCollapsed = action.payload;
    },
    selectAssistant: (state, action) => {
      state.selectedAssistant = action.payload;
    },
    setShowRightDrawer: (state, action) => {
      state.showRightDrawer = action.payload;
    },
    clearSelectedAssistant: (state) => {
      state.selectedAssistant = null;
    },
    selectDepartment: (state, action) => {
      state.selectedDepartment = action.payload;
    },
    selectService: (state, action) => {
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
