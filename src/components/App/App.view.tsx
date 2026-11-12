import { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { UnifiedWorkspaceLayout } from '../../layouts/UnifiedWorkspaceLayout';
import SuspenseLoader from '../../components/common/SuspenseLoader';
import RouteErrorBoundary from '../../components/RouteErrorBoundary';
import { BackendStatusBanner } from '../../components/shared/BackendStatusBanner/BackendStatusBanner';
import HenryDriveCallback from '../../pages/crm/HenryDriveCallback';
import { CustomCursor } from '../../components/motion/CustomCursor';
import React from 'react';
import { UniversalComponents } from './App.pages';
import { RoleGateway } from './App.pages';
import { PendingApprovalPage } from './App.pages';
import { SignInPage } from './App.pages';
import { ServerStatusPage } from './App.pages';
import { LindaWhatsAppCRMPage } from './App.pages';
import { ModernDashboardPage } from './App.pages';
import { NadiaPage } from './App.pages';
import { ArgentinaGoalPage } from './App.pages';
import { NotFoundPage } from './App.pages';
import { PWAInstallPrompt } from './App.pages';
import { DesignSystemTest } from './App.pages';
import { BiometricPrompt } from './App.pages';
import { WebVitalsTracker } from './App.pages';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardEntryRoute } from './DashboardEntryRoute';
import { LocationKeyWrapper } from './LocationKeyWrapper';
import { FounderRedirectGuard } from './FounderRedirectGuard';
import { LEGACY_DASHBOARD_REDIRECT_ROUTES } from './App.redirects.data';
import { LEGACY_OWNER_REDIRECT_ROUTES } from './App.redirects.data';
import { useAppRuntime } from './App.logic';
import { createRouteRenderers } from './App.routeViews';
import { portalRoutes } from './App.routes';
import { ownerWhatsAppRoutes } from './App.routes';
import { roleSpecificAppRoutes } from './App.routes';
import { ownerCrmRedirectRoutes } from './App.routes';
import { ownerUtilityRoutes } from './App.routes';
import { publicRoutes } from './App.routes';
import { AppProviders } from './AppProviders';
export function AppView() {
  const { user, consentGranted, handleRoleSelect } = useAppRuntime();
  const {
    renderProtectedAppPage,
    renderPublicPage,
    renderSignedInPage,
    renderGuestOnlyPage,
    renderProtectedPortalPage,
    renderProtectedRedirect,
  } = createRouteRenderers(user);
  return (
    <AppProviders>
      <BackendStatusBanner />
      <CustomCursor />
      <FounderRedirectGuard />
      {/* Accessibility: skip-to-content link (WCAG 2.1 Level A) */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      {consentGranted && <SpeedInsights />}
      <Suspense fallback={null}>
        <WebVitalsTracker />
      </Suspense>
      <Suspense fallback={null}>
        <UniversalComponents />
      </Suspense>
      {/* Phase 10 — PWA install banner (loads after idle) */}
      <Suspense fallback={null}>
        <PWAInstallPrompt />
      </Suspense>
      {user && (
        <Suspense fallback={null}>
          <BiometricPrompt onClose={() => {}} />
        </Suspense>
      )}
      <main id="main-content" role="main">
        <LocationKeyWrapper>
          <Routes>
            <Route
              path="/henry-drive-callback"
              element={
                <RouteErrorBoundary>
                  <HenryDriveCallback />
                </RouteErrorBoundary>
              }
            />
            {publicRoutes.map(route => (
              <Route
                key={`public-${route.path}`}
                path={route.path}
                element={renderPublicPage(route.page, route.section)}
              />
            ))}
            <Route path="/signin" element={renderGuestOnlyPage(<SignInPage />, 'Sign In')} />
            <Route path="/signup" element={renderGuestOnlyPage(<SignInPage />, 'Sign Up')} />
            <Route path="/login" element={<Navigate to="/signin" replace />} />
            <Route path="/auth/signin" element={<Navigate to="/signin" replace />} />
            <Route path="/forgot-password" element={<Navigate to="/" replace />} />
            <Route path="/reset-password" element={<Navigate to="/" replace />} />
            <Route path="/profile" element={<Navigate to="/dashboard/profile" replace />} />
            <Route
              path="/select-role"
              element={renderSignedInPage(
                <RoleGateway user={user ?? {}} onRoleSelect={handleRoleSelect} />,
                'Role Selection'
              )}
            />
            <Route
              path="/pending-approval"
              element={renderSignedInPage(<PendingApprovalPage />, 'Pending Approval')}
            />
            <Route
              path="/status"
              element={renderProtectedAppPage(<ServerStatusPage />, 'Server Status', ['owner'])}
            />

            {/* ==================== EXECUTIVE DASHBOARDS ==================== */}
            {/* Previous dashboard preserved at /dashboard2 and /crm */}
            <Route
              path="/dashboard2/*"
              element={
                <ProtectedRoute>
                  <DashboardEntryRoute />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard2"
              element={
                <ProtectedRoute>
                  <DashboardEntryRoute />
                </ProtectedRoute>
              }
            />
            <Route path="/crm/*" element={<Navigate to="/dashboard" replace />} />
            <Route path="/crm" element={<Navigate to="/dashboard" replace />} />

            {/* NEW Blank Step-by-Step Modern Dashboard at /dashboard */}
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<SuspenseLoader />}>
                    <ModernDashboardPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<SuspenseLoader />}>
                    <ModernDashboardPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            {/* ==================== ROLE-SPECIFIC SUB-PAGES ==================== */}
            {roleSpecificAppRoutes.map(route => (
              <Route
                key={`role-specific-${route.path}`}
                path={route.path}
                element={renderProtectedAppPage(route.page, route.section, route.allowedRoles)}
              />
            ))}

            {/* ==================== PORTAL ROUTES (Phase 2) ==================== */}
            {portalRoutes.map(route => (
              <Route
                key={`portal-${route.path}`}
                path={route.path}
                element={renderProtectedPortalPage(
                  route.page,
                  route.section,
                  route.portalType,
                  route.allowedRoles
                )}
              />
            ))}

            {/* ==================== ALL DASHBOARD ROUTES → UNIFIED ==================== */}
            {/* Role-specific dashboard paths redirect to canonical targets */}
            {LEGACY_DASHBOARD_REDIRECT_ROUTES.map(route => (
              <Route
                key={`legacy-dashboard-${route.path}`}
                path={route.path}
                element={<Navigate to={route.to} replace />}
              />
            ))}

            {/* ==================== LEGACY OWNER ROUTES → Redirect to Dashboard ==================== */}
            {LEGACY_OWNER_REDIRECT_ROUTES.map(route => (
              <Route
                key={`legacy-owner-${route.path}`}
                path={route.path}
                element={<Navigate to={route.to} replace />}
              />
            ))}
            {ownerUtilityRoutes.map(route => (
              <Route
                key={`owner-utility-${route.path}`}
                path={route.path}
                element={renderProtectedAppPage(route.page, route.section, route.allowedRoles)}
              />
            ))}
            {ownerWhatsAppRoutes.map(route => (
              <Route
                key={`owner-whatsapp-${route.path}`}
                path={route.path}
                element={renderProtectedAppPage(route.page, route.section, ['owner'])}
              />
            ))}

            {/* ==================== CRM MANAGEMENT ROUTES ==================== */}
            {ownerCrmRedirectRoutes.map(route => (
              <Route
                key={`owner-crm-${route.path}`}
                path={route.path}
                element={renderProtectedRedirect(route.to, ['owner'])}
              />
            ))}

            {/* Personal Goals */}
            <Route
              path="/owner/goals/argentina"
              element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <UnifiedWorkspaceLayout>
                    <RouteErrorBoundary section="Argentina Goal">
                      <Suspense fallback={<SuspenseLoader />}>
                        <ArgentinaGoalPage />
                      </Suspense>
                    </RouteErrorBoundary>
                  </UnifiedWorkspaceLayout>
                </ProtectedRoute>
              }
            />

            {/* Nadia AI CRM — WhatsApp Business API Dashboard */}
            <Route path="/nadia" element={renderProtectedAppPage(<NadiaPage />, 'Nadia AI')} />

            {/* Linda WhatsApp Bot Operations Center & Terminal */}
            <Route
              path="/linda"
              element={renderProtectedAppPage(<LindaWhatsAppCRMPage />, 'AI Linda Operations')}
            />

            {/* ==================== OTHER ROUTES ==================== */}
            {import.meta.env.DEV && (
              <Route
                path="/design-system"
                element={renderPublicPage(<DesignSystemTest />, 'Design System')}
              />
            )}
            <Route path="*" element={renderPublicPage(<NotFoundPage />, 'Not Found')} />
          </Routes>
        </LocationKeyWrapper>
      </main>
    </AppProviders>
  );
}
