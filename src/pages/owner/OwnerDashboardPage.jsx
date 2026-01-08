import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
import RoleSelectorDropdown from '../../shared/components/ui/RoleSelectorDropdown';
import LindaWhatsAppCRM from '../../components/crm/LindaWhatsAppCRM';
import MaryInventoryCRM from '../../components/crm/MaryInventoryCRM';
import ClaraLeadsCRM from '../../components/crm/ClaraLeadsCRM';
import NinaWhatsAppBotCRM from '../../components/crm/NinaWhatsAppBotCRM';
import NancyHRCRM from '../../components/crm/NancyHRCRM';
import SophiaSalesCRM from '../../components/crm/SophiaSalesCRM';
import DaisyLeasingCRM from '../../components/crm/DaisyLeasingCRM';
import TheodoraFinanceCRM from '../../components/crm/TheodoraFinanceCRM';
import OliviaMarketingCRM from '../../components/crm/OliviaMarketingCRM';
import ZoeExecutiveCRM from '../../components/crm/ZoeExecutiveCRM';
import LailaComplianceCRM from '../../components/crm/LailaComplianceCRM';
import AuroraCTODashboard from '../../components/crm/AuroraCTODashboard';
import AIAssistantHub from '../../components/crm/AIAssistantHub';
import '../../shared/styles/theme.css';
import './OwnerDashboardPage.css';

const OWNER_EMAIL = 'arslanmalikgoraha@gmail.com';

const AI_ASSISTANTS = [
  { id: 'linda', name: 'Linda', desc: 'WhatsApp CRM', icon: '💬', color: '#25D366', department: 'communications' },
  { id: 'mary', name: 'Mary', desc: 'Inventory CRM', icon: '🏢', color: '#3B82F6', department: 'operations' },
  { id: 'clara', name: 'Clara', desc: 'Leads CRM', icon: '🎯', color: '#EF4444', department: 'sales' },
  { id: 'nina', name: 'Nina', desc: 'Bot Developer', icon: '🤖', color: '#06B6D4', department: 'communications' },
  { id: 'nancy', name: 'Nancy', desc: 'HR Manager', icon: '👩‍💼', color: '#F97316', department: 'operations' },
  { id: 'sophia', name: 'Sophia', desc: 'Sales Pipeline', icon: '📊', color: '#8B5CF6', department: 'sales' },
  { id: 'daisy', name: 'Daisy', desc: 'Leasing', icon: '🏠', color: '#14B8A6', department: 'operations' },
  { id: 'theodora', name: 'Theodora', desc: 'Finance', icon: '💰', color: '#EC4899', department: 'finance' },
  { id: 'olivia', name: 'Olivia', desc: 'Marketing', icon: '📣', color: '#4FACFE', department: 'marketing' },
  { id: 'zoe', name: 'Zoe', desc: 'Executive', icon: '👔', color: '#43E97B', department: 'executive' },
  { id: 'laila', name: 'Laila', desc: 'Compliance', icon: '🛡️', color: '#6366F1', department: 'compliance' },
  { id: 'aurora', name: 'Aurora', desc: 'CTO', icon: '🖥️', color: '#0EA5E9', department: 'technology' }
];

const TABS = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'ai-hub', label: 'AI Hub', icon: '🧠' },
  { id: 'users', label: 'Users', icon: '👤' },
  { id: 'properties', label: 'Properties', icon: '🏠' },
  { id: 'agents', label: 'Agents', icon: '👥' },
  { id: 'leads', label: 'Leads', icon: '🎯' },
  { id: 'contracts', label: 'Contracts', icon: '📜' },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
  { id: 'chatbot', label: 'AI Settings', icon: '⚙️' },
  { id: 'whatsapp', label: 'WhatsApp', icon: '📱' },
  { id: 'uaepass', label: 'UAE Pass', icon: '🆔' },
  { id: 'features', label: 'Features', icon: '⭐' },
  { id: 'settings', label: 'Settings', icon: '🔧' },
];

export default function OwnerDashboardPage() {
  const navigate = useNavigate();
  const user = useSelector(state => state.user.currentUser);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({});
  const [selectedRole, setSelectedRole] = useState('company_owner');

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

  const handleRoleChange = (role) => {
    setSelectedRole(role.id);
    console.log('Role changed to:', role.name);
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
    console.log('Tab action:', action, id);
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab data={dashboardData} loading={loading} onQuickAction={handleQuickAction} />;
      case 'ai-hub':
        return <AIAssistantHub onSelectAssistant={handleSelectAssistant} />;
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
        return <LindaWhatsAppCRM />;
      case 'mary':
        return <MaryInventoryCRM />;
      case 'clara':
        return <ClaraLeadsCRM />;
      case 'nina':
        return <NinaWhatsAppBotCRM />;
      case 'nancy':
        return <NancyHRCRM />;
      case 'sophia':
        return <SophiaSalesCRM />;
      case 'daisy':
        return <DaisyLeasingCRM />;
      case 'theodora':
        return <TheodoraFinanceCRM />;
      case 'olivia':
        return <OliviaMarketingCRM />;
      case 'zoe':
        return <ZoeExecutiveCRM />;
      case 'laila':
        return <LailaComplianceCRM />;
      case 'aurora':
        return <AuroraCTODashboard />;
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
    <div className="owner-dashboard-page">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Executive Dashboard</h1>
            <p>White Caves Real Estate LLC - Control Center</p>
          </div>
          <div className="header-role-selector">
            <RoleSelectorDropdown 
              currentRole={selectedRole}
              onRoleChange={handleRoleChange}
            />
          </div>
        </div>
      </div>

      <div className="ai-assistants-bar">
        <div className="ai-bar-title">AI Assistants <span className="ai-count">{AI_ASSISTANTS.length}</span></div>
        <div className="ai-buttons">
          {AI_ASSISTANTS.map(assistant => (
            <button
              key={assistant.id}
              className={`ai-btn ${assistant.id} ${activeTab === assistant.id ? 'active' : ''}`}
              onClick={() => setActiveTab(assistant.id)}
              style={{ '--assistant-color': assistant.color }}
            >
              <span className="ai-icon">{assistant.icon}</span>
              <div className="ai-info">
                <span className="ai-name">{assistant.name}</span>
                <span className="ai-desc">{assistant.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="dashboard-tabs">
        <div className="tabs-container">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="dashboard-content">
        {renderTabContent()}
      </div>

      <div className="dashboard-footer">
        <p>White Caves Real Estate LLC © {new Date().getFullYear()} | Office D-72, El-Shaye-4, Port Saeed, Dubai | +971 56 361 6136</p>
      </div>
    </div>
  );
}
