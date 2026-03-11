import React, { FC, useState, useEffect, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './OwnerDashboardPage.css';

interface OwnerDashboardPageProps {}

// Role-based access: owner and lion roles (checked by ProtectedRoute in App.jsx)
const OWNER_ROLES = ['owner', 'lion', 'md', 'managing_director'];

const OwnerDashboardPage: FC<OwnerDashboardPageProps> = () => {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user.currentUser);
  
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [loading, setLoading] = useState<boolean>(false);
  const [dashboardData, setDashboardData] = useState<any>({});

  useEffect(() => {
    // Role-based check instead of hardcoded email
    const stored = localStorage.getItem('userRole');
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        if (!OWNER_ROLES.includes(userData.role)) {
          navigate('/');
        }
      } catch {
        navigate('/');
      }
    } else if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async (): Promise<void> => {
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

  const handleLogout = (): void => {
    navigate('/');
  };

  const handleQuickAction = (action: string): void => {
    switch(action) {
      case 'addProperty':
        navigate('/properties/add');
        break;
      case 'viewAnalytics':
        setActiveTab('analytics');
        break;
      case 'manageAgents':
        setActiveTab('agents');
        break;
      case 'viewSettings':
        setActiveTab('settings');
        break;
      default:
        break;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'properties', label: 'Properties' },
    { id: 'agents', label: 'Agents' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="owner-dashboard no-sidebar">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Owner Dashboard</h1>
          <p>Manage your real estate empire</p>
        </div>

        <div className="quick-actions">
          <button onClick={() => handleQuickAction('addProperty')} className="action-btn">
            <span>➕</span> Add Property
          </button>
          <button onClick={() => handleQuickAction('manageAgents')} className="action-btn">
            <span>👥</span> Manage Agents
          </button>
          <button onClick={() => handleQuickAction('viewAnalytics')} className="action-btn">
            <span>📊</span> Analytics
          </button>
          <button onClick={() => handleQuickAction('viewSettings')} className="action-btn">
            <span>⚙️</span> Settings
          </button>
        </div>

        <div className="tabs-navigation">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Properties</h3>
                <p className="stat-value">{dashboardData.propertyCount || '0'}</p>
              </div>
              <div className="stat-card">
                <h3>Monthly Revenue</h3>
                <p className="stat-value">AED {dashboardData.monthlyRevenue || '0'}</p>
              </div>
              <div className="stat-card">
                <h3>Active Agents</h3>
                <p className="stat-value">{dashboardData.agentCount || '0'}</p>
              </div>
              <div className="stat-card">
                <h3>Pending Transactions</h3>
                <p className="stat-value">{dashboardData.pendingCount || '0'}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="dashboard-content">
            <h3>My Properties</h3>
            <p>Property management interface</p>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="dashboard-content">
            <h3>Agent Management</h3>
            <p>View and manage your agents</p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="dashboard-content">
            <h3>Business Analytics</h3>
            <p>View detailed analytics and reports</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="dashboard-content">
            <h3>Settings</h3>
            <p>Configure dashboard settings</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboardPage;
