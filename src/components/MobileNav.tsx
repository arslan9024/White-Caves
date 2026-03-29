import React, { useState, useEffect, useRef, FC } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { safeStorage } from '../utils/safeStorage';
import { PUBLIC_NAV, ROLE_NAV, getRoleCategory } from '../config/navigation';
import type { NavItem } from '../config/navigation';
import * as S from './MobileNav.styles';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav: FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { isDark, setIsDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.user?.currentUser);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      clearTimeout(scrollTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const parsed = safeStorage.getJSON<{ role: string }>('userRole');
    if (parsed) {
      setUserRole(parsed.role);
    } else {
      setUserRole(null);
    }
  }, [user]);

  const handleNavClick = (path: string) => {
    if (path.startsWith('#')) {
      onClose();
      if (location.pathname !== '/') {
        navigate('/');
        scrollTimerRef.current = setTimeout(() => {
          document.querySelector(path)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.querySelector(path)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
      onClose();
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const roleNav = userRole ? ROLE_NAV[userRole] : null;
  const roleCategory = getRoleCategory(userRole ?? '');

  return (
    <S.MobileNavOverlay $isOpen={isOpen} onClick={onClose}>
      <S.MobileNavContainer $isOpen={isOpen} onClick={(e) => e.stopPropagation()}>
        <S.MobileNavHeader>
          <S.MobileNavLogo src="/company-logo.jpg" alt="White Caves" />
          <S.CloseButton onClick={onClose}>×</S.CloseButton>
        </S.MobileNavHeader>

        <S.MobileNavContent>
          <S.MobileHomeButton onClick={() => handleNavClick('/')}>
            <span>🏠</span> Home
          </S.MobileHomeButton>

          <S.MobileNavSection>
            <S.SectionToggle 
              $expanded={expandedSection === 'explore'}
              onClick={() => toggleSection('explore')}
              aria-expanded={expandedSection === 'explore'}
            >
              <span>🔍 Explore</span>
              <S.ToggleIcon>{expandedSection === 'explore' ? '−' : '+'}</S.ToggleIcon>
            </S.SectionToggle>
            {expandedSection === 'explore' && (
              <S.SectionLinks>
                {PUBLIC_NAV.buy?.map((item: NavItem) => (
                  <S.SectionLink key={item.path} onClick={() => handleNavClick(item.path)}>
                    <span>{item.icon}</span> {item.label}
                  </S.SectionLink>
                ))}
              </S.SectionLinks>
            )}
          </S.MobileNavSection>

          <S.MobileNavSection>
            <S.SectionToggle 
              $expanded={expandedSection === 'rent'}
              onClick={() => toggleSection('rent')}
              aria-expanded={expandedSection === 'rent'}
            >
              <span>🔑 Rent</span>
              <S.ToggleIcon>{expandedSection === 'rent' ? '−' : '+'}</S.ToggleIcon>
            </S.SectionToggle>
            {expandedSection === 'rent' && (
              <S.SectionLinks>
                {PUBLIC_NAV.rent?.map((item: NavItem) => (
                  <S.SectionLink key={item.path} onClick={() => handleNavClick(item.path)}>
                    <span>{item.icon}</span> {item.label}
                  </S.SectionLink>
                ))}
              </S.SectionLinks>
            )}
          </S.MobileNavSection>

          <S.MobileNavSection>
            <S.SectionToggle 
              $expanded={expandedSection === 'sell'}
              onClick={() => toggleSection('sell')}
              aria-expanded={expandedSection === 'sell'}
            >
              <span>💰 Sell</span>
              <S.ToggleIcon>{expandedSection === 'sell' ? '−' : '+'}</S.ToggleIcon>
            </S.SectionToggle>
            {expandedSection === 'sell' && (
              <S.SectionLinks>
                {PUBLIC_NAV.sell?.map((item: NavItem) => (
                  <S.SectionLink key={item.path} onClick={() => handleNavClick(item.path)}>
                    <span>{item.icon}</span> {item.label}
                  </S.SectionLink>
                ))}
              </S.SectionLinks>
            )}
          </S.MobileNavSection>

          {user && roleNav && (
            <S.MobileNavSection>
              <S.SectionToggle 
                $expanded={expandedSection === 'dashboard'}
                onClick={() => toggleSection('dashboard')}
                aria-expanded={expandedSection === 'dashboard'}
              >
                <span>{roleNav.icon} My {roleNav.label}</span>
                <S.ToggleIcon>{expandedSection === 'dashboard' ? '−' : '+'}</S.ToggleIcon>
              </S.SectionToggle>
              {expandedSection === 'dashboard' && (
                <S.SectionLinks>
                  {roleNav.links?.map((item: NavItem) => (
                    <S.SectionLink key={item.path} onClick={() => handleNavClick(item.path)}>
                      <span>{item.icon}</span> {item.label}
                    </S.SectionLink>
                  ))}
                </S.SectionLinks>
              )}
            </S.MobileNavSection>
          )}

          <S.MobileNavSection>
            <S.SectionLink onClick={() => handleNavClick('/properties')}>
              <span>🏢</span> Properties
            </S.SectionLink>
            <S.SectionLink onClick={() => handleNavClick('/about')}>
              <span>ℹ️</span> About Us
            </S.SectionLink>
            <S.SectionLink onClick={() => handleNavClick('/services')}>
              <span>⚙️</span> Services
            </S.SectionLink>
            <S.SectionLink onClick={() => handleNavClick('/careers')}>
              <span>💼</span> Careers
            </S.SectionLink>
            <S.SectionLink onClick={() => handleNavClick('/contact')}>
              <span>📞</span> Contact Us
            </S.SectionLink>
          </S.MobileNavSection>

          <S.MobileNavFooter>
            <S.FooterButton onClick={() => setIsDark(!isDark)}>
              {isDark ? '🌞 Light Mode' : '🌙 Dark Mode'}
            </S.FooterButton>

            {!user ? (
              <S.FooterButton onClick={() => handleNavClick('/signin')}>
                🔐 Sign In
              </S.FooterButton>
            ) : (
              <S.FooterButton onClick={() => handleNavClick('/profile')}>
                👤 My Profile
              </S.FooterButton>
            )}
          </S.MobileNavFooter>
        </S.MobileNavContent>
      </S.MobileNavContainer>
    </S.MobileNavOverlay>
  );
};

export default MobileNav;
