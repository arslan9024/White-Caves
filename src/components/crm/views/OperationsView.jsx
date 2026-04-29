import React from 'react';
import { Building2, Users, Network, Calendar, UserPlus, Briefcase } from 'lucide-react';

const DEPARTMENTS = [
  { id: 'executive', name: 'Executive', head: 'Zoe', employees: 3, color: '#8B5CF6' },
  { id: 'sales', name: 'Sales', head: 'Ella', employees: 8, color: '#10B981' },
  { id: 'operations', name: 'Operations', head: 'Marcus', employees: 12, color: '#F59E0B' },
  { id: 'marketing', name: 'Marketing', head: 'Ivy', employees: 6, color: '#EC4899' },
  { id: 'finance', name: 'Finance', head: 'Max', employees: 4, color: '#3B82F6' },
  { id: 'legal', name: 'Legal & Compliance', head: 'Leo', employees: 5, color: '#EF4444' },
  { id: 'technology', name: 'Technology', head: 'Aurora', employees: 6, color: '#6366F1' },
  { id: 'hr', name: 'Human Resources', head: 'Kevin', employees: 3, color: '#14B8A6' },
  { id: 'communications', name: 'Communications', head: 'Walter', employees: 4, color: '#F97316' },
  { id: 'intelligence', name: 'Intelligence', head: 'Mary', employees: 2, color: '#8B5CF6' },
  { id: 'leasing', name: 'Leasing', head: 'Nina', employees: 5, color: '#84CC16' },
];

const EMPLOYEES = [
  { id: 1, name: 'Ahmed Hassan', role: 'Senior Agent', dept: 'Sales', status: 'active' },
  { id: 2, name: 'Fatima Al Maktoum', role: 'Marketing Manager', dept: 'Marketing', status: 'active' },
  { id: 3, name: 'Mohammed Rashid', role: 'Property Consultant', dept: 'Sales', status: 'active' },
  { id: 4, name: 'Sara Abdullah', role: 'Finance Analyst', dept: 'Finance', status: 'active' },
  { id: 5, name: 'Omar Khalid', role: 'Legal Counsel', dept: 'Legal', status: 'active' },
];

const TEAMS = [
  { id: 1, name: 'Luxury Properties Team', members: 5, lead: 'Ahmed Hassan' },
  { id: 2, name: 'Off-Plan Specialists', members: 4, lead: 'Mohammed Rashid' },
  { id: 3, name: 'Rental Management', members: 6, lead: 'Sara Abdullah' },
];

export default function OperationsView({ activeSubItem, subItemConfig, assistantContext }) {
  const renderDepartments = () => (
    <div className="departments-view">
      <h2 className="view-title">Departments</h2>
      <p className="view-subtitle">Organization structure with 11 departments</p>
      <div className="departments-grid">
        {DEPARTMENTS.map(dept => (
          <div key={dept.id} className="department-card" style={{ borderTopColor: dept.color }}>
            <div className="dept-header">
              <Building2 size={20} color={dept.color} />
              <h4>{dept.name}</h4>
            </div>
            <div className="dept-stats">
              <div className="dept-stat">
                <span className="dept-stat-value">{dept.employees}</span>
                <span className="dept-stat-label">Employees</span>
              </div>
              <div className="dept-stat">
                <span className="dept-stat-value">{dept.head}</span>
                <span className="dept-stat-label">AI Lead</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEmployees = () => (
    <div className="employees-view">
      <h2 className="view-title">Employees</h2>
      <p className="view-subtitle">Staff directory and management</p>
      <div className="data-table">
        <div className="table-header">
          <div className="table-cell">Name</div>
          <div className="table-cell">Role</div>
          <div className="table-cell">Department</div>
          <div className="table-cell">Status</div>
          <div className="table-cell">Actions</div>
        </div>
        {EMPLOYEES.map(emp => (
          <div key={emp.id} className="table-row">
            <div className="table-cell">
              <div className="employee-avatar">{emp.name.split(' ').map(n => n[0]).join('')}</div>
              {emp.name}
            </div>
            <div className="table-cell">{emp.role}</div>
            <div className="table-cell">{emp.dept}</div>
            <div className="table-cell">
              <span className={`status-badge ${emp.status}`}>{emp.status}</span>
            </div>
            <div className="table-cell">
              <button className="action-btn">Edit</button>
              <button className="action-btn">View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTeams = () => (
    <div className="teams-view">
      <h2 className="view-title">Teams</h2>
      <p className="view-subtitle">Team assignments and structure</p>
      <div className="teams-grid">
        {TEAMS.map(team => (
          <div key={team.id} className="team-card">
            <Network size={24} color="var(--crm-gold)" />
            <h4>{team.name}</h4>
            <div className="team-stats">
              <span>{team.members} members</span>
              <span>Lead: {team.lead}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderScheduling = () => (
    <div className="scheduling-view">
      <h2 className="view-title">Scheduling</h2>
      <p className="view-subtitle">Calendar and appointment management</p>
      <div className="calendar-placeholder">
        <Calendar size={48} color="var(--crm-gold)" />
        <p>Calendar integration coming soon</p>
      </div>
    </div>
  );

  const renderOnboarding = () => (
    <div className="onboarding-view">
      <h2 className="view-title">Onboarding</h2>
      <p className="view-subtitle">New hire onboarding workflows</p>
      <div className="onboarding-stats">
        <div className="onboard-stat">
          <UserPlus size={32} color="var(--crm-gold)" />
          <div className="onboard-value">3</div>
          <div className="onboard-label">Pending Onboardings</div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSubItem) {
      case 'departments':
        return renderDepartments();
      case 'employees':
        return renderEmployees();
      case 'teams':
        return renderTeams();
      case 'scheduling':
        return renderScheduling();
      case 'onboarding':
        return renderOnboarding();
      default:
        return renderDepartments();
    }
  };

  return (
    <div className="view-container operations-view">
      {renderContent()}
    </div>
  );
}
