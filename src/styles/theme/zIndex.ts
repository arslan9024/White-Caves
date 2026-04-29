/**
 * Z-Index Hierarchy
 * Centralized z-index values to prevent conflicts
 * Higher numbers appear on top
 */

export const zIndex = {
  // Hidden / Below normal
  hidden: -1,
  below: 0,

  // Content layers
  content: 1,
  contentHover: 2,
  
  // Dropdowns, popovers
  dropdown: 100,
  popover: 110,
  
  // Sticky elements
  sticky: 200,
  sidebarSticky: 210,
  
  // Fixed elements
  fixed: 300,
  navbar: 300,
  sidebar: 310,
  
  // Modal backdrops
  modalBackdrop: 400,
  
  // Modals, dialogs
  modal: 500,
  drawer: 510,
  
  // Special overlays
  overlay: 600,
  
  // Tooltips
  tooltip: 700,
  contextMenu: 710,
  
  // Notifications / Toasts
  notification: 800,
  toast: 810,
  snackbar: 820,
  
  // Highest level (use sparingly)
  absolute: 9999,
};

export type ZIndex = typeof zIndex;
