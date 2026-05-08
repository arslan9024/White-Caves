/**
 * PortalNavbar — Phase 2.12: Portal-Specific Navigation Bar
 *
 * Lightweight top navbar for Landlord & Tenant self-service portals.
 * Replaces the full CRM AppLayout navbar for portal routes.
 *
 * Features:
 * - White Caves logo
 * - Portal name badge ("Landlord Portal" / "Tenant Portal")
 * - Logged-in user name + avatar initial
 * - Logout button
 * - Profile link
 *
 * @component
 */

import React, { FC, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { setUser } from '../../store/userSlice';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import { safeStorage } from '../../utils/safeStorage';

export type PortalType = 'landlord' | 'tenant';

interface PortalNavbarProps {
  /** Which portal this navbar belongs to — controls badge label */
  portalType: PortalType;
}

const PORTAL_LABELS: Record<PortalType, string> = {
  landlord: 'Landlord Portal',
  tenant: 'Tenant Portal',
};

const PORTAL_COLORS: Record<PortalType, string> = {
  landlord: '#C41E3A',
  tenant: '#0f766e',
};

const PortalNavbar: FC<PortalNavbarProps> = ({ portalType }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const handleLogout = useCallback(async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
      safeStorage.remove('userRole');
      dispatch(setUser(null));
      navigate('/signin', { replace: true });
    } catch {
      // silently handle logout errors
    }
  }, [dispatch, navigate]);

  const avatarInitial = currentUser?.name?.charAt(0)?.toUpperCase() ?? '?';
  // eslint-disable-next-line security/detect-object-injection
  const portalLabel = PORTAL_LABELS[portalType];
  // eslint-disable-next-line security/detect-object-injection
  const badgeColor = PORTAL_COLORS[portalType];

  return (
    <nav
      className="portal-navbar"
      aria-label={`${portalLabel} Navigation`}
      data-testid="portal-navbar"
    >
      {/* Left: Logo + portal badge */}
      <div className="portal-navbar__brand">
        <Link to="/" className="portal-navbar__logo" aria-label="White Caves – go to homepage">
          <img
            src="/company-logo.jpg"
            alt="White Caves Real Estate"
            width={36}
            height={36}
            style={{ borderRadius: '6px', objectFit: 'cover' }}
            onError={e => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
          <span className="portal-navbar__company">White Caves</span>
        </Link>

        <span
          className="portal-navbar__badge"
          style={{ backgroundColor: badgeColor }}
          data-testid="portal-navbar-badge"
        >
          {portalLabel}
        </span>
      </div>

      {/* Right: user info + actions */}
      <div className="portal-navbar__actions">
        {currentUser && (
          <>
            <Link
              to="/profile"
              className="portal-navbar__user"
              aria-label={`View profile for ${currentUser.name}`}
              data-testid="portal-navbar-user"
            >
              <span className="portal-navbar__avatar" aria-hidden="true">
                {avatarInitial}
              </span>
              <span className="portal-navbar__username">{currentUser.name}</span>
            </Link>

            <button
              type="button"
              className="portal-navbar__logout"
              onClick={() => void handleLogout()}
              aria-label="Logout from portal"
              data-testid="portal-navbar-logout"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default PortalNavbar;
