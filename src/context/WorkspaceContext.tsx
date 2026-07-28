import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import companyLedgerData from '../mocks/companyMasterLedger.json';
import { Department, Personnel, Property, CompanyMasterLedger } from '../types/companyCore';
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

  // Default active user based on Redux user or fallback to founder in personnel[0]
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
        accessLevel: (reduxUser.accessLevel as any) || 3,
        phone: '+971500000000',
        nationalityCode: 'AE',
        commissionRule: { agentSplit: 0.5, companySplit: 0.5, tierName: 'Standard Split (50/50)' },
        joinedDate: '2024-01-01',
        isActive: true,
        avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop'
      };
    }
    return ledger.personnel[0]; // Arsalan Malik Goraha (Founder Level 5)
  }, [reduxUser, ledger.personnel]);

  const activeUser = impersonatedUser || defaultUser;

  const isMaster = Boolean(
    reduxUser?.email === 'arslanmalikgoraha@gmail.com' ||
    reduxUser?.accessLevel === 5 ||
    defaultUser.email === 'arslanmalikgoraha@gmail.com'
  );

  const effectiveAccessLevel = (activeUser.email === 'arslanmalikgoraha@gmail.com' || (isMaster && !impersonatedUser)) ? 5 : activeUser.accessLevel;
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
