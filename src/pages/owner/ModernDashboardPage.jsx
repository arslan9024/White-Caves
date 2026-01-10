import React, { Suspense, lazy, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AppShell from '../../components/layout/AppShell';
import DashboardWorkspace from '../../components/layout/DashboardWorkspace';
import { selectActiveAssistant } from '../../store/slices/dashboardViewSlice';
import { setUserInfo, setActiveRole } from '../../store/slices/accessControlSlice';
import './ModernDashboardPage.css';

const ClaraLeadsCRM = lazy(() => import('../../components/crm/ClaraLeadsCRM'));
const MaryInventoryCRM = lazy(() => import('../../components/crm/MaryInventoryCRM'));
const LindaWhatsAppCRM = lazy(() => import('../../components/crm/LindaWhatsAppCRM'));
const NancyHRCRM = lazy(() => import('../../components/crm/NancyHRCRM'));
const TheodoraFinanceCRM = lazy(() => import('../../components/crm/TheodoraFinanceCRM'));
const OliviaMarketingCRM = lazy(() => import('../../components/crm/OliviaMarketingCRM'));
const ZoeExecutiveCRM = lazy(() => import('../../components/crm/ZoeExecutiveCRM'));
const AuroraCTODashboard = lazy(() => import('../../components/crm/AuroraCTODashboard'));

const OWNER_EMAIL = 'arslanmalikgoraha@gmail.com';

const LoadingFallback = () => (
  <div className="assistant-loading">
    <div className="loading-pulse" />
    <span>Loading Assistant...</span>
  </div>
);

const AssistantRenderer = ({ assistantId }) => {
  const ASSISTANT_COMPONENTS = {
    clara: ClaraLeadsCRM,
    mary: MaryInventoryCRM,
    linda: LindaWhatsAppCRM,
    nancy: NancyHRCRM,
    theodora: TheodoraFinanceCRM,
    olivia: OliviaMarketingCRM,
    zoe: ZoeExecutiveCRM,
    aurora: AuroraCTODashboard
  };

  const Component = ASSISTANT_COMPONENTS[assistantId];

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
    if (!user || user.email !== OWNER_EMAIL) {
      navigate('/');
      return;
    }

    dispatch(setUserInfo({
      userId: user.uid || user.id,
      userName: user.displayName || 'Company Owner',
      userEmail: user.email,
      userAvatar: user.photoURL,
      role: 'owner'
    }));
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
