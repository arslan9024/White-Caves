/**
 * UserPreferencesDropdown.data.ts — Content & Data Variables
 */

export const PREFERENCE_LABELS = {
  themeTitle: 'Theme Mode',
  languageTitle: 'Language',
  currencyTitle: 'Currency',
  profileLink: 'Executive Profile',
  dashboardLink: 'CRM Dashboard',
  logoutBtn: 'Sign Out',
  guestName: 'Executive Guest',
  guestRole: 'Level 5 Access',
};

export const THEME_ITEMS = [
  { id: 'light', label: 'Light', icon: '☀️' },
  { id: 'dark', label: 'Dark', icon: '🌙' },
  { id: 'system', label: 'Auto', icon: '💻' },
] as const;
