import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

// ─── Mock User Profiles ─────────────────────────────────────────────────────
const MOCK_PROFILES = {
  admin: {
    id: 'usr_001',
    name: 'Arslan Malik',
    email: 'arslan.malik@whitecaves.ae',
    role: 'Managing Director',
    title: 'Managing Director & Co-Founder',
    clearance_level: 4,
    department: 'DEPT_ADMIN_CRM',
    department_label: 'Administration',
    avatar_initials: 'AM',
    onboarding_date: '2024-01-15',
    promo_split: null, // Admin — no promo buffer applies
    performance: {
      current_gwc: 287500,
      target_gwc: 350000,
      tier: 'Platinum',
      deals_closed: 14,
      deals_pipeline: 6,
      conversion_rate: 38.2,
    },
    permissions: [
      'view_all_leads',
      'manage_agents',
      'view_compliance',
      'view_ledgers',
      'ai_command_access',
      'manage_commissions',
      'view_analytics',
      'system_admin',
    ],
  },
  broker: {
    id: 'usr_042',
    name: 'Fatima Al-Rashid',
    email: 'fatima.rashid@whitecaves.ae',
    role: 'Sales Consultant',
    title: 'Residential Sales Consultant',
    clearance_level: 1,
    department: 'DEPT_RES_SALES',
    department_label: 'Residential Sales',
    avatar_initials: 'FR',
    // Onboarding within the active 180-day window
    onboarding_date: (() => {
      const d = new Date();
      d.setDate(d.getDate() - 95); // 95 days ago → 85 days remaining
      return d.toISOString().split('T')[0];
    })(),
    promo_split: 70, // 70% promo split during onboarding buffer
    performance: {
      current_gwc: 62000,
      target_gwc: 120000,
      tier: 'Silver',
      deals_closed: 3,
      deals_pipeline: 8,
      conversion_rate: 18.5,
    },
    permissions: [
      'view_my_leads',
      'view_my_deals',
      'view_my_ledger',
    ],
  },
  founder: {
    id: 'founder_001',
    name: 'Arslan Goraha',
    email: 'arslanmalikgoraha@gmail.com',
    role: 'managing_director',
    title: 'Managing Director',
    clearance_level: 5,
    accessLevel: 5,
    department: 'DEPT_ADMIN_CRM',
    department_label: 'Executive',
    avatar_initials: 'AG',
    tier: 'LEVEL_5_MASTER',
    performance: {
      current_gwc: 9999999,
      target_gwc: 10000000,
      tier: 'Master',
      deals_closed: 99,
      deals_pipeline: 99,
      conversion_rate: 100,
    },
    permissions: ['*'],
  }
};

// Mock credentials for login form
const MOCK_CREDENTIALS = {
  'arslan.malik@whitecaves.ae': { password: 'admin123', profile: 'admin' },
  'fatima.rashid@whitecaves.ae': { password: 'broker123', profile: 'broker' },
};

// ─── Context ────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = useCallback((email, password) => {
    const cred = MOCK_CREDENTIALS[email?.toLowerCase()];
    if (!cred) {
      return { success: false, error: 'Account not found. Check your email address.' };
    }
    if (cred.password !== password) {
      return { success: false, error: 'Invalid password. Please try again.' };
    }
    const profile = MOCK_PROFILES[cred.profile];
    setUser(profile);
    setIsAuthenticated(true);
    return { success: true };
  }, []);

  const loginWithProfile = useCallback((profileKey) => {
    const profile = MOCK_PROFILES[profileKey];
    if (profile) {
      setUser(profile);
      setIsAuthenticated(true);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const switchProfile = useCallback((profileKey) => {
    const profile = MOCK_PROFILES[profileKey];
    if (profile) {
      setUser(profile);
    }
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated,
    login,
    loginWithProfile,
    logout,
    switchProfile,
  }), [user, isAuthenticated, login, loginWithProfile, logout, switchProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within an <AuthProvider>');
  }
  return ctx;
}

export default AuthContext;
