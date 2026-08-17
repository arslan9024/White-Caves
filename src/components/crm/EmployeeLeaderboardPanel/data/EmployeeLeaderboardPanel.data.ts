/**
 * EmployeeLeaderboardPanel.data.ts — Content & Data Variables
 */

export const LEADERBOARD_TEXT = {
  headerTitle: '🏆 1-12-108 Hierarchy Leaderboard',
  headerSubtitle: '1 Managing Director · 12 Department Managers · 108 Supervisors',
  byDeptBtn: '🏢 By Department',
  globalManagersBtn: '👑 12 Managers Rank',
  managerTitle: 'DEPARTMENT MANAGER (LEVEL 4)',
  supervisorTitle: 'SUPERVISORS (LEVEL 3)',
  juniorsTitle: 'JUNIOR AGENTS (LEVEL 2)',
  internsTitle: 'INTERNS (LEVEL 1)',
};

export const LEVEL_LABELS: Record<number, string> = {
  5: 'MANAGING DIRECTOR',
  4: 'DEPARTMENT MANAGER',
  3: 'SUPERVISOR',
  2: 'JUNIOR',
  1: 'INTERN',
};

export const LEVEL_COLORS: Record<number, string> = {
  5: '#D4AF37',
  4: '#EF4444',
  3: '#7C3AED',
  2: '#0EA5E9',
  1: '#94A3B8',
};
