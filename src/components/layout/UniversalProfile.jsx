import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';
import { setActiveRole, closeAllMenus, setTheme } from '../../store/navigationSlice';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import {
  UniversalProfileContainer,
  ProfileSignInBtn,
  ProfileTrigger,
  ProfileAvatar,
  AvatarImg,
  AvatarInitials,
  ProfileArrow,
  ProfileDropdown,
  ProfileDropdownHeader,
  ProfileInfo,
  ProfileName,
  ProfileEmail,
  ProfileRole,
  ProfileDropdownDivider,
  ProfileDropdownItem,
  ProfileDropdownItemLink,
  DropdownIcon,
  ProfileArrowDark,
} from './UniversalProfile/styles';

export default function UniversalProfile({ variant = 'default', showSignIn = true }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.currentUser);
  const { activeRole, theme } = useSelector(state => state.navigation);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    dispatch(setTheme(newTheme));
  };
  
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name, email) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return '?';
  };

  const getRoleInfo = (role) => {
    const roles = {
      'buyer': { label: 'Buyer', icon: '🏠', color: '#3b82f6' },
      'seller': { label: 'Seller', icon: '💰', color: '#10b981' },
      'landlord': { label: 'Landlord', icon: '🔑', color: '#8b5cf6' },
      'tenant': { label: 'Tenant', icon: '🏡', color: '#06b6d4' },
      'leasing-agent': { label: 'Leasing Agent', icon: '📋', color: '#f59e0b' },
      'secondary-sales-agent': { label: 'Sales Agent', icon: '🏢', color: '#ef4444' },
      'owner': { label: 'Owner', icon: '👑', color: '#ffd700' },
    };
    return roles[role] || null;
  };

  const handleLogout = async () => {
    setMenuOpen(false);
    try {
      await signOut(auth);
      localStorage.removeItem('userRole');
      dispatch(setUser(null));
      dispatch(setActiveRole(null));
      dispatch(closeAllMenus());
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const roleInfo = getRoleInfo(activeRole);

  if (!user) {
    if (!showSignIn) return null;
    
    return (
      <UniversalProfileContainer>
        <ProfileSignInBtn to="/signin">
          Sign In
        </ProfileSignInBtn>
      </UniversalProfileContainer>
    );
  }

  return (
    <UniversalProfileContainer $compact={variant === 'compact'} ref={menuRef}>
      <ProfileTrigger 
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="User menu"
        className={variant === 'compact' ? 'compact' : ''}
      >
        <ProfileAvatar>
          {user.photoURL || user.photo ? (
            <AvatarImg 
              src={user.photoURL || user.photo} 
              alt={user.displayName || user.name || 'User'} 
            />
          ) : (
            <AvatarInitials>
              {getInitials(user.displayName || user.name, user.email)}
            </AvatarInitials>
          )}
        </ProfileAvatar>
        {variant !== 'compact' && (
          <ProfileArrow>{menuOpen ? '▲' : '▼'}</ProfileArrow>
        )}
      </ProfileTrigger>

      {menuOpen && (
        <ProfileDropdown>
          <ProfileDropdownHeader>
            <ProfileAvatar $large>
              {user.photoURL || user.photo ? (
                <AvatarImg 
                  src={user.photoURL || user.photo} 
                  alt={user.displayName || user.name || 'User'} 
                />
              ) : (
                <AvatarInitials $large>
                  {getInitials(user.displayName || user.name, user.email)}
                </AvatarInitials>
              )}
            </ProfileAvatar>
            <ProfileInfo>
              <ProfileName>{user.displayName || user.name || 'User'}</ProfileName>
              <ProfileEmail>{user.email}</ProfileEmail>
              {roleInfo && (
                <ProfileRole style={{ color: roleInfo.color }}>
                  {roleInfo.icon} {roleInfo.label}
                </ProfileRole>
              )}
            </ProfileInfo>
          </ProfileDropdownHeader>

          <ProfileDropdownDivider />

          <ProfileDropdownItem 
            onClick={toggleTheme}
          >
            <DropdownIcon>{theme === 'dark' ? '☀️' : '🌙'}</DropdownIcon>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </ProfileDropdownItem>

          <ProfileDropdownItemLink 
            to="/profile" 
            onClick={() => setMenuOpen(false)}
          >
            <DropdownIcon>👤</DropdownIcon>
            My Profile
          </ProfileDropdownItemLink>

          <ProfileDropdownItemLink 
            to="/select-role" 
            onClick={() => setMenuOpen(false)}
          >
            <DropdownIcon>🔄</DropdownIcon>
            {activeRole ? 'Switch Role' : 'Select Role'}
          </ProfileDropdownItemLink>

          {activeRole && (
            <ProfileDropdownItemLink 
              to={`/${activeRole}/dashboard`} 
              onClick={() => setMenuOpen(false)}
            >
              <DropdownIcon>📊</DropdownIcon>
              Dashboard
            </ProfileDropdownItemLink>
          )}

          <ProfileDropdownDivider />

          <ProfileDropdownItem 
            $logout
            onClick={handleLogout}
          >
            <DropdownIcon>🚪</DropdownIcon>
            Sign Out
          </ProfileDropdownItem>
        </ProfileDropdown>
      )}
    </UniversalProfileContainer>
  );
}
