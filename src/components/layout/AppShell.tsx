import React, { FC } from 'react';
import styled from 'styled-components';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, Megaphone, Activity, BarChart2, Briefcase, FileText, Settings, Search, Bell, User } from 'lucide-react';

const ShellWrap = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #0F172A;
  color: #F8FAFC;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
`;

const Sidebar = styled.aside`
  width: 260px;
  background-color: rgba(30, 41, 59, 0.7);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(12px);
  z-index: 10;
`;

const Brand = styled.div`
  padding: 24px;
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: 1px;
  background: linear-gradient(90deg, #F8FAFC, #94A3B8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const NavList = styled.nav`
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  color: #94A3B8;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    color: #F8FAFC;
  }

  &.active {
    background-color: rgba(56, 189, 248, 0.1);
    color: #38BDF8;
    border-left: 3px solid #38BDF8;
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.header`
  height: 72px;
  background-color: rgba(15, 23, 42, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  backdrop-filter: blur(8px);
  z-index: 5;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 8px 16px;
  border-radius: 24px;
  width: 300px;
  border: 1px solid rgba(255, 255, 255, 0.05);

  input {
    background: transparent;
    border: none;
    outline: none;
    color: #F8FAFC;
    font-family: inherit;
    width: 100%;
    
    &::placeholder {
      color: #64748B;
    }
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  color: #94A3B8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: color 0.2s;

  &:hover {
    color: #F8FAFC;
  }

  &::after {
    content: '';
    position: absolute;
    top: -2px;
    right: -2px;
    width: 8px;
    height: 8px;
    background-color: #EF4444;
    border-radius: 50%;
    border: 2px solid #0F172A;
    display: none;
  }

  &[data-has-notification="true"]::after {
    display: block;
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #38BDF8;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0F172A;
  font-weight: 800;
  cursor: pointer;
`;

const ContentScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 32px;
  position: relative;
`;

import { PWAInstallPrompt } from '../pwa/PWAInstallPrompt';
import { OfflineAlertBanner } from '../pwa/OfflineAlertBanner/OfflineAlertBanner';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { clearNotifications } from '../../store/slices/uiSlice';

export const AppShell: FC = () => {
  const dispatch = useAppDispatch();
  const unreadCount = useAppSelector(state => state.ui.unreadNotifications);

  return (
    <ShellWrap>
      <OfflineAlertBanner />
      <Sidebar>
        <Brand>
          <Activity size={28} color="#38BDF8" />
          WhiteCaves
        </Brand>
        <NavList>
          <StyledNavLink to="/" end><Home size={18} /> Dashboard</StyledNavLink>
          <StyledNavLink to="/marketing"><Megaphone size={18} /> Marketing</StyledNavLink>
          <StyledNavLink to="/sales"><Briefcase size={18} /> Sales & AI</StyledNavLink>
          <StyledNavLink to="/off-plan"><BarChart2 size={18} /> Off-Plan Tools</StyledNavLink>
          <StyledNavLink to="/documents"><FileText size={18} /> Documents</StyledNavLink>
          <StyledNavLink to="/feature-status"><Activity size={18} /> System Health</StyledNavLink>
          <StyledNavLink to="/settings"><Settings size={18} /> Settings</StyledNavLink>
        </NavList>
      </Sidebar>

      <MainContent>
        <Header>
          <SearchBox>
            <Search size={16} color="#64748B" />
            <input type="text" placeholder="Search leads, properties, deals..." />
          </SearchBox>
          <HeaderActions>
            <IconButton 
              data-has-notification={unreadCount > 0} 
              onClick={() => dispatch(clearNotifications())}
            >
              <Bell size={20} />
            </IconButton>
            <UserAvatar>
              <User size={20} />
            </UserAvatar>
          </HeaderActions>
        </Header>
        <ContentScroll>
          <Outlet />
        </ContentScroll>
      </MainContent>
      <PWAInstallPrompt />
    </ShellWrap>
  );
};
