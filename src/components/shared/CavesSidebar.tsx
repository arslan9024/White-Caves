import React from 'react';
import styled from 'styled-components';
import {
  BarChart2,
  Building,
  FileText,
  Users,
  Shield,
  Briefcase,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Wrench,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

const RED = '#EF4444';
const SLATE = '#1E293B';

export interface DepartmentItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  clearanceLevel: number;
}

export const DEPARTMENTS_LIST: DepartmentItem[] = [
  { id: 'dashboard', name: 'Executive Cockpit', icon: <BarChart2 size={18} />, clearanceLevel: 0 },
  { id: 'leasing', name: 'Leasing & Ejari', icon: <Building size={18} />, clearanceLevel: 1 },
  { id: 'compliance', name: 'Compliance & RERA', icon: <Shield size={18} />, clearanceLevel: 2 },
  { id: 'sales', name: 'Sales & Off-Plan', icon: <TrendingUp size={18} />, clearanceLevel: 1 },
  { id: 'finance', name: 'Finance & VAT', icon: <DollarSign size={18} />, clearanceLevel: 2 },
  { id: 'maintenance', name: 'Facilities & Ops', icon: <Wrench size={18} />, clearanceLevel: 1 },
  { id: 'marketing', name: 'Marketing & SEO', icon: <Briefcase size={18} />, clearanceLevel: 1 },
  { id: 'comms', name: 'WhatsApp & Bot', icon: <MessageSquare size={18} />, clearanceLevel: 1 },
  { id: 'ai', name: 'AI Assistants Hub', icon: <Sparkles size={18} />, clearanceLevel: 1 },
  { id: 'legal', name: 'Legal & Contracts', icon: <FileText size={18} />, clearanceLevel: 2 },
  { id: 'hr', name: '100-Broker Workforce', icon: <Users size={18} />, clearanceLevel: 2 },
  { id: 'audits', name: 'Audit Logs & PDPL', icon: <Shield size={18} />, clearanceLevel: 3 },
];

export interface CavesSidebarProps {
  activeDept?: string;
  onSelectDept?: (deptId: string) => void;
  userClearance?: number;
  isMD?: boolean;
}

const SidebarContainer = styled.aside`
  width: 280px;
  background: #FFFFFF;
  border-right: 1.5px solid rgba(239, 68, 68, 0.15);
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px 12px;
`;

const SectionHeader = styled.div`
  font-size: 0.75rem;
  font-weight: 900;
  color: ${RED};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 8px 12px;
  margin-bottom: 8px;
`;

const NavItemBtn = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 14px;
  border-radius: 12px;
  border: none;
  background: ${props => (props.$isActive ? 'rgba(239, 68, 68, 0.1)' : 'transparent')};
  color: ${props => (props.$isActive ? RED : SLATE)};
  font-size: 0.88rem;
  font-weight: ${props => (props.$isActive ? '800' : '600')};
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 4px;

  &:hover {
    background: rgba(239, 68, 68, 0.08);
    color: ${RED};
  }

  .left-content {
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

export const CavesSidebar: React.FC<CavesSidebarProps> = ({
  activeDept = 'dashboard',
  onSelectDept,
  userClearance = 3,
  isMD = true,
}) => {
  const visibleDepts = DEPARTMENTS_LIST.filter(
    d => isMD || userClearance >= d.clearanceLevel
  );

  return (
    <SidebarContainer>
      <SectionHeader>12 Operational Departments</SectionHeader>
      <nav style={{ flex: 1, overflowY: 'auto' }}>
        {visibleDepts.map(dept => {
          const isActive = activeDept === dept.id;
          return (
            <NavItemBtn
              key={dept.id}
              $isActive={isActive}
              onClick={() => onSelectDept?.(dept.id)}
            >
              <div className="left-content">
                {dept.icon}
                <span>{dept.name}</span>
              </div>
              {isActive && <ChevronRight size={14} color={RED} />}
            </NavItemBtn>
          );
        })}
      </nav>
    </SidebarContainer>
  );
};

export default CavesSidebar;
