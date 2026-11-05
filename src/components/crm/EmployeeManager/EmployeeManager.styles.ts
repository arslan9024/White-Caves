/**
 * EmployeeManager.styles.ts
 * 7-Category Architecture: Styles Layer
 * Luxury White Caves styling tokens for Employee Directory & Profiles
 */

export const employeeStyles = {
  container:
    'w-full h-full flex flex-col gap-5 p-6 bg-slate-950 text-slate-100 min-h-screen overflow-y-auto',

  // Header & Metrics
  headerWrapper:
    'flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md',
  headerLeft: 'flex items-center gap-3',
  headerIcon:
    'w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xl',
  headerTitle: 'text-xl font-bold tracking-tight text-white flex items-center gap-2',
  headerSubtitle: 'text-xs text-slate-400 font-medium',

  metricsRow: 'grid grid-cols-2 sm:grid-cols-4 gap-3',
  metricCard: 'p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col',
  metricNumber: 'text-lg font-bold text-white font-mono',
  metricLabel: 'text-[11px] text-slate-400 uppercase tracking-wider font-semibold',

  // Controls & Filters Bar
  controlsBar:
    'flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/80',
  searchBox: 'relative flex-1 min-w-[240px] max-w-md',
  searchInput:
    'w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all',
  searchIcon: 'absolute left-3 top-2.5 w-4 h-4 text-slate-500',

  filterGroup: 'flex items-center gap-2 flex-wrap',
  filterSelect:
    'px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500',
  addBtn:
    'flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/20',

  statusToast:
    'px-3 py-1.5 rounded-lg bg-blue-950/80 border border-blue-500/40 text-blue-300 text-xs flex items-center gap-2',

  // Employee Cards Grid
  cardsGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
  card: 'flex flex-col justify-between p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200 group',
  cardTop: 'flex items-start justify-between gap-2 mb-3',
  cardIdentity: 'flex items-center gap-3',
  avatar:
    'w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm shrink-0',
  name: 'text-sm font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1',
  codePill:
    'px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700',
  designation: 'text-xs text-slate-400 font-medium line-clamp-1 mt-0.5',

  roleBadge: 'px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-semibold',
  roleExecutive: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  roleDirector: 'bg-red-500/20 text-red-300 border border-red-500/30',
  roleManager: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  roleSupervisor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  roleBroker: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  roleSpecialist: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',

  statusPill: 'px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold',
  statusActive: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  statusOnboarding: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  statusProbation: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  statusStandby: 'bg-slate-700/50 text-slate-400 border border-slate-600/30',

  metaSection:
    'p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 my-3 flex flex-col gap-1.5 text-xs text-slate-400',
  metaRow: 'flex items-center justify-between',
  metaLabel: 'text-[11px] text-slate-500 font-medium',
  metaValue: 'text-slate-200 font-semibold font-mono text-[11px]',

  skillsRow: 'flex items-center gap-1 flex-wrap mb-4',
  skillTag:
    'px-1.5 py-0.5 rounded text-[9px] bg-slate-800 text-slate-300 border border-slate-700/60',

  cardFooter: 'flex items-center justify-between pt-3 border-t border-slate-800/80 gap-2',
  editBtn:
    'flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold transition-all',
  demoteBtn:
    'p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30 transition-all text-xs',
};
