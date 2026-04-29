import React, { useState, useEffect } from 'react';
import { Building2, Users, Bot, Plus, Search, ChevronRight, Edit2, Trash2 } from 'lucide-react';

const DEPARTMENTS = [
  { id: 'executive', name: 'Executive Office', head: 'Arslan Malik', employees: 5, assistants: ['Zoe'], color: '#10B981', description: 'Strategic leadership and decision-making' },
  { id: 'operations', name: 'Operations', head: 'Operations Manager', employees: 15, assistants: ['Mary', 'Vesta'], color: '#3B82F6', description: 'Property management and inventory' },
  { id: 'sales', name: 'Sales', head: 'Sales Director', employees: 20, assistants: ['Clara', 'Sophia', 'Hunter', 'Kairos'], color: '#8B5CF6', description: 'Property sales and client relations' },
  { id: 'leasing', name: 'Leasing', head: 'Leasing Manager', employees: 12, assistants: ['Daisy'], color: '#EC4899', description: 'Rental and tenancy management' },
  { id: 'communications', name: 'Communications', head: 'Communications Lead', employees: 8, assistants: ['Linda', 'Nina', 'Juno'], color: '#25D366', description: 'WhatsApp, email, and client comms' },
  { id: 'marketing', name: 'Marketing', head: 'Marketing Director', employees: 10, assistants: ['Olivia', 'Cipher'], color: '#F59E0B', description: 'Brand, campaigns, and market research' },
  { id: 'finance', name: 'Finance', head: 'CFO', employees: 8, assistants: ['Theodora', 'Maven'], color: '#EF4444', description: 'Accounting, invoicing, and investments' },
  { id: 'legal', name: 'Legal & Compliance', head: 'Legal Counsel', employees: 6, assistants: ['Evangeline', 'Laila', 'Henry'], color: '#6366F1', description: 'Contracts, compliance, and auditing' },
  { id: 'technology', name: 'Technology', head: 'CTO', employees: 12, assistants: ['Aurora', 'Hazel', 'Willow', 'Sentinel', 'Atlas'], color: '#0EA5E9', description: 'Development, infrastructure, and AI' },
  { id: 'hr', name: 'Human Resources', head: 'HR Director', employees: 7, assistants: ['Nancy'], color: '#A855F7', description: 'Recruitment, training, and employee relations' },
];

export default function DepartmentsCRMTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState(null);

  const filteredDepts = DEPARTMENTS.filter(dept =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.head.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="crm-main-header">
        <div>
          <h1 className="crm-main-title">Departments</h1>
          <p className="crm-main-subtitle">Manage company departments and organizational structure</p>
        </div>
        <button className="crm-btn crm-btn-primary">
          <Plus size={18} /> Add Department
        </button>
      </div>

      <div className="crm-stats-grid">
        <div className="crm-stat-card">
          <div className="crm-stat-icon navy"><Building2 size={24} /></div>
          <div className="crm-stat-content">
            <div className="crm-stat-value">{DEPARTMENTS.length}</div>
            <div className="crm-stat-label">Total Departments</div>
          </div>
        </div>
        <div className="crm-stat-card">
          <div className="crm-stat-icon success"><Users size={24} /></div>
          <div className="crm-stat-content">
            <div className="crm-stat-value">{DEPARTMENTS.reduce((sum, d) => sum + d.employees, 0)}</div>
            <div className="crm-stat-label">Total Employees</div>
          </div>
        </div>
        <div className="crm-stat-card">
          <div className="crm-stat-icon info"><Bot size={24} /></div>
          <div className="crm-stat-content">
            <div className="crm-stat-value">32</div>
            <div className="crm-stat-label">AI Assistants</div>
          </div>
        </div>
      </div>

      <div className="crm-card" style={{ marginBottom: '16px' }}>
        <div className="crm-search" style={{ maxWidth: '100%' }}>
          <Search size={18} className="crm-search-icon" />
          <input
            type="text"
            className="crm-search-input"
            placeholder="Search departments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {filteredDepts.map((dept) => (
          <div 
            key={dept.id} 
            className="crm-card"
            onClick={() => setSelectedDept(dept.id)}
            style={{ cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: dept.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '700',
                fontSize: '1.25rem'
              }}>
                {dept.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {dept.name}
                </h3>
                <p style={{ margin: '0 0 8px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  {dept.description}
                </p>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                    <Users size={14} /> {dept.employees} employees
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                    <Bot size={14} /> {dept.assistants.length} AI
                  </span>
                </div>
              </div>
              <ChevronRight size={20} style={{ color: 'var(--text-muted)' }} />
            </div>
            
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Department Head</div>
              <div style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)' }}>{dept.head}</div>
            </div>

            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>AI Assistants</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {dept.assistants.map((assistant, idx) => (
                  <span 
                    key={idx}
                    style={{
                      fontSize: '0.75rem',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      background: `${dept.color}20`,
                      color: dept.color,
                      fontWeight: '500'
                    }}
                  >
                    {assistant}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
              <button className="crm-btn crm-btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '8px' }}>
                <Edit2 size={14} /> Edit
              </button>
              <button className="crm-btn crm-btn-secondary" style={{ padding: '8px', color: '#EF4444' }}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
