import React, { Suspense, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AppShell from '../../components/layout/AppShell';
import DashboardWorkspace from '../../components/layout/DashboardWorkspace';
import { selectActiveAssistant } from '../../store/slices/dashboardViewSlice';
import { setUserInfo, setActiveRole } from '../../store/slices/accessControlSlice';
import { getCRMModule } from '../../config/crmModuleRegistry';
import './ModernDashboardPage.css';
const OWNER_EMAIL = 'arslanmalikgoraha@gmail.com';

const isOwnerAuthorized = user => {
  if (!user) return false;
  if (user.email === OWNER_EMAIL) return true;
  const storedRole = localStorage.getItem('userRole');
  if (storedRole) {
    try {
      const roleData = JSON.parse(storedRole);
      return roleData.role === 'owner';
    } catch (e) {
      return false;
    }
  }
  return false;
};

const LoadingFallback = () => (
  <div className="assistant-loading">
    <div className="loading-pulse" />
    <span>Loading Assistant...</span>
  </div>
);

const AssistantRenderer = ({ assistantId }) => {
  const moduleDef = getCRMModule(assistantId);
  const Component = moduleDef?.Component;

  if (!Component) {
    return (
      <div className="assistant-placeholder">
        <div className="placeholder-icon">🤖</div>
        <h3>Assistant Dashboard</h3>
        <p>Select an AI assistant from the sidebar to view their dashboard.</p>
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Component />
    </Suspense>
  );
};

export default function ModernDashboardPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.currentUser);
  const activeAssistant = useSelector(selectActiveAssistant);

  useEffect(() => {
    if (!isOwnerAuthorized(user)) {
      navigate('/');
      return;
    }

    dispatch(
      setUserInfo({
        userId: user?.uid || user?.id || 'owner',
        userName: user?.displayName || 'Company Owner',
        userEmail: user?.email || '',
        userAvatar: user?.photoURL,
        role: 'owner',
      })
    );
    dispatch(setActiveRole('owner'));
  }, [user, navigate, dispatch]);

  if (!user) {
    return null;
  }

  return (
    <AppShell>
      {activeAssistant ? (
        <AssistantRenderer assistantId={activeAssistant} />
      ) : (
        <DashboardWorkspace />
      )}
    </AppShell>
  );
}
