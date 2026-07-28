import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { PUBLIC_NAV } from '../../../config/navigation';
import type { NavItem } from '../../../config/navigation';
import { useLanguage } from '../../../context/LanguageContext';
import { selectSessionUser } from '../../../store/selectors/sessionSelectors';
import { logout } from '../../../store/authSlice';
import LanguageSwitcher from '../../ui/LanguageSwitcher';
import './PublicNavbar.css';

// ---------------------------------------------------------------------------
// Dropdown menu config – each top-level item may have a sub-menu
// ---------------------------------------------------------------------------
interface DropdownGroup {
  label: string;
  path: string;
  children?: NavItem[];
}

// ---------------------------------------------------------------------------
// DropdownItem component (desktop)
// ---------------------------------------------------------------------------
interface DropdownNavItemProps {
  group: DropdownGroup;
}

const DropdownNavItem: React.FC<DropdownNavItemProps> = ({ group }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  if (!group.children?.length) {
    return (
      <NavLink
        to={group.path}
        className={({ isActive }) => `public-navbar__link${isActive ? ' active' : ''}`}
      >
        {group.label}
      </NavLink>
    );
  }

  return (
    <div
      ref={ref}
      className={`public-navbar__dropdown-wrap${open ? ' open' : ''}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <NavLink
        to={group.path}
        className={({ isActive }) =>
          `public-navbar__link public-navbar__link--has-caret${isActive ? ' active' : ''}`
        }
        onClick={() => setOpen(false)}
        aria-haspopup="menu"
      >
        {group.label}
        <svg
          className="public-navbar__caret"
          aria-hidden="true"
          width="10"
          height="6"
          viewBox="0 0 10 6"
        >
          <path
            d="M1 1l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </NavLink>

      {open && (
        <div className="public-navbar__dropdown">
          {group.children!.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className="public-navbar__dropdown-item"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <span className="public-navbar__dropdown-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main PublicNavbar component
// ---------------------------------------------------------------------------
const PublicNavbar = (): React.JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectSessionUser);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [currency, setCurrency] = useState<'AED' | 'USD' | 'EUR' | 'GBP'>('AED');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const baseUrl = import.meta.env.BASE_URL || '/';
  const logoSrc = `${baseUrl}company-logo.jpg`.replace('//', '/');
  const { t } = useLanguage();

  // Build translated nav arrays inside the component so they re-render on language change
  const desktopNav: DropdownGroup[] = [
    { label: t('common.home'), path: '/' },
    {
      label: t('common.properties'),
      path: '/properties',
      children: [...PUBLIC_NAV.buy.slice(0, 3), ...PUBLIC_NAV.rent.slice(0, 2)],
    },
    { label: t('nav.services'), path: '/services' },
    {
      label: t('nav.company'),
      path: '/about',
      children: PUBLIC_NAV.company as unknown as NavItem[],
    },
    { label: t('common.contact'), path: '/contact' },
  ];

  const mobileSections = [
    { title: t('common.home'), items: PUBLIC_NAV.main.slice(0, 3) },
    { title: t('property.forSale'), items: PUBLIC_NAV.buy },
    { title: t('property.forRent'), items: PUBLIC_NAV.rent },
    { title: t('common.properties'), items: PUBLIC_NAV.sell },
    { title: t('nav.company'), items: PUBLIC_NAV.company },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll + Escape key when mobile menu is open
  useEffect(() => {
    if (!isMobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileOpen(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [isMobileOpen]);

  return (
    <header className="public-navbar" role="banner">
      <div className="public-navbar__inner">
        {/* Brand / Logo */}
        <Link to="/" className="public-navbar__brand" aria-label="White Caves Home">
          <img
            src={logoSrc}
            alt="White Caves Real Estate LLC"
            className="public-navbar__brand-logo"
            loading="lazy"
            width={42}
            height={42}
          />
          <span className="public-navbar__brand-name">
            <span className="public-navbar__brand-line1">White Caves</span>
            <span className="public-navbar__brand-line2">Real Estate LLC</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="public-navbar__desktop-nav" aria-label="Primary navigation">
          {desktopNav.map(group => (
            <DropdownNavItem key={group.path} group={group} />
          ))}
        </nav>

        {/* Desktop CTA actions */}
        <div className="public-navbar__actions">
          {/* Quick Search Button */}
          <button
            type="button"
            onClick={() => navigate('/properties')}
            className="public-navbar__search-btn"
            title="Search properties across Dubai"
          >
            <span>🔍</span>
            <span className="public-navbar__search-label">Search</span>
          </button>

          {/* Currency Switcher */}
          <div className="public-navbar__currency-selector">
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value as any)}
              className="public-navbar__currency-select"
              aria-label="Select currency"
            >
              <option value="AED">🇦🇪 AED</option>
              <option value="USD">🇺🇸 USD</option>
              <option value="EUR">🇪🇺 EUR</option>
              <option value="GBP">🇬🇧 GBP</option>
            </select>
          </div>

          <LanguageSwitcher />

          {/* WhatsApp Live Agent Hotline */}
          <a
            href="https://wa.me/971500000000?text=Hello%20White%20Caves%2C%20I%20am%20interested%20in%20Dubai%20Luxury%20Properties"
            target="_blank"
            rel="noopener noreferrer"
            className="public-navbar__whatsapp-btn"
            title="Direct WhatsApp Hotline"
          >
            <span className="public-navbar__whatsapp-dot" />
            💬 VIP Hotline
          </a>

          <Link to="/services#sell" className="public-navbar__list-btn">
            {t('nav.listProperty')}
          </Link>

          {/* User Account / Sign In State */}
          {user ? (
            <div className="public-navbar__user-menu-wrap" ref={userMenuRef}>
              <button
                type="button"
                className="public-navbar__user-btn"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <img
                  src={
                    user.photoURL ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name || user.email || 'A'
                    )}&background=EF4444&color=fff`
                  }
                  alt={user.name || 'User Avatar'}
                  className="public-navbar__user-avatar"
                />
                <span className="public-navbar__user-name">{user.name?.split(' ')[0] || 'Account'}</span>
              </button>

              {isUserMenuOpen && (
                <div className="public-navbar__user-dropdown">
                  <div className="public-navbar__user-info">
                    <p className="public-navbar__user-fullname">{user.name || 'Executive User'}</p>
                    <p className="public-navbar__user-email">{user.email}</p>
                  </div>
                  <hr className="public-navbar__user-divider" />
                  <Link
                    to="/profile"
                    className="public-navbar__user-dropdown-item"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    👤 My Profile
                  </Link>
                  <Link
                    to="/crm"
                    className="public-navbar__user-dropdown-item"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    🚀 CRM Cockpit
                  </Link>
                  <button
                    type="button"
                    className="public-navbar__user-dropdown-item public-navbar__user-dropdown-item--logout"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      dispatch(logout());
                      navigate('/');
                    }}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/signin" className="public-navbar__signin">
              {t('nav.signIn')}
            </Link>
          )}

          {/* Hamburger — mobile only */}
          <button
            type="button"
            className={`public-navbar__menu-btn${isMobileOpen ? ' is-open' : ''}`}
            onClick={() => setIsMobileOpen(prev => !prev)}
            aria-controls="public-mobile-menu"
            aria-label="Toggle navigation menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile overlay + drawer */}
      {isMobileOpen && (
        <>
          <button
            type="button"
            className="public-navbar__overlay"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close menu overlay"
          />
          <div
            id="public-mobile-menu"
            className="public-navbar__mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            {/* Drawer header */}
            <div className="public-navbar__mobile-head">
              <Link
                to="/"
                className="public-navbar__mobile-brand"
                onClick={() => setIsMobileOpen(false)}
              >
                <img
                  src={logoSrc}
                  alt="White Caves"
                  width={32}
                  height={32}
                  className="public-navbar__brand-logo"
                />
                <strong>White Caves</strong>
              </Link>
              <button
                type="button"
                className="public-navbar__close-btn"
                onClick={() => setIsMobileOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            {/* Drawer body — grouped sections */}
            <div className="public-navbar__mobile-body">
              {mobileSections.map(section => (
                <div key={section.title} className="public-navbar__mobile-section">
                  <p className="public-navbar__mobile-section-title">{section.title}</p>
                  <nav aria-label={`${section.title} navigation`}>
                    {section.items.map(item => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                          `public-navbar__mobile-link${isActive ? ' active' : ''}`
                        }
                      >
                        <span className="public-navbar__mobile-link-icon" aria-hidden="true">
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                        <span className="public-navbar__mobile-link-arrow" aria-hidden="true">
                          ›
                        </span>
                      </NavLink>
                    ))}
                  </nav>
                </div>
              ))}
            </div>

            {/* Drawer footer CTA */}
            <div className="public-navbar__mobile-footer">
              <LanguageSwitcher className="lang-switcher--mobile" />
              <Link
                to="/services#sell"
                className="public-navbar__mobile-list-btn"
                onClick={() => setIsMobileOpen(false)}
              >
                📋 {t('nav.listProperty')}
              </Link>
              <Link
                to="/signin"
                className="public-navbar__mobile-signin"
                onClick={() => setIsMobileOpen(false)}
              >
                {t('nav.signIn')}
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default PublicNavbar;
