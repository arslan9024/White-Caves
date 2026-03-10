import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  leftCollapsed: false,
  rightCollapsed: false,
  selectedAssistant: null,
  showRightDrawer: false,
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
} = sidebarSlice.actions;

export default sidebarSlice.reducer;
