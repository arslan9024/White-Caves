import React, { useState } from 'react';
import { Bot, Plus, Search, Zap, MessageSquare, Activity, Settings, Play, Pause, ChevronRight } from 'lucide-react';

const AI_ASSISTANTS = [
  { id: 'zoe', name: 'Zoe', role: 'Executive AI', dept: 'Executive', status: 'active', tasks: 156, accuracy: 98, color: '#10B981', description: 'Strategic decisions and executive support' },
  { id: 'mary', name: 'Mary', role: 'Inventory Manager', dept: 'Operations', status: 'active', tasks: 234, accuracy: 96, color: '#3B82F6', description: 'Property inventory and availability tracking' },
  { id: 'clara', name: 'Clara', role: 'Lead Manager', dept: 'Sales', status: 'active', tasks: 312, accuracy: 94, color: '#8B5CF6', description: 'Lead scoring, qualification, and routing' },
  { id: 'linda', name: 'Linda', role: 'WhatsApp Manager', dept: 'Communications', status: 'active', tasks: 456, accuracy: 97, color: '#25D366', description: 'WhatsApp automation and customer support' },
  { id: 'nina', name: 'Nina', role: 'Chatbot Specialist', dept: 'Communications', status: 'active', tasks: 789, accuracy: 95, color: '#06B6D4', description: 'Website chatbot and AI conversations' },
  { id: 'nancy', name: 'Nancy', role: 'HR Coordinator', dept: 'HR', status: 'active', tasks: 123, accuracy: 92, color: '#A855F7', description: 'Recruitment, onboarding, and HR support' },
  { id: 'sophia', name: 'Sophia', role: 'Sales Negotiator', dept: 'Sales', status: 'active', tasks: 198, accuracy: 93, color: '#EC4899', description: 'Deal negotiation and contract preparation' },
  { id: 'daisy', name: 'Daisy', role: 'Leasing Specialist', dept: 'Leasing', status: 'active', tasks: 267, accuracy: 95, color: '#F59E0B', description: 'Tenancy management and renewals' },
  { id: 'theodora', name: 'Theodora', role: 'CFO Intelligence', dept: 'Finance', status: 'active', tasks: 145, accuracy: 99, color: '#EF4444', description: 'Financial analysis and reporting' },
  { id: 'olivia', name: 'Olivia', role: 'Marketing Automation', dept: 'Marketing', status: 'active', tasks: 234, accuracy: 91, color: '#F97316', description: 'Campaign automation and analytics' },
  { id: 'laila', name: 'Laila', role: 'Compliance Officer', dept: 'Compliance', status: 'active', tasks: 178, accuracy: 99, color: '#6366F1', description: 'Regulatory compliance and KYC/AML' },
  { id: 'aurora', name: 'Aurora', role: 'CTO Intelligence', dept: 'Technology', status: 'active', tasks: 89, accuracy: 97, color: '#0EA5E9', description: 'Technical strategy and system monitoring' },
  { id: 'hazel', name: 'Hazel', role: 'Frontend Developer', dept: 'Technology', status: 'active', tasks: 156, accuracy: 94, color: '#14B8A6', description: 'UI/UX improvements and frontend tasks' },
  { id: 'willow', name: 'Willow', role: 'Backend Developer', dept: 'Technology', status: 'active', tasks: 178, accuracy: 96, color: '#22C55E', description: 'API development and integrations' },
  { id: 'evangeline', name: 'Evangeline', role: 'Legal Advisor', dept: 'Legal', status: 'active', tasks: 134, accuracy: 98, color: '#DC2626', description: 'Contract review and legal guidance' },
  { id: 'sentinel', name: 'Sentinel', role: 'Security Monitor', dept: 'Technology', status: 'active', tasks: 567, accuracy: 99, color: '#64748B', description: 'Security monitoring and threat detection' },
  { id: 'hunter', name: 'Hunter', role: 'Lead Prospector', dept: 'Sales', status: 'active', tasks: 345, accuracy: 88, color: '#854D0E', description: 'Lead generation and prospecting' },
  { id: 'henry', name: 'Henry', role: 'Audit Specialist', dept: 'Compliance', status: 'active', tasks: 123, accuracy: 99, color: '#4338CA', description: 'Internal auditing and compliance checks' },
  { id: 'cipher', name: 'Cipher', role: 'Market Analyst', dept: 'Marketing', status: 'active', tasks: 189, accuracy: 95, color: '#7C3AED', description: 'Market intelligence and competitor analysis' },
  { id: 'atlas', name: 'Atlas', role: 'Project Manager', dept: 'Technology', status: 'active', tasks: 234, accuracy: 92, color: '#0891B2', description: 'Project tracking and resource allocation' },
  { id: 'vesta', name: 'Vesta', role: 'Handover Coordinator', dept: 'Operations', status: 'active', tasks: 156, accuracy: 96, color: '#059669', description: 'Property handover and documentation' },
  { id: 'juno', name: 'Juno', role: 'Community Manager', dept: 'Communications', status: 'active', tasks: 278, accuracy: 93, color: '#DB2777', description: 'Community engagement and social media' },
  { id: 'kairos', name: 'Kairos', role: 'Luxury Specialist', dept: 'Sales', status: 'active', tasks: 89, accuracy: 97, color: '#E31E24', description: 'Ultra-luxury property transactions' },
  { id: 'maven', name: 'Maven', role: 'Investment Advisor', dept: 'Finance', status: 'active', tasks: 67, accuracy: 98, color: '#B45309', description: 'Investment analysis and portfolio advice' },
];

const DEPARTMENTS = ['All', 'Executive', 'Operations', 'Sales', 'Leasing', 'Communications', 'Marketing', 'Finance', 'Legal', 'Compliance', 'Technology', 'HR'];

export default function AIAssistantsCRMTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedAssistant, setSelectedAssistant] = useState(null);

  const filteredAssistants = AI_ASSISTANTS.filter(asst => {
    const matchesSearch = asst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asst.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || asst.dept === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div>
      <div className="crm-main-header">
        <div>
          <h1 className="crm-main-title">AI Assistants</h1>
          <p className="crm-main-subtitle">32 AI assistants across 10 departments</p>
        </div>
        <button className="crm-btn crm-btn-primary">
          <Plus size={18} /> Add Assistant
        </button>
      </div>

      <div className="crm-stats-grid">
        <div className="crm-stat-card">
          <div className="crm-stat-icon navy"><Bot size={24} /></div>
          <div className="crm-stat-content">
            <div className="crm-stat-value">32</div>
            <div className="crm-stat-label">Total Assistants</div>
          </div>
        </div>
        <div className="crm-stat-card">
          <div className="crm-stat-icon success"><Zap size={24} /></div>
          <div className="crm-stat-content">
            <div className="crm-stat-value">28</div>
            <div className="crm-stat-label">Active</div>
          </div>
        </div>
        <div className="crm-stat-card">
          <div className="crm-stat-icon gold"><MessageSquare size={24} /></div>
          <div className="crm-stat-content">
            <div className="crm-stat-value">5,678</div>
            <div className="crm-stat-label">Tasks Today</div>
          </div>
        </div>
        <div className="crm-stat-card">
          <div className="crm-stat-icon info"><Activity size={24} /></div>
          <div className="crm-stat-content">
            <div className="crm-stat-value">95.6%</div>
            <div className="crm-stat-label">Avg. Accuracy</div>
          </div>
        </div>
      </div>

      <div className="crm-tabs" style={{ marginBottom: '24px' }}>
        {DEPARTMENTS.slice(0, 8).map((dept) => (
          <button
            key={dept}
            className={`crm-tab ${selectedDept === dept ? 'active' : ''}`}
            onClick={() => setSelectedDept(dept)}
          >
            {dept}
          </button>
        ))}
      </div>

      <div className="crm-card" style={{ marginBottom: '16px' }}>
        <div className="crm-search" style={{ maxWidth: '100%' }}>
          <Search size={18} className="crm-search-icon" />
          <input
            type="text"
            className="crm-search-input"
            placeholder="Search assistants by name or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {filteredAssistants.map((assistant) => (
          <div 
            key={assistant.id} 
            className="crm-card"
            onClick={() => setSelectedAssistant(assistant.id)}
            style={{ cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: assistant.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '700',
                fontSize: '1.5rem'
              }}>
                {assistant.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {assistant.name}
                  </h3>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: assistant.status === 'active' ? '#10B981' : '#EF4444'
                  }} />
                </div>
                <div style={{ fontSize: '0.875rem', color: assistant.color, fontWeight: '500', marginBottom: '4px' }}>
                  {assistant.role}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {assistant.dept} Department
                </div>
              </div>
              <ChevronRight size={20} style={{ color: 'var(--text-muted)' }} />
            </div>
            
            <p style={{ margin: '16px 0 12px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {assistant.description}
            </p>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <div style={{ flex: 1, background: 'var(--surface-secondary)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>{assistant.tasks}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tasks</div>
              </div>
              <div style={{ flex: 1, background: 'var(--surface-secondary)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#10B981' }}>{assistant.accuracy}%</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Accuracy</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="crm-btn crm-btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '8px' }}>
                <MessageSquare size={14} /> Chat
              </button>
              <button className="crm-btn crm-btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '8px' }}>
                <Settings size={14} /> Configure
              </button>
              <button 
                className="crm-btn"
                style={{ 
                  padding: '8px 12px', 
                  background: assistant.status === 'active' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                  color: assistant.status === 'active' ? '#EF4444' : '#10B981'
                }}
              >
                {assistant.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
