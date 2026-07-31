import { Users, TrendingUp, DollarSign, Target, Clock, ArrowUp, ArrowDown } from 'lucide-react';
import { useSalesData } from './hooks/useSalesData';
import PipelineTab from './tabs/PipelineTab';
import DealsTab from './tabs/DealsTab';
import AgentsTab from './tabs/AgentsTab';
import ForecastingTab from './tabs/ForecastingTab';
import AssistantLifecycleTab from '../shared/AssistantLifecycleTab';
import '../AssistantDashboard.css';
import './SophiaSalesCRM.css';

const SophiaSalesCRM = () => {
  const {
    activeTab,
    setActiveTab,
    selectedStage,
    handleSelectStage,
    searchQuery,
    setSearchQuery,
    filterAgent,
    setFilterAgent,
    deals,
    filteredDeals,
    agents,
    getTotalPipelineValue,
    getAverageWinRate,
    getTotalDeals,
    pipelineStages
  } = useSalesData();

  return (
    <div className="assistant-dashboard sophia">
      <div className="assistant-header">
        <div className="assistant-avatar" style={{ background: 'linear-gradient(135deg, var(--accent-purple, #8B5CF6) 0%, var(--color-d946ef, #D946EF) 100%)' }}>
          <Users size={28} />
        </div>
        <div className="assistant-info">
          <h2>Sophia - Sales Pipeline Manager</h2>
          <p>Manages sales pipeline, lead assignments, deal tracking, and sales performance analytics</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Active
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.2)', color: 'var(--accent-purple, #8B5CF6)' }}>
            <Target size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{getTotalDeals()}</span>
            <span className="stat-label">Active Deals</span>
          </div>
          <span className="stat-change positive"><ArrowUp size={14} /> 12%</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-green, #10B981)' }}>
            <DollarSign size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">AED {(getTotalPipelineValue() / 1000000).toFixed(0)}M</span>
            <span className="stat-label">Pipeline Value</span>
          </div>
          <span className="stat-change positive"><ArrowUp size={14} /> 8%</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: 'var(--accent-gold, #F59E0B)' }}>
            <TrendingUp size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{getAverageWinRate()}%</span>
            <span className="stat-label">Win Rate</span>
          </div>
          <span className="stat-change positive"><ArrowUp size={14} /> 5%</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--accent-red, #EF4444)' }}>
            <Clock size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">18 days</span>
            <span className="stat-label">Avg. Cycle</span>
          </div>
          <span className="stat-change negative"><ArrowDown size={14} /> 3 days</span>
        </div>
      </div>

      <div className="assistant-tabs">
        {['pipeline', 'deals', 'agents', 'forecasting', 'lifecycle'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'pipeline' && (
          <PipelineTab 
            data={{ pipelineStages }}
            selectedStage={selectedStage || ''}
            onSelectStage={handleSelectStage}
          />
        )}

        {activeTab === 'deals' && (
          <DealsTab 
            deals={filteredDeals}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterAgent={filterAgent}
            onFilterChange={setFilterAgent}
          />
        )}

        {activeTab === 'agents' && (
          <AgentsTab agents={agents} />
        )}

        {activeTab === 'forecasting' && (
          <ForecastingTab />
        )}

        {activeTab === 'lifecycle' && (
          <AssistantLifecycleTab assistantId="sophia" color="#8B5CF6" assistantName="Sophia" />
        )}
      </div>
    </div>
  );
};

export default SophiaSalesCRM;
