import React, { useState } from 'react';
import { 
  Briefcase, Calendar, Clock, CheckCircle, Users,
  Video, Phone, Mail, FileText, AlertCircle, Bell,
  ArrowUp, ArrowDown, Plus, Search, MapPin, Star
} from 'lucide-react';
import './AssistantDashboard.css';

const MEETINGS = [
  { id: 1, title: 'Board Meeting Q1 Review', time: '10:00 AM', duration: '2h', type: 'board', attendees: 8, location: 'Conference Room A', status: 'upcoming' },
  { id: 2, title: 'Client Meeting - Al Rashid Family', time: '2:00 PM', duration: '1h', type: 'client', attendees: 4, location: 'VIP Room', status: 'upcoming' },
  { id: 3, title: 'Marketing Strategy Review', time: '4:00 PM', duration: '45m', type: 'internal', attendees: 5, location: 'Zoom', status: 'upcoming' },
  { id: 4, title: 'Property Tour - Palm Jumeirah', time: '9:00 AM', duration: '3h', type: 'site_visit', attendees: 3, location: 'Palm Jumeirah', status: 'completed' }
];

const TASKS = [
  { id: 1, title: 'Review Q1 Financial Report', priority: 'high', dueDate: '2024-01-10', status: 'in_progress', assignee: 'CEO' },
  { id: 2, title: 'Approve Marketing Budget', priority: 'medium', dueDate: '2024-01-12', status: 'pending', assignee: 'CEO' },
  { id: 3, title: 'Sign Partnership Agreement', priority: 'high', dueDate: '2024-01-09', status: 'completed', assignee: 'CEO' },
  { id: 4, title: 'Review New Agent Applications', priority: 'low', dueDate: '2024-01-15', status: 'pending', assignee: 'CEO' }
];

const EXECUTIVES = [
  { id: 1, name: 'Arslan Malik', role: 'CEO & Founder', avatar: '👨‍💼', status: 'available' },
  { id: 2, name: 'Fatima Hassan', role: 'COO', avatar: '👩‍💼', status: 'in_meeting' },
  { id: 3, name: 'Ahmed Al Rashid', role: 'CFO', avatar: '👨‍💻', status: 'available' },
  { id: 4, name: 'Sarah Al Maktoum', role: 'CMO', avatar: '👩‍💻', status: 'busy' }
];

const ZoeExecutiveCRM = () => {
  const [activeTab, setActiveTab] = useState('calendar');

  return (
    <div className="assistant-dashboard zoe">
      <div className="assistant-header">
        <div className="assistant-avatar" style={{ background: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)' }}>
          <Briefcase size={28} />
        </div>
        <div className="assistant-info">
          <h2>Zoe - Executive Assistant</h2>
          <p>Manages executive calendars, meeting scheduling, task delegation, and priority management</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Active
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(67, 233, 123, 0.2)', color: '#43E97B' }}>
            <Calendar size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">8</span>
            <span className="stat-label">Meetings Today</span>
          </div>
          <span className="stat-change">3 remaining</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' }}>
            <CheckCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">12</span>
            <span className="stat-label">Tasks Pending</span>
          </div>
          <span className="stat-change warning">4 urgent</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#8B5CF6' }}>
            <Users size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">4</span>
            <span className="stat-label">Executives</span>
          </div>
          <span className="stat-change">2 available</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}>
            <Bell size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">5</span>
            <span className="stat-label">Notifications</span>
          </div>
          <span className="stat-change">Unread</span>
        </div>
      </div>

      <div className="assistant-tabs">
        {['calendar', 'tasks', 'executives', 'reports'].map(tab => (
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
        {activeTab === 'calendar' && (
          <div className="calendar-view">
            <div className="view-header">
              <h3>Today's Schedule - January 8, 2024</h3>
              <button className="add-btn"><Plus size={16} /> New Meeting</button>
            </div>
            <div className="meetings-list">
              {MEETINGS.map(meeting => (
                <div key={meeting.id} className={`meeting-card ${meeting.status}`}>
                  <div className="meeting-time">
                    <span className="time">{meeting.time}</span>
                    <span className="duration">{meeting.duration}</span>
                  </div>
                  <div className="meeting-details">
                    <h4>{meeting.title}</h4>
                    <div className="meeting-meta">
                      <span><Users size={12} /> {meeting.attendees} attendees</span>
                      <span><MapPin size={12} /> {meeting.location}</span>
                    </div>
                  </div>
                  <div className={`meeting-type ${meeting.type}`}>{meeting.type.replace('_', ' ')}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="tasks-view">
            <div className="view-header">
              <div className="search-box">
                <Search size={16} />
                <input type="text" placeholder="Search tasks..." />
              </div>
              <button className="add-btn"><Plus size={16} /> Add Task</button>
            </div>
            <div className="tasks-list">
              {TASKS.map(task => (
                <div key={task.id} className={`task-card ${task.priority}`}>
                  <div className="task-checkbox">
                    {task.status === 'completed' ? <CheckCircle size={20} /> : <div className="checkbox"></div>}
                  </div>
                  <div className="task-details">
                    <h4 className={task.status === 'completed' ? 'completed' : ''}>{task.title}</h4>
                    <div className="task-meta">
                      <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
                      <span><Clock size={12} /> Due: {task.dueDate}</span>
                    </div>
                  </div>
                  <div className={`task-status ${task.status}`}>{task.status.replace('_', ' ')}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'executives' && (
          <div className="executives-view">
            <h3>Executive Team</h3>
            <div className="executive-cards">
              {EXECUTIVES.map(exec => (
                <div key={exec.id} className="executive-card">
                  <div className="exec-avatar">{exec.avatar}</div>
                  <div className="exec-info">
                    <h4>{exec.name}</h4>
                    <p>{exec.role}</p>
                  </div>
                  <div className={`exec-status ${exec.status}`}>{exec.status.replace('_', ' ')}</div>
                  <div className="exec-actions">
                    <button><Calendar size={14} /></button>
                    <button><Mail size={14} /></button>
                    <button><Phone size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="reports-view">
            <h3>Executive Reports</h3>
            <p>Executive reports and briefings coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZoeExecutiveCRM;
