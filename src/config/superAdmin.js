export const SUPER_ADMIN = {
  email: 'arslanmalikgoraha@gmail.com',
  name: 'Arslan Malik',
  title: 'Managing Director',
  role: 'md',
  roleLabel: 'Managing Director',
  company: 'White Caves Real Estate',
  avatar: null,
  permissions: {
    isSuperUser: true,
    isDecisionMaker: true,
    canViewAllDashboards: true,
    canManageAgents: true,
    canManageFinances: true,
    canAccessAIAssistants: true,
    canManageProperties: true,
    canManageLeads: true,
    canAccessAnalytics: true,
    canManageSettings: true,
    canViewExecutiveReports: true,
    canAccessConfidentialVault: true
  },
  aiAssistant: {
    primary: 'zoe',
    name: 'Zoe',
    description: 'Executive AI Assistant for the Managing Director'
  }
};

export const isSuperAdmin = (user) => {
  if (!user) return false;
  return user.email === SUPER_ADMIN.email;
};

export const isMDAuthorized = (user) => {
  if (!user) return false;
  if (user.email === SUPER_ADMIN.email) return true;
  const storedRole = localStorage.getItem('userRole');
  if (storedRole) {
    try {
      const roleData = JSON.parse(storedRole);
      return roleData.role === 'md';
    } catch (e) {
      return false;
    }
  }
  return false;
};

export default SUPER_ADMIN;
