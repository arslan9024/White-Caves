import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AppShell from '../../components/layout/AppShell';
import { selectActiveAssistant, selectActiveWorkspace, setActiveAssistant, setActiveWorkspace } from '../../store/slices/dashboardViewSlice';
import { setUserInfo, setActiveRole } from '../../store/slices/accessControlSlice';
import OverviewTab from '../../components/owner/tabs/OverviewTab';
import PropertiesTab from '../../components/owner/tabs/PropertiesTab';
import AgentsTab from '../../components/owner/tabs/AgentsTab';
import LeadsTab from '../../components/owner/tabs/LeadsTab';
import ContractsTab from '../../components/owner/tabs/ContractsTab';
import AnalyticsTab from '../../components/owner/tabs/AnalyticsTab';
import ChatbotTab from '../../components/owner/tabs/ChatbotTab';
import WhatsAppTab from '../../components/owner/tabs/WhatsAppTab';
import UAEPassTab from '../../components/owner/tabs/UAEPassTab';
import SettingsTab from '../../components/owner/tabs/SettingsTab';
import UsersTab from '../../components/owner/tabs/UsersTab';
import FeatureExplorer from '../../components/owner/FeatureExplorer';
import { SUPER_ADMIN, isMDAuthorized } from '../../config/superAdmin';
import '../../shared/styles/theme.css';
import './MDDashboardPage.css';

const LindaWhatsAppCRM = lazy(() => import('../../components/crm/LindaWhatsAppCRM'));
const MaryInventoryCRM = lazy(() => import('../../components/crm/MaryInventoryCRM'));
const ClaraLeadsCRM = lazy(() => import('../../components/crm/ClaraLeadsCRM'));
const NinaWhatsAppBotCRM = lazy(() => import('../../components/crm/NinaWhatsAppBotCRM'));
const NancyHRCRM = lazy(() => import('../../components/crm/NancyHRCRM'));
const SophiaSalesCRM = lazy(() => import('../../components/crm/SophiaSalesCRM'));
const DaisyLeasingCRM = lazy(() => import('../../components/crm/DaisyLeasingCRM'));
const TheodoraFinanceCRM = lazy(() => import('../../components/crm/TheodoraFinanceCRM'));
const OliviaMarketingCRM = lazy(() => import('../../components/crm/OliviaMarketingCRM'));
const ZoeExecutiveCRM = lazy(() => import('../../components/crm/ZoeExecutiveCRM'));
const LailaComplianceCRM = lazy(() => import('../../components/crm/LailaComplianceCRM'));
const AuroraCTODashboard = lazy(() => import('../../components/crm/AuroraCTODashboard'));
const HazelFrontendCRM = lazy(() => import('../../components/crm/HazelFrontendCRM'));
const WillowBackendCRM = lazy(() => import('../../components/crm/WillowBackendCRM'));
const AIAssistantHub = lazy(() => import('../../components/crm/AIAssistantHub'));
const AICommandCenter = lazy(() => import('../../components/crm/AICommandCenter'));

const CRMLoadingFallback = () => (
  <div className="crm-loading-fallback">
    <div className="loading-spinner"></div>
    <p>Loading Assistant...</p>
  </div>
);

export default function MDDashboardPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.currentUser);
  const activeAssistant = useSelector(selectActiveAssistant);
  const activeWorkspace = useSelector(selectActiveWorkspace);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({});

  useEffect(() => {
    if (!isMDAuthorized(user)) {
      navigate('/');
      return;
    }
    dispatch(setUserInfo({
      userId: user?.uid || user?.id || 'md',
      userName: user?.displayName || SUPER_ADMIN.name,
      userEmail: user?.email || SUPER_ADMIN.email,
      userAvatar: user?.photoURL,
      role: 'md'
    }));
    dispatch(setActiveRole('md'));
  }, [user, navigate, dispatch]);
  
  useEffect(() => {
    if (activeAssistant) {
      setActiveTab(activeAssistant);
    } else if (activeWorkspace) {
      const workspaceToTab = {
        'executive': 'overview',
        'leads': 'leads',
        'properties': 'properties',
        'agents': 'agents',
        'finance': 'analytics',
        'ai-command': 'ai-command'
      };
      if (workspaceToTab[activeWorkspace]) {
        setActiveTab(workspaceToTab[activeWorkspace]);
      }
    }
  }, [activeAssistant, activeWorkspace]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/owner/summary');
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'addProperty':
        navigate('/properties/add');
        break;
      case 'assignAgent':
        setActiveTab('agents');
        break;
      case 'generateReport':
        handleGenerateReport();
        break;
      case 'trainChatbot':
        setActiveTab('chatbot');
        break;
      case 'whatsappBroadcast':
        setActiveTab('whatsapp');
        break;
      case 'viewUaePassUsers':
        setActiveTab('uaepass');
        break;
      case 'openLinda':
        setActiveTab('linda');
        break;
      case 'openMary':
        setActiveTab('mary');
        break;
      case 'openClara':
        setActiveTab('clara');
        break;
      default:
        break;
    }
  };

  const handleGenerateReport = async () => {
    try {
      const response = await fetch('/api/dashboard/report/download');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `whitecaves-report-${new Date().toISOString().split('T')[0]}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };

  const handleTabAction = (action, id) => {
    switch(action) {
      case 'addProperty':
        navigate('/properties/add');
        break;
      case 'viewProperty':
        navigate(`/properties/${id}`);
        break;
      case 'editProperty':
        navigate(`/properties/edit/${id}`);
        break;
      case 'deleteProperty':
        if (window.confirm('Are you sure you want to delete this property?')) {
          console.log('Delete property:', id);
        }
        break;
      case 'addAgent':
        navigate('/agents/add');
        break;
      case 'viewAgent':
        navigate(`/agents/${id}`);
        break;
      case 'editAgent':
        navigate(`/agents/edit/${id}`);
        break;
      case 'messageAgent':
        console.log('Message agent:', id);
        break;
      case 'addLead':
        navigate('/leads/add');
        break;
      case 'viewLead':
        navigate(`/leads/${id}`);
        break;
      case 'exportLeads':
        console.log('Export leads');
        break;
      case 'callLead':
        console.log('Call lead:', id);
        break;
      case 'whatsappLead':
        console.log('WhatsApp lead:', id);
        break;
      case 'assignLead':
        console.log('Assign lead:', id);
        break;
      case 'addContract':
        navigate('/contracts/add');
        break;
      case 'viewContract':
        navigate(`/contracts/${id}`);
        break;
      case 'editContract':
        navigate(`/contracts/edit/${id}`);
        break;
      case 'downloadContract':
        console.log('Download contract:', id);
        break;
      case 'generateContract':
        navigate('/contracts/generate');
        break;
      case 'trainChatbot':
        setActiveTab('chatbot');
        break;
      case 'viewTrainingData':
        navigate('/chatbot/training');
        break;
      case 'configureResponses':
        navigate('/chatbot/responses');
        break;
      case 'viewLogs':
        navigate('/chatbot/logs');
        break;
      case 'configureRules':
        navigate('/chatbot/rules');
        break;
      case 'openWhatsApp':
        window.open('https://web.whatsapp.com', '_blank');
        break;
      case 'sendBroadcast':
        console.log('Send broadcast:', id);
        break;
      case 'viewAllMessages':
        navigate('/whatsapp/messages');
        break;
      case 'replyMessage':
        console.log('Reply to message:', id);
        break;
      case 'assignMessage':
        console.log('Assign message:', id);
        break;
      case 'addTemplate':
        navigate('/whatsapp/templates/add');
        break;
      case 'editTemplate':
        navigate(`/whatsapp/templates/${id}`);
        break;
      case 'viewUser':
        navigate(`/users/${id}`);
        break;
      case 'verifyUser':
        console.log('Verify user:', id);
        break;
      case 'exportUsers':
        console.log('Export users');
        break;
      case 'configureUAEPass':
        navigate('/settings/uaepass');
        break;
      case 'configureIntegration':
        navigate(`/settings/integrations/${id}`);
        break;
      case 'viewSystemHealth':
        navigate('/owner/system-health');
        break;
      case 'clearCache':
        if (window.confirm('Are you sure you want to clear the cache?')) {
          console.log('Clear cache');
        }
        break;
      case 'resetAnalytics':
        if (window.confirm('Are you sure you want to reset analytics?')) {
          console.log('Reset analytics');
        }
        break;
      case 'exportData':
        console.log('Export all data');
        break;
      default:
        console.log('Unhandled action:', action, id);
        break;
    }
  };

  const handleSaveSettings = async (settings) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (response.ok) {
        alert('Settings saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const handleSelectAssistant = (assistantId) => {
    setActiveTab(assistantId);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab data={dashboardData} loading={loading} onQuickAction={handleQuickAction} />;
      case 'ai-command':
        return <Suspense fallback={<CRMLoadingFallback />}><AICommandCenter /></Suspense>;
      case 'ai-hub':
        return <Suspense fallback={<CRMLoadingFallback />}><AIAssistantHub onSelectAssistant={handleSelectAssistant} /></Suspense>;
      case 'users':
        return <UsersTab onAction={handleTabAction} />;
      case 'properties':
        return <PropertiesTab data={dashboardData} loading={loading} onAction={handleTabAction} />;
      case 'agents':
        return <AgentsTab data={dashboardData} loading={loading} onAction={handleTabAction} />;
      case 'leads':
        return <LeadsTab data={dashboardData} loading={loading} onAction={handleTabAction} />;
      case 'contracts':
        return <ContractsTab data={dashboardData} loading={loading} onAction={handleTabAction} />;
      case 'analytics':
        return <AnalyticsTab data={dashboardData} loading={loading} />;
      case 'linda':
        return <Suspense fallback={<CRMLoadingFallback />}><LindaWhatsAppCRM /></Suspense>;
      case 'mary':
        return <Suspense fallback={<CRMLoadingFallback />}><MaryInventoryCRM /></Suspense>;
      case 'clara':
        return <Suspense fallback={<CRMLoadingFallback />}><ClaraLeadsCRM /></Suspense>;
      case 'nina':
        return <Suspense fallback={<CRMLoadingFallback />}><NinaWhatsAppBotCRM /></Suspense>;
      case 'nancy':
        return <Suspense fallback={<CRMLoadingFallback />}><NancyHRCRM /></Suspense>;
      case 'sophia':
        return <Suspense fallback={<CRMLoadingFallback />}><SophiaSalesCRM /></Suspense>;
      case 'daisy':
        return <Suspense fallback={<CRMLoadingFallback />}><DaisyLeasingCRM /></Suspense>;
      case 'theodora':
        return <Suspense fallback={<CRMLoadingFallback />}><TheodoraFinanceCRM /></Suspense>;
      case 'olivia':
        return <Suspense fallback={<CRMLoadingFallback />}><OliviaMarketingCRM /></Suspense>;
      case 'zoe':
        return <Suspense fallback={<CRMLoadingFallback />}><ZoeExecutiveCRM /></Suspense>;
      case 'laila':
        return <Suspense fallback={<CRMLoadingFallback />}><LailaComplianceCRM /></Suspense>;
      case 'aurora':
        return <Suspense fallback={<CRMLoadingFallback />}><AuroraCTODashboard /></Suspense>;
      case 'hazel':
        return <Suspense fallback={<CRMLoadingFallback />}><HazelFrontendCRM /></Suspense>;
      case 'willow':
        return <Suspense fallback={<CRMLoadingFallback />}><WillowBackendCRM /></Suspense>;
      case 'chatbot':
        return <ChatbotTab data={dashboardData} loading={loading} onAction={handleTabAction} />;
      case 'whatsapp':
        return <WhatsAppTab data={dashboardData} loading={loading} onAction={handleTabAction} />;
      case 'uaepass':
        return <UAEPassTab data={dashboardData} loading={loading} onAction={handleTabAction} />;
      case 'features':
        return <FeatureExplorer />;
      case 'settings':
        return <SettingsTab data={dashboardData} onAction={handleTabAction} onSave={handleSaveSettings} />;
      default:
        return <OverviewTab data={dashboardData} loading={loading} onQuickAction={handleQuickAction} />;
    }
  };

  return (
    <AppShell>
      <div className="owner-dashboard-content">
        {renderTabContent()}
      </div>
    </AppShell>
  );
}
