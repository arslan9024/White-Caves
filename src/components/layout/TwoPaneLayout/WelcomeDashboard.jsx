import React from 'react';
import { useDispatch } from 'react-redux';
import { 
  Building2, TrendingUp, Home, Wallet, Megaphone, Shield,
  Server, Briefcase, Users, Wrench, Search, Package, 
  LayoutGrid, FileText, Brain, ArrowRight, Zap
} from 'lucide-react';
import { selectDepartment, selectPillar } from '../../../store/slices/workspaceSlice';
import './WelcomeDashboard.css';

const QUICK_STATS = [
  { label: 'Active Properties', value: '847', change: '+12%', icon: Building2 },
  { label: 'Active Deals', value: '156', change: '+8%', icon: TrendingUp },
  { label: 'Active Leases', value: '342', change: '+5%', icon: Home },
  { label: 'AI Assistants', value: '32', status: 'Online', icon: Brain }
];

const PLATFORM_PILLARS = [
  { id: 'discovery', label: 'Property Discovery', desc: 'Search 50+ Dubai filters', icon: Search, color: '#B03737' },
  { id: 'services', label: 'Service Hub', desc: '72 Dubai-specific services', icon: Package, color: '#B03737' },
  { id: 'crm', label: 'CRM Overview', desc: '10 department dashboards', icon: LayoutGrid, color: '#B03737' },
  { id: 'inventory', label: 'Inventory', desc: 'Property lifecycle tracking', icon: FileText, color: '#B03737' },
  { id: 'ai_center', label: 'AI Command Center', desc: '32 specialized assistants', icon: Brain, color: '#B03737' }
];

const TOP_DEPARTMENTS = [
  { id: 'sales', label: 'Sales', icon: TrendingUp, color: '#8B5CF6', activeDeals: 42 },
  { id: 'leasing', label: 'Leasing', icon: Home, color: '#F59E0B', activeDeals: 28 },
  { id: 'compliance', label: 'Compliance', icon: Shield, color: '#6366F1', pendingKYC: 23 },
  { id: 'finance', label: 'Finance', icon: Wallet, color: '#10B981', mtdRevenue: '8.5M' }
];

export default function WelcomeDashboard() {
  const dispatch = useDispatch();

  return (
    <div className="welcome-dashboard">
      <div className="welcome-header">
        <div className="welcome-text">
          <h1>Welcome to White Caves CRM</h1>
          <p>Select a department from the left or an AI assistant from the right to get started</p>
        </div>
        <div className="welcome-hint">
          <Zap size={16} />
          <span>Tip: Select both for collaborative mode</span>
        </div>
      </div>

      <div className="quick-stats-grid">
        {QUICK_STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="stat-card">
              <div className="stat-icon">
                <Icon size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
              {stat.change && (
                <span className="stat-change positive">{stat.change}</span>
              )}
              {stat.status && (
                <span className="stat-status online">{stat.status}</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="welcome-sections">
        <section className="pillars-section">
          <h2>Platform Pillars</h2>
          <div className="pillars-grid">
            {PLATFORM_PILLARS.map(pillar => {
              const Icon = pillar.icon;
              return (
                <button
                  key={pillar.id}
                  className="pillar-card"
                  onClick={() => dispatch(selectPillar(pillar.id))}
                >
                  <div className="pillar-icon" style={{ color: pillar.color }}>
                    <Icon size={24} />
                  </div>
                  <div className="pillar-content">
                    <span className="pillar-label">{pillar.label}</span>
                    <span className="pillar-desc">{pillar.desc}</span>
                  </div>
                  <ArrowRight size={16} className="pillar-arrow" />
                </button>
              );
            })}
          </div>
        </section>

        <section className="departments-section">
          <h2>Quick Access - Departments</h2>
          <div className="departments-grid">
            {TOP_DEPARTMENTS.map(dept => {
              const Icon = dept.icon;
              return (
                <button
                  key={dept.id}
                  className="dept-quick-card"
                  onClick={() => dispatch(selectDepartment(dept.id))}
                  style={{ '--dept-color': dept.color }}
                >
                  <div className="dept-header">
                    <div className="dept-icon" style={{ backgroundColor: `${dept.color}15`, color: dept.color }}>
                      <Icon size={20} />
                    </div>
                    <span className="dept-label">{dept.label}</span>
                  </div>
                  <div className="dept-stats">
                    {dept.activeDeals && (
                      <span className="dept-stat">{dept.activeDeals} active deals</span>
                    )}
                    {dept.pendingKYC && (
                      <span className="dept-stat">{dept.pendingKYC} pending KYC</span>
                    )}
                    {dept.mtdRevenue && (
                      <span className="dept-stat">AED {dept.mtdRevenue} MTD</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
