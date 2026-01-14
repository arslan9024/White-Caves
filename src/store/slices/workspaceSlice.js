import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  leftSidebar: {
    isOpen: true,
    isCollapsed: false,
    selectedDepartment: null,
    selectedPillar: null,
    width: 280
  },
  rightSidebar: {
    isOpen: false,
    isCollapsed: true,
    selectedAssistant: null,
    width: 320
  },
  dashboardMode: 'welcome',
  breadcrumbs: [],
  recentItems: {
    departments: [],
    assistants: []
  }
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    toggleLeftSidebar: (state) => {
      state.leftSidebar.isOpen = !state.leftSidebar.isOpen;
      if (!state.leftSidebar.isOpen) {
        state.leftSidebar.selectedDepartment = null;
        state.leftSidebar.selectedPillar = null;
      }
      updateDashboardMode(state);
    },
    toggleRightSidebar: (state) => {
      state.rightSidebar.isOpen = !state.rightSidebar.isOpen;
      if (!state.rightSidebar.isOpen) {
        state.rightSidebar.selectedAssistant = null;
      }
      updateDashboardMode(state);
    },
    collapseLeftSidebar: (state, action) => {
      state.leftSidebar.isCollapsed = action.payload;
    },
    collapseRightSidebar: (state, action) => {
      state.rightSidebar.isCollapsed = action.payload;
    },
    selectDepartment: (state, action) => {
      state.leftSidebar.selectedDepartment = action.payload;
      state.leftSidebar.selectedPillar = null;
      state.leftSidebar.isOpen = true;
      if (action.payload && !state.recentItems.departments.includes(action.payload)) {
        state.recentItems.departments.unshift(action.payload);
        if (state.recentItems.departments.length > 5) {
          state.recentItems.departments.pop();
        }
      }
      updateDashboardMode(state);
    },
    selectPillar: (state, action) => {
      state.leftSidebar.selectedPillar = action.payload;
      state.leftSidebar.selectedDepartment = null;
      state.leftSidebar.isOpen = true;
      updateDashboardMode(state);
    },
    selectAssistant: (state, action) => {
      state.rightSidebar.selectedAssistant = action.payload;
      state.rightSidebar.isOpen = true;
      state.rightSidebar.isCollapsed = false;
      if (action.payload && !state.recentItems.assistants.includes(action.payload)) {
        state.recentItems.assistants.unshift(action.payload);
        if (state.recentItems.assistants.length > 5) {
          state.recentItems.assistants.pop();
        }
      }
      updateDashboardMode(state);
    },
    clearLeftSelection: (state) => {
      state.leftSidebar.selectedDepartment = null;
      state.leftSidebar.selectedPillar = null;
      updateDashboardMode(state);
    },
    clearRightSelection: (state) => {
      state.rightSidebar.selectedAssistant = null;
      updateDashboardMode(state);
    },
    clearAllSelections: (state) => {
      state.leftSidebar.selectedDepartment = null;
      state.leftSidebar.selectedPillar = null;
      state.rightSidebar.selectedAssistant = null;
      state.dashboardMode = 'welcome';
    },
    setLeftSidebarWidth: (state, action) => {
      state.leftSidebar.width = Math.min(Math.max(action.payload, 200), 400);
    },
    setRightSidebarWidth: (state, action) => {
      state.rightSidebar.width = Math.min(Math.max(action.payload, 250), 450);
    },
    setBreadcrumbs: (state, action) => {
      state.breadcrumbs = action.payload;
    },
    setDashboardMode: (state, action) => {
      state.dashboardMode = action.payload;
    }
  }
});

function updateDashboardMode(state) {
  const hasDept = state.leftSidebar.selectedDepartment || state.leftSidebar.selectedPillar;
  const hasAssistant = state.rightSidebar.selectedAssistant;
  
  if (hasDept && hasAssistant) {
    state.dashboardMode = 'mixed';
  } else if (hasDept) {
    state.dashboardMode = 'department';
  } else if (hasAssistant) {
    state.dashboardMode = 'assistant';
  } else {
    state.dashboardMode = 'welcome';
  }
}

export const {
  toggleLeftSidebar,
  toggleRightSidebar,
  collapseLeftSidebar,
  collapseRightSidebar,
  selectDepartment,
  selectPillar,
  selectAssistant,
  clearLeftSelection,
  clearRightSelection,
  clearAllSelections,
  setLeftSidebarWidth,
  setRightSidebarWidth,
  setBreadcrumbs,
  setDashboardMode
} = workspaceSlice.actions;

const selectWorkspace = (state) => state.workspace;

export const selectLeftSidebar = createSelector(
  [selectWorkspace],
  (workspace) => workspace?.leftSidebar || initialState.leftSidebar
);

export const selectRightSidebar = createSelector(
  [selectWorkspace],
  (workspace) => workspace?.rightSidebar || initialState.rightSidebar
);

export const selectDashboardMode = createSelector(
  [selectWorkspace],
  (workspace) => workspace?.dashboardMode || 'welcome'
);

export const selectBreadcrumbs = createSelector(
  [selectWorkspace],
  (workspace) => workspace?.breadcrumbs || []
);

export const selectRecentItems = createSelector(
  [selectWorkspace],
  (workspace) => workspace?.recentItems || initialState.recentItems
);

export const selectActiveContext = createSelector(
  [selectLeftSidebar, selectRightSidebar, selectDashboardMode],
  (leftSidebar, rightSidebar, mode) => ({
    department: leftSidebar.selectedDepartment,
    pillar: leftSidebar.selectedPillar,
    assistant: rightSidebar.selectedAssistant,
    mode
  })
);

export default workspaceSlice.reducer;
