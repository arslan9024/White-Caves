/**
 * REPropertyManager.styles.ts
 * 7-Category Architecture: Styles Layer
 * Luxury Dubai Real Estate Design System Tokens & Utility Classes
 * Single Purpose File Law: < 350 lines
 */

export const propStyles = {
  container: 'p-6 space-y-6 max-w-7xl mx-auto',
  headerWrapper:
    'flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800',
  headerLeft: 'flex items-center gap-3',
  headerIcon:
    'w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xl shrink-0',
  headerTitle: 'text-xl font-bold text-white flex items-center gap-2 tracking-tight',
  headerSubtitle: 'text-xs text-slate-400 mt-0.5',
  addBtn:
    'px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer',

  // Metrics Deck
  metricsRow: 'grid grid-cols-2 md:grid-cols-5 gap-3',
  metricCard:
    'p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm flex flex-col justify-between',
  metricNumber: 'text-xl md:text-2xl font-black text-white font-mono',
  metricLabel: 'text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1',

  // Controls & Filters Bar
  controlsBar:
    'flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 bg-slate-900/80 rounded-xl border border-slate-800',
  searchBox: 'flex-1 relative flex items-center',
  searchIcon: 'absolute left-3 text-slate-500 text-xs',
  searchInput:
    'w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors',
  filterGroup: 'flex items-center gap-2 overflow-x-auto pb-1 md:pb-0',
  filterSelect:
    'px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-amber-500 cursor-pointer',
  purposeToggleBtn: (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
      active
        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
    }`,

  // Property Cards Grid
  propertyGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5',
  card: 'bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/5 group flex flex-col',
  cardImageWrapper: 'relative h-48 w-full overflow-hidden bg-slate-950',
  cardImage: 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-500',
  cardBadgePurpose: (purpose: 'BUY' | 'RENT') =>
    `absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider backdrop-blur-md ${
      purpose === 'BUY' ? 'bg-emerald-500/90 text-slate-950' : 'bg-blue-500/90 text-white'
    }`,
  cardBadgeStatus: (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      case 'UNDER_OFFER':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      case 'SOLD':
        return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
      case 'LEASED':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      default:
        return 'bg-slate-700/20 text-slate-400 border border-slate-700/30';
    }
  },
  cardContent: 'p-4 flex-1 flex flex-col justify-between space-y-3',
  cardPrice: 'text-xl font-black text-amber-400 font-mono tracking-tight',
  cardTitle:
    'text-sm font-bold text-white line-clamp-1 group-hover:text-amber-300 transition-colors',
  cardLocation: 'text-xs text-slate-400 flex items-center gap-1.5',
  cardChipsRow:
    'flex items-center gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 font-medium',
  chip: 'px-2 py-1 rounded-md bg-slate-950 border border-slate-800 flex items-center gap-1',
};
