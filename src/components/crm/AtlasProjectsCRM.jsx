import React, { useState } from 'react';
import { 
  Map, Building, Calculator, Grid, Target,
  Calendar, Users, TrendingUp, Clock, CheckCircle,
  ArrowUp, ArrowDown, Filter, Search, Eye, Plus, MapPin
} from 'lucide-react';
import AssistantDocsTab from './shared/AssistantDocsTab';
import './AssistantDashboard.css';

const PROJECTS = [
  { id: 1, name: 'Marina Vista Tower', developer: 'Emaar', area: 'Dubai Marina', type: 'Residential', units: 450, completion: 'Q4 2025', status: 'on_track', roi: '12%', priceRange: 'AED 1.2M - 4.5M' },
  { id: 2, name: 'Business Bay Heights', developer: 'DAMAC', area: 'Business Bay', type: 'Mixed Use', units: 320, completion: 'Q2 2025', status: 'ahead', roi: '15%', priceRange: 'AED 900K - 3.2M' },
  { id: 3, name: 'Creek Harbour Residences', developer: 'Emaar', area: 'Dubai Creek', type: 'Residential', units: 680, completion: 'Q1 2026', status: 'on_track', roi: '10%', priceRange: 'AED 1.5M - 6.8M' },
  { id: 4, name: 'JVC Central', developer: 'Sobha', area: 'JVC', type: 'Residential', units: 280, completion: 'Q3 2024', status: 'delayed', roi: '8%', priceRange: 'AED 650K - 1.8M' },
  { id: 5, name: 'Palm Gateway', developer: 'Nakheel', area: 'Palm Jumeirah', type: 'Luxury', units: 120, completion: 'Q4 2024', status: 'on_track', roi: '18%', priceRange: 'AED 5M - 25M' }
];

const DEVELOPERS = [
  { id: 1, name: 'Emaar Properties', projects: 45, delivered: 38, onTime: '94%', rating: 4.8 },
  { id: 2, name: 'DAMAC Properties', projects: 32, delivered: 24, onTime: '82%', rating: 4.2 },
  { id: 3, name: 'Sobha Realty', projects: 18, delivered: 15, onTime: '96%', rating: 4.7 },
  { id: 4, name: 'Nakheel', projects: 28, delivered: 22, onTime: '88%', rating: 4.5 }
];

const MARKET_GAPS = [
  { id: 1, area: 'Dubai South', gap: 'Affordable Family Villas', demand: 'High', competition: 'Low', opportunity: 'Excellent' },
  { id: 2, area: 'Al Furjan', gap: 'Mid-Range Apartments', demand: 'Medium', competition: 'Medium', opportunity: 'Good' },
  { id: 3, area: 'MBR City', gap: 'Luxury Townhouses', demand: 'High', competition: 'Medium', opportunity: 'Good' },
  { id: 4, area: 'Arjan', gap: 'Studio Apartments', demand: 'Very High', competition: 'Low', opportunity: 'Excellent' }
];

const AtlasProjectsCRM = () => {
  const [activeTab, setActiveTab] = useState('projects');

  const getStatusColor = (status) => {
    switch (status) {
      case 'ahead': return '#10B981';
      case 'on_track': return '#3B82F6';
      case 'delayed': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <div className="assistant-dashboard atlas">
      <div className="assistant-header">
        <div className="assistant-avatar" style={{ background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' }}>
          <Map size={28} />
        </div>
        <div className="assistant-info">
          <h2>Atlas - Development & Project Intelligence</h2>
          <p>Analyzes zoning, DLC master plans, market gaps, and developer track records to identify high-potential off-plan projects for investment or brokerage</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Active
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#6366F1' }}>
            <Building size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">156</span>
            <span className="stat-label">Projects Tracked</span>
          </div>
          <span className="stat-change positive"><ArrowUp size={14} /> 12 new</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}>
            <CheckCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">89%</span>
            <span className="stat-label">On-Track Rate</span>
          </div>
          <span className="stat-change positive">Industry avg: 78%</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' }}>
            <Target size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">4</span>
            <span className="stat-label">Market Gaps</span>
          </div>
          <span className="stat-change">High opportunity</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#8B5CF6' }}>
            <TrendingUp size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">14%</span>
            <span className="stat-label">Avg. ROI</span>
          </div>
          <span className="stat-change positive"><ArrowUp size={14} /> 2%</span>
        </div>
      </div>

      <div className="assistant-tabs">
        {['projects', 'developers', 'feasibility', 'gaps', 'docs'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'docs' ? 'Documentation' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'projects' && (
          <div className="projects-view">
            <div className="view-header">
              <div className="search-box">
                <Search size={16} />
                <input type="text" placeholder="Search projects..." />
              </div>
              <div className="filter-group">
                <select>
                  <option value="all">All Developers</option>
                  <option value="emaar">Emaar</option>
                  <option value="damac">DAMAC</option>
                  <option value="sobha">Sobha</option>
                </select>
                <select>
                  <option value="all">All Status</option>
                  <option value="on_track">On Track</option>
                  <option value="ahead">Ahead</option>
                  <option value="delayed">Delayed</option>
                </select>
              </div>
            </div>
            <div className="projects-grid">
              {PROJECTS.map(project => (
                <div key={project.id} className="project-card">
                  <div className="project-header">
                    <h4>{project.name}</h4>
                    <span className="project-status" style={{ 
                      background: `${getStatusColor(project.status)}20`,
                      color: getStatusColor(project.status)
                    }}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="project-developer">{project.developer}</div>
                  <div className="project-details">
                    <span><MapPin size={14} /> {project.area}</span>
                    <span><Building size={14} /> {project.units} units</span>
                    <span><Calendar size={14} /> {project.completion}</span>
                  </div>
                  <div className="project-price">{project.priceRange}</div>
                  <div className="project-roi">
                    <span>Expected ROI:</span>
                    <span className="roi-value">{project.roi}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'developers' && (
          <div className="developers-view">
            <h3>Developer Track Records</h3>
            <div className="developers-grid">
              {DEVELOPERS.map(dev => (
                <div key={dev.id} className="developer-card">
                  <h4>{dev.name}</h4>
                  <div className="developer-stats">
                    <div className="dev-stat">
                      <span className="stat-value">{dev.projects}</span>
                      <span className="stat-label">Projects</span>
                    </div>
                    <div className="dev-stat">
                      <span className="stat-value">{dev.delivered}</span>
                      <span className="stat-label">Delivered</span>
                    </div>
                    <div className="dev-stat">
                      <span className="stat-value">{dev.onTime}</span>
                      <span className="stat-label">On-Time</span>
                    </div>
                    <div className="dev-stat">
                      <span className="stat-value">⭐ {dev.rating}</span>
                      <span className="stat-label">Rating</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'feasibility' && (
          <div className="feasibility-view">
            <h3>Feasibility Analysis</h3>
            <div className="empty-state">
              <Calculator size={48} />
              <p>Select a project to run feasibility analysis</p>
              <button className="add-btn"><Plus size={16} /> New Analysis</button>
            </div>
          </div>
        )}

        {activeTab === 'gaps' && (
          <div className="gaps-view">
            <h3>Market Gap Detection</h3>
            <div className="gaps-list">
              {MARKET_GAPS.map(gap => (
                <div key={gap.id} className="gap-card">
                  <div className="gap-header">
                    <MapPin size={20} />
                    <h4>{gap.area}</h4>
                  </div>
                  <p className="gap-description">{gap.gap}</p>
                  <div className="gap-metrics">
                    <span>Demand: <strong>{gap.demand}</strong></span>
                    <span>Competition: <strong>{gap.competition}</strong></span>
                    <span className={`opportunity ${gap.opportunity.toLowerCase()}`}>
                      {gap.opportunity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <AssistantDocsTab 
            assistantId="atlas" 
            assistantName="Atlas" 
            assistantColor="#6366F1" 
          />
        )}
      </div>
    </div>
  );
};

export default AtlasProjectsCRM;
