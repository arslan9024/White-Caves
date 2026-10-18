import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import companyLedgerData from '../mocks/companyMasterLedger.json';
import {
  Department,
  Personnel,
  Property,
  CompanyMasterLedger,
  AccessLevel,
} from '../types/companyCore';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { selectCurrentUser } from '../store/userSlice';

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
  const ledger = companyLedgerData as CompanyMasterLedger;
  const reduxUser = useSelector((state: RootState) => selectCurrentUser(state));

  const [impersonatedUser, setImpersonatedUser] = useState<Personnel | null>(null);

  const isMasterClaim = Boolean(
    reduxUser?.status === 'active' &&
      reduxUser.accessLevel === 5 &&
      ['lion', 'owner', 'super_admin', 'superuser', 'managing_director'].includes(
        reduxUser.role?.toLowerCase() ?? ''
      )
  );

  // Default active user based on server-hydrated Redux role or a non-master demo persona.
  const defaultUser: Personnel = React.useMemo(() => {
    if (reduxUser) {
      const found = ledger.personnel.find(
        p => p.email === reduxUser.email && (isMasterClaim || p.accessLevel < 5)
      );
      if (found) {
        return {
          ...found,
          accessLevel: (isMasterClaim
            ? 5
            : Math.max(1, Math.min(found.accessLevel, 4))) as AccessLevel,
          roleTitle: reduxUser.role || found.roleTitle,
        };
      }
      return {
        id: 'usr-redux',
        name: reduxUser.displayName || reduxUser.name || 'Active User',
        email: reduxUser.email || 'user@whitecaves.ae',
        roleId: 'R-GENERIC',
        roleTitle: reduxUser.role || 'Agent',
        assignedDepartment: 'sales',
        accessLevel: (isMasterClaim
          ? 5
          : Math.max(1, Math.min(reduxUser.accessLevel ?? 1, 4))) as AccessLevel,
        phone: '+971500000000',
        nationalityCode: 'AE',
        commissionRule: { agentSplit: 0.5, companySplit: 0.5, tierName: 'Standard Split (50/50)' },
        joinedDate: '2024-01-01',
        isActive: true,
        avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
      };
    }
    return ledger.personnel.find(person => person.accessLevel < 5) ?? ledger.personnel[0];
  }, [reduxUser, ledger.personnel, isMasterClaim]);

  const activeUser = impersonatedUser || defaultUser;

  const isMaster = isMasterClaim;

  const effectiveAccessLevel = isMaster && !impersonatedUser ? 5 : activeUser.accessLevel;
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
