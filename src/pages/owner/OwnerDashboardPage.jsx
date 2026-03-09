import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import UnifiedDashboardLayout from '../../components/layout/UnifiedDashboardLayout';
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
import '../../shared/styles/theme.css';
import './OwnerDashboardPage.css';

const LindaWhatsAppCRM = lazy(() => import('../../components/crm/LindaWhatsAppCRM_NEW'));
const MaryInventoryCRM = lazy(() => import('../../components/crm/MaryInventoryCRM_NEW'));
const ClaraLeadsCRM = lazy(() => import('../../components/crm/ClaraLeadsCRM_NEW'));
const NinaWhatsAppBotCRM = lazy(() => import('../../components/crm/NinaWhatsAppBotCRM_NEW'));
const NancyHRCRM = lazy(() => import('../../components/crm/NancyHRCRM_NEW'));
const SophiaSalesCRM = lazy(() => import('../../components/crm/SophiaSalesCRM_NEW'));
const DaisyLeasingCRM = lazy(() => import('../../components/crm/DaisyLeasingCRM_NEW'));
const TheodoraFinanceCRM = lazy(() => import('../../components/crm/TheodoraFinanceCRM_NEW'));
const OliviaMarketingCRM = lazy(() => import('../../components/crm/OliviaMarketingCRM_NEW'));
const ZoeExecutiveCRM = lazy(() => import('../../components/crm/ZoeExecutiveCRM_NEW'));
const LailaComplianceCRM = lazy(() => import('../../components/crm/LailaComplianceCRM_NEW'));
const AuroraCTODashboard = lazy(() => import('../../components/crm/AuroraCTODashboard_NEW'));
const HazelFrontendCRM = lazy(() => import('../../components/crm/HazelFrontendCRM_NEW'));
const WillowBackendCRM = lazy(() => import('../../components/crm/WillowBackendCRM_NEW'));
const AIAssistantHub = lazy(() => import('../../components/crm/AIAssistantHub'));
const AICommandCenter = lazy(() => import('../../components/crm/AICommandCenter'));

const CRMLoadingFallback = () => (
  <div className="crm-loading-fallback">
    <div className="loading-spinner"></div>
    <p>Loading Assistant...</p>
  </div>
);

const OWNER_EMAIL = 'arslanmalikgoraha@gmail.com';

export default function OwnerDashboardPage() {
  const navigate = useNavigate();
  const user = useSelector(state => state.user.currentUser);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({});

  useEffect(() => {
    if (!user || user.email !== OWNER_EMAIL) {
      navigate('/');
    }
  }, [user, navigate]);

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

  const handleSelectAssistant = (assistantId) => {
    setActiveTab(assistantId);
  };

  const handleSaveSettings = (settings) => {
    console.log('Save settings:', settings);
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
    <UnifiedDashboardLayout
      user={user}
      onLogout={handleLogout}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      role="owner"
    >
      {renderTabContent()}
    </UnifiedDashboardLayout>
  );
}
