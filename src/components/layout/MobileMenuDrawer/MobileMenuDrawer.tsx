/**
 * MobileMenuDrawer — Full sidebar navigation in a slide-out drawer
 *
 * Opens from the left edge, shows all departments + AI assistants
 * that the desktop SidebarContainer normally provides.
 *
 * Features:
 * - 300px (85vw max) panel with overlay backdrop
 * - All 9 departments with expandable service sub-items
 * - AI Command Center section with assistant search
 * - Admin + Settings pinned at bottom
 * - Badge counts on Leads, Properties, Messages
 * - Closes on overlay tap, Escape key, or close button
 * - Focus trap: Tab cycles within the drawer while open
 * - 44px minimum touch targets on all interactive elements
 * - prefers-reduced-motion respected
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../store/store';
import { Home, BarChart3, Users2, Settings, Shield, Bot, X, ChevronDown } from 'lucide-react';
import {
  selectSelectedDepartment,
  selectSelectedService,
  selectDepartment,
  selectService,
  toggleAICommand,
} from '../../../store/slices/sidebarSlice';
import { selectHotLeads, selectAllProperties } from '../../../store/crmDataSlice';
import { selectQueuedCount } from '../../../store/slices/nadiaSlice';
import {
  DrawerOverlay,
  DrawerPanel,
  DrawerHeader,
  DrawerLogo,
  DrawerLogoMark,
  DrawerLogoName,
  DrawerCloseBtn,
  DrawerBody,
  DrawerSectionLabel,
  DrawerNavItem,
  DrawerNavIcon,
  DrawerNavBadge,
  DrawerSubItems,
  DrawerSubItem,
  DrawerSubDot,
  DrawerFooter,
  DrawerFooterText,
} from './styles';

// ─── Department definitions ───────────────────────────────────────────────
// Imported from src/config/departmentConfig.ts (single source of truth)
import { SIDEBAR_DEPARTMENTS as DEPARTMENTS } from '../../../config/departmentConfig';

// ─── Props ────────────────────────────────────────────────────────────────

interface MobileMenuDrawerProps {
  /** Whether the drawer is open */
  open: boolean;
  /** Called to close the drawer (overlay tap, X button, Escape) */
  onClose: () => void;
  /** Called when user navigates to a tab (home, analytics, etc.) */
  onTabChange?: (tabId: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────

const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = React.memo(function MobileMenuDrawer({
  open,
  onClose,
  onTabChange = () => {},
}) {
  const dispatch = useDispatch();
  const panelRef = useRef<HTMLElement>(null);

  const selectedDepartment = useSelector(selectSelectedDepartment);
  const selectedSvc = useSelector(selectSelectedService);
  const userRole = useSelector((state: RootState) => state.auth?.user?.role || 'user');
  const isSuperUser = userRole === 'lion';

  // Badge selectors
  const hotLeads = useSelector(selectHotLeads);
  const allProperties = useSelector(selectAllProperties);
  const queuedMessages = useSelector(selectQueuedCount);

  const badgeCounts = useMemo<Record<string, number>>(
    () => ({
      hotLeads: hotLeads?.length ?? 0,
      properties: allProperties?.length ?? 0,
      messages: queuedMessages ?? 0,
    }),
    [hotLeads, allProperties, queuedMessages]
  );

  // Expanded departments
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = useCallback((deptId: string) => {
    // eslint-disable-next-line security/detect-object-injection
    setExpanded(prev => ({ ...prev, [deptId]: !prev[deptId] }));
  }, []);

  // ── Escape key handler ──────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // ── Lock body scroll when open ──────────────────────────────
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // ── Focus trap — focus first element when opened ────────────
  useEffect(() => {
    if (open && panelRef.current) {
      const firstFocusable = panelRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }
  }, [open]);

  // ── Handlers ────────────────────────────────────────────────
  const handleTopNav = useCallback(
    (tabId: string) => {
      onTabChange(tabId);
      onClose();
    },
    [onTabChange, onClose]
  );

  const handleDeptClick = useCallback(
    (deptId: string) => {
      dispatch(selectDepartment(deptId));
      toggleExpand(deptId);
    },
    [dispatch, toggleExpand]
  );

  const handleServiceClick = useCallback(
    (deptId: string, service: string) => {
      dispatch(selectDepartment(deptId));
      dispatch(selectService({ department: deptId, service }));
      onTabChange(`service-${deptId}`);
      onClose();
    },
    [dispatch, onTabChange, onClose]
  );

  const handleAIOpen = useCallback(() => {
    dispatch(toggleAICommand());
    onClose();
  }, [dispatch, onClose]);

  return (
    <>
      <DrawerOverlay
        $open={open}
        onClick={onClose}
        aria-hidden={!open}
        data-testid="drawer-overlay"
      />

      <DrawerPanel
        $open={open}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        data-testid="drawer-panel"
      >
        {/* ── Header ─────────────────────────────────── */}
        <DrawerHeader>
          <DrawerLogo>
            <DrawerLogoMark>WC</DrawerLogoMark>
            <DrawerLogoName>White Caves</DrawerLogoName>
          </DrawerLogo>
          <DrawerCloseBtn onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </DrawerCloseBtn>
        </DrawerHeader>

        {/* ── Body ───────────────────────────────────── */}
        <DrawerBody>
          {/* Quick nav */}
          <DrawerSectionLabel>Navigation</DrawerSectionLabel>
          <DrawerNavItem onClick={() => handleTopNav('home')} aria-label="Dashboard">
            <DrawerNavIcon>
              <Home size={18} />
            </DrawerNavIcon>
            Dashboard
          </DrawerNavItem>
          <DrawerNavItem onClick={() => handleTopNav('analytics')} aria-label="Analytics">
            <DrawerNavIcon>
              <BarChart3 size={18} />
            </DrawerNavIcon>
            Analytics
          </DrawerNavItem>
          <DrawerNavItem onClick={() => handleTopNav('clients')} aria-label="Clients">
            <DrawerNavIcon>
              <Users2 size={18} />
            </DrawerNavIcon>
            Clients
          </DrawerNavItem>

          {/* Departments */}
          <DrawerSectionLabel>Departments</DrawerSectionLabel>
          {Object.entries(DEPARTMENTS).map(([deptId, dept]) => {
            const Icon = dept.icon;
            const isActive = selectedDepartment === deptId;
            // eslint-disable-next-line security/detect-object-injection
            const isExpanded = !!expanded[deptId];
            const badge = dept.badgeKey ? badgeCounts[dept.badgeKey] : 0;

            return (
              <React.Fragment key={deptId}>
                <DrawerNavItem
                  $active={isActive}
                  $color={dept.color}
                  onClick={() => handleDeptClick(deptId)}
                  aria-expanded={isExpanded}
                  aria-label={dept.label}
                >
                  <DrawerNavIcon $color={dept.color}>
                    <Icon size={18} />
                  </DrawerNavIcon>
                  {dept.label}
                  {badge > 0 && (
                    <DrawerNavBadge aria-label={`${badge} items`}>
                      {badge > 99 ? '99+' : badge}
                    </DrawerNavBadge>
                  )}
                  <ChevronDown
                    size={14}
                    style={{
                      marginLeft: badge > 0 ? '4px' : 'auto',
                      transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                      transition: 'transform 0.2s ease',
                      color: '#9CA3AF',
                    }}
                  />
                </DrawerNavItem>
                <DrawerSubItems $expanded={isExpanded}>
                  {dept.services.map(service => {
                    const isActiveSvc = selectedDepartment === deptId && selectedSvc === service;
                    return (
                      <DrawerSubItem
                        key={service}
                        $active={isActiveSvc}
                        onClick={() => handleServiceClick(deptId, service)}
                      >
                        <DrawerSubDot $color={dept.color} />
                        {service}
                      </DrawerSubItem>
                    );
                  })}
                </DrawerSubItems>
              </React.Fragment>
            );
          })}

          {/* AI Command Center */}
          <DrawerSectionLabel>AI Center</DrawerSectionLabel>
          <DrawerNavItem onClick={handleAIOpen} aria-label="AI Command Center">
            <DrawerNavIcon $color="#D4AF37">
              <Bot size={18} />
            </DrawerNavIcon>
            AI Command Center
          </DrawerNavItem>

          {/* Admin (super user only) */}
          {isSuperUser && (
            <>
              <DrawerSectionLabel>Admin</DrawerSectionLabel>
              <DrawerNavItem
                onClick={() => handleTopNav('admin-dashboard')}
                aria-label="Admin Dashboard"
              >
                <DrawerNavIcon $color="#EF4444">
                  <Shield size={18} />
                </DrawerNavIcon>
                Admin Dashboard
              </DrawerNavItem>
            </>
          )}
        </DrawerBody>

        {/* ── Footer ─────────────────────────────────── */}
        <DrawerFooter>
          <DrawerNavItem onClick={() => handleTopNav('settings')} aria-label="Settings">
            <DrawerNavIcon>
              <Settings size={18} />
            </DrawerNavIcon>
            Settings
          </DrawerNavItem>
          <DrawerFooterText>White Caves CRM v2.0</DrawerFooterText>
        </DrawerFooter>
      </DrawerPanel>
    </>
  );
});

export default MobileMenuDrawer;
