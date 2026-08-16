import React, { createContext, useContext, useState, ReactNode } from 'react';
import rawLedgerData from '../mocks/companyMasterLedger.json';
import { Department, Personnel, Property, CompanyMasterLedger } from '../types/companyCore';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { selectCurrentUser } from '../store/userSlice';

// ─── Ledger normaliser ────────────────────────────────────────────────────────
// companyMasterLedger.json may be a flat array (stub) or a proper CompanyMasterLedger
// object. This function safely coerces either shape into the expected interface.

function normaliseLedger(raw: unknown): CompanyMasterLedger {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const obj = raw as Record<string, unknown>;
    // Looks like a proper ledger object
    if (Array.isArray(obj.personnel)) {
      return raw as CompanyMasterLedger;
    }
  }

  // Flat array shape (stub data) — lift it into a Personnel[] and build a
  // minimal CompanyMasterLedger so the app can boot without crashing.
  const rawArr = Array.isArray(raw) ? (raw as Array<Record<string, unknown>>) : [];

  const personnel: Personnel[] = rawArr.map((item, idx) => ({
    id: String(item.id ?? `usr-${idx}`),
    name: String(item.name ?? `User ${idx + 1}`),
    email: String(item.email ?? `user${idx + 1}@whitecaves.ae`),
    roleId: String(item.roleId ?? 'R-GENERIC'),
    roleTitle: String(item.role ?? item.roleTitle ?? 'Agent'),
    assignedDepartment: 'sales' as const,
    accessLevel: (Number(item.level ?? item.accessLevel) || 3) as 1 | 2 | 3 | 4 | 5,
    phone: String(item.phone ?? '+971500000000'),
    nationalityCode: String(item.nationalityCode ?? 'AE'),
    commissionRule: {
      agentSplit: 0.5,
      companySplit: 0.5,
      tierName: 'Standard Split (50/50)',
    },
    joinedDate: String(item.joinedDate ?? '2024-01-01'),
    isActive: item.isActive !== false,
    avatarUrl: String(
      item.avatarUrl ??
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop'
    ),
  }));

  // Ensure the founder always exists at index 0
  if (!personnel.some(p => p.email === 'arslanmalikgoraha@gmail.com')) {
    personnel.unshift({
      id: 'EMP-001',
      name: 'Arslan Malik Bashir Ahmad',
      email: 'arslanmalikgoraha@gmail.com',
      roleId: 'R-MD',
      roleTitle: 'Managing Director',
      assignedDepartment: 'executive',
      accessLevel: 5,
      phone: '+971503000001',
      nationalityCode: 'AE',
      commissionRule: { agentSplit: 0, companySplit: 1, tierName: 'MD Override' },
      joinedDate: '2023-01-01',
      isActive: true,
      avatarUrl:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
    });
  }

  return {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    departments: [] as Department[],
    personnel,
    properties: [] as Property[],
  };
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface WorkspaceContextType {
  ledger: CompanyMasterLedger;
  departments: Department[];
  personnel: Personnel[];
  properties: Property[];
  activeUser: Personnel | null;
  impersonatedUser: Personnel | null;
  setImpersonatedUser: (user: Personnel | null) => void;
  clearImpersonation: () => void;
  isMaster: boolean;
  effectiveAccessLevel: number;
  effectiveRole: string;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const ledger = React.useMemo(() => normaliseLedger(rawLedgerData), []);
  const reduxUser = useSelector((state: RootState) => selectCurrentUser(state));

  const [impersonatedUser, setImpersonatedUser] = useState<Personnel | null>(null);

  // Default active user: match Redux session → fallback to founder (personnel[0])
  const defaultUser: Personnel = React.useMemo(() => {
    if (reduxUser) {
      const found = ledger.personnel.find(p => p.email === reduxUser.email);
      if (found) return found;
      return {
        id: 'usr-redux',
        name: reduxUser.displayName || reduxUser.name || 'Active User',
        email: reduxUser.email || 'user@whitecaves.ae',
        roleId: 'R-GENERIC',
        roleTitle: reduxUser.role || 'Agent',
        assignedDepartment: 'sales',
        accessLevel: (reduxUser.accessLevel as 1 | 2 | 3 | 4 | 5) || 3,
        phone: '+971500000000',
        nationalityCode: 'AE',
        commissionRule: { agentSplit: 0.5, companySplit: 0.5, tierName: 'Standard Split (50/50)' },
        joinedDate: '2024-01-01',
        isActive: true,
        avatarUrl:
          'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
      };
    }
    // Safe fallback — normaliseLedger guarantees at least the founder exists
    return ledger.personnel[0];
  }, [reduxUser, ledger.personnel]);

  const activeUser = impersonatedUser || defaultUser;

  const isMaster = Boolean(
    reduxUser?.email === 'arslanmalikgoraha@gmail.com' ||
      reduxUser?.accessLevel === 5 ||
      defaultUser.email === 'arslanmalikgoraha@gmail.com'
  );

  const effectiveAccessLevel =
    activeUser.email === 'arslanmalikgoraha@gmail.com' || (isMaster && !impersonatedUser)
      ? 5
      : activeUser.accessLevel;

  const effectiveRole = activeUser.assignedDepartment;

  const clearImpersonation = () => setImpersonatedUser(null);

  return (
    <WorkspaceContext.Provider
      value={{
        ledger,
        departments: ledger.departments,
        personnel: ledger.personnel,
        properties: ledger.properties,
        activeUser,
        impersonatedUser,
        setImpersonatedUser,
        clearImpersonation,
        isMaster,
        effectiveAccessLevel,
        effectiveRole,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = (): WorkspaceContextType => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
