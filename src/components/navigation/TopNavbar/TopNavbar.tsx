/**
 * TopNavbar.tsx — Pure Presentational View (Fixed Top Navbar with 50% Overhanging Logo)
 */

import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import {
  NavHeaderContainer,
  OverhangingLogoWrapper,
  OverhangingCircularLogo,
  NavSearchBox,
  ThemeToggleButton,
} from './styles/TopNavbar.style';
import { useTopNavbarLogic } from './logic/TopNavbar.logic';
import { TOP_NAVBAR_DATA } from './data/TopNavbar.data';
import { Search, Sun, Moon, Bell, Shield, User, Globe, LogOut } from 'lucide-react';

export const TopNavbar: FC = () => {
  const {
    user,
    isMaster,
    isDark,
    toggleTheme,
    language,
    setLanguage,
    searchQuery,
    setSearchQuery,
    searchInputRef,
    handleSearchSubmit,
    isImpersonating,
    impersonatedRole,
    resetImpersonation,
    handleLogout,
  } = useTopNavbarLogic();

  return (
    <NavHeaderContainer $isDark={isDark} data-testid="top-navbar-fixed" role="banner">
      {/* ── Left: Overhanging Circular Logo (50% Vertical Overhang) ───────── */}
      <div className="flex items-center gap-6">
        <OverhangingLogoWrapper>
          <Link to={TOP_NAVBAR_DATA.homeRoute} aria-label={TOP_NAVBAR_DATA.brandAlt}>
            <OverhangingCircularLogo>
              <img
                src={`${import.meta.env.BASE_URL || '/'}company-logo.jpg`.replace('//', '/')}
                alt="White Caves"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
                className="w-full h-full object-cover rounded-full"
              />
              <span className="sr-only">White Caves Real Estate</span>
            </OverhangingCircularLogo>
          </Link>
        </OverhangingLogoWrapper>

        {/* Impersonation Indicator if active */}
        {isImpersonating && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500 text-amber-500 text-xs font-extrabold">
            <span>VIEWING AS: {impersonatedRole}</span>
            <button
              onClick={resetImpersonation}
              className="ml-1 text-[10px] underline hover:text-amber-400"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* ── Center: Search Box ────────────────────────────────────────────── */}
      <NavSearchBox $isDark={isDark} onSubmit={handleSearchSubmit}>
        <Search className="w-4 h-4 text-red-500 flex-shrink-0" />
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={TOP_NAVBAR_DATA.searchPlaceholder}
          className="w-full bg-transparent border-none outline-none text-xs font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400"
        />
        <span className="text-[10px] font-bold text-slate-400 border border-slate-300 dark:border-slate-700 px-1 rounded">
          {TOP_NAVBAR_DATA.searchShortcut}
        </span>
      </NavSearchBox>

      {/* ── Right: Theme, Language, Notifications, Profile ─────────────────── */}
      <div className="flex items-center gap-3">
        {/* Language Switcher */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          title="Toggle Language (EN / AR)"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-800 hover:border-red-500 text-slate-700 dark:text-slate-300 transition-colors"
        >
          <Globe className="w-3.5 h-3.5 text-red-500" />
          <span>{language.toUpperCase()}</span>
        </button>

        {/* Theme Toggle Button */}
        <ThemeToggleButton
          $isDark={isDark}
          onClick={toggleTheme}
          title={isDark ? TOP_NAVBAR_DATA.themeToggleTitle.dark : TOP_NAVBAR_DATA.themeToggleTitle.light}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </ThemeToggleButton>

        {/* Notifications Icon */}
        <Link
          to="/crm/notifications"
          title={TOP_NAVBAR_DATA.notificationsTitle}
          className="relative p-2 rounded-full hover:bg-red-500/10 text-slate-600 dark:text-slate-300 hover:text-red-500 transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        </Link>

        {/* User Card */}
        {user ? (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <Link
              to="/crm/profile"
              className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-red-500 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-black">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <span className="hidden md:inline truncate max-w-[100px]">{user.name}</span>
            </Link>
          </div>
        ) : (
          <Link
            to="/login"
            className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
    </NavHeaderContainer>
  );
};

export default TopNavbar;
