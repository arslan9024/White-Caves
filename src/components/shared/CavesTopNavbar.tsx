import React from 'react';
import styled from 'styled-components';
import { Search, Bell, User } from 'lucide-react';

const RED = '#EF4444';
const SLATE = '#1E293B';

export interface CavesTopNavbarProps {
  onSearchClick?: () => void;
  userRole?: string;
  userName?: string;
  tickerText?: string;
}

const NavbarContainer = styled.header`
  position: sticky;
  top: 0;
  z-index: 1000;
  height: 64px;
  background: #FFFFFF;
  border-bottom: 1.5px solid rgba(239, 68, 68, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 900;
  font-size: 1.2rem;
  color: ${SLATE};
  cursor: pointer;

  .logo-box {
    background: ${RED};
    color: #FFFFFF;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    font-weight: 900;
  }
`;

const SearchPill = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 9999px;
  padding: 8px 18px;
  color: #64748B;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${RED};
    color: ${SLATE};
    background: #FFFFFF;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1);
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconBtn = styled.button`
  background: #F1F5F9;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${SLATE};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
    color: ${RED};
  }
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${RED};
  color: #FFFFFF;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
`;

export const CavesTopNavbar: React.FC<CavesTopNavbarProps> = ({
  onSearchClick,
  userName = 'Arslan Malik',
  userRole = 'Managing Director',
}) => {
  return (
    <NavbarContainer>
      <Brand>
        <div className="logo-box">WC</div>
        <span>WHITE CAVES</span>
      </Brand>

      <SearchPill onClick={onSearchClick}>
        <Search size={15} color={RED} />
        <span>Search properties, deals & leads...</span>
        <kbd style={{ background: 'var(--color-e2e8f0, #E2E8F0)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>
          Ctrl+K
        </kbd>
      </SearchPill>

      <UserMenu>
        <IconBtn aria-label="Notifications">
          <Bell size={18} />
        </IconBtn>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Avatar>{userName.charAt(0)}</Avatar>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: SLATE }}>{userName}</span>
            <span style={{ fontSize: '0.7rem', color: RED, fontWeight: 700 }}>{userRole}</span>
          </div>
        </div>
      </UserMenu>
    </NavbarContainer>
  );
};

export default CavesTopNavbar;
