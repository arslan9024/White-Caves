/**
 * zIndexTokens.ts — AEGIS Universal Z-Index Layering Standard
 *
 * Enforces strict, deterministic stacking order across all White Caves views.
 * Completely eliminates Z-index collisions, modal trapping, and floating widget overlaps.
 */

export const Z_INDEX = {
  /** Background grid, particle canvas, ambient luxury gradient mesh */
  CANVAS: 0,
  /** Normal document flow: page sections, cards, tables, dashboard widgets */
  CONTENT: 10,
  /** Elevated cards, interactive dropdown menus, inline popovers */
  DROPDOWN: 20,
  /** Sticky top navigation bar, brand masthead, header search */
  HEADER: 40,
  /** Bottom symmetrical floating dock (Zoe AI trigger, WhatsApp, quick actions) */
  BOTTOM_DOCK: 50,
  /** Secondary floating action drawers & mobile slide-up sheets */
  DRAWER: 60,
  /** Global interactive dialogs: AI Organogram, Kanban Task Creator, Mortgage Calc */
  MODAL: 70,
  /** High-priority confirmation popups & legal disclosure overlays */
  CONFIRMATION: 80,
  /** System toasts, real-time lead alerts, statutory compliance warnings */
  TOAST: 90,
  /** MD Sovereign Seal statutory signing portal & emergency security shield */
  SOVEREIGN_PORTAL: 100,
} as const;

export type ZIndexLayer = keyof typeof Z_INDEX;
