import React, { useState } from 'react';
import './ProductivityTools.css';

const ProductivityTools = () => {
  const [activeTab, setActiveTab] = useState('drive');
  const [isExpanded, setIsExpanded] = useState({});

  const toggleWidget = (widgetId) => {
    setIsExpanded(prev => ({
      ...prev,
      [widgetId]: !prev[widgetId]
    }));
  };

  const tools = [
    {
      id: 'drive',
      name: 'Google Drive',
      icon: '📁',
      description: 'Access your Owner documents folder',
      embedUrl: 'https://drive.google.com/embeddedfolderview?id=root#grid'
    },
    {
      id: 'calendar',
      name: 'Google Calendar',
      icon: '📅',
      description: "View your schedule",
      embedUrl: 'https://calendar.google.com/calendar/embed?mode=WEEK&showTitle=0&showNav=1&showPrint=0&showTabs=1&showCalendars=0'
    },
    {
      id: 'tasks',
      name: 'Google Tasks',
      icon: '✅',
      description: 'Manage your task list',
      embedUrl: 'https://tasks.google.com/embed/?origin=https://mail.google.com'
    },
    {
      id: 'keep',
      name: 'Google Keep',
      icon: '📝',
      description: 'Private notes and reminders',
      embedUrl: 'https://keep.google.com/'
    },
    {
      id: 'trello',
      name: 'Trello',
      icon: '📋',
      description: 'Project management boards',
      embedUrl: 'https://trello.com/'
    }
  ];

  const quickNotes = [
    { id: 1, title: 'Q4 Goals', content: 'Review agent performance metrics', date: 'Dec 27' },
    { id: 2, title: 'Property Launch', content: 'Marina Heights launching Jan 15', date: 'Dec 26' },
    { id: 3, title: 'Team Meeting', content: 'Weekly sync - Monday 10 AM', date: 'Dec 25' }
  ];

  const upcomingTasks = [
    { id: 1, task: 'Review monthly revenue report', priority: 'high', due: 'Today' },
    { id: 2, task: 'Approve new agent applications', priority: 'medium', due: 'Tomorrow' },
    { id: 3, task: 'Sign partnership agreement', priority: 'high', due: 'Dec 30' },
    { id: 4, task: 'Q4 performance review prep', priority: 'low', due: 'Jan 5' }
  ];

  const upcomingEvents = [
    { id: 1, title: 'Board Meeting', time: '10:00 AM', date: 'Today' },
    { id: 2, title: 'Property Viewing - Palm Jumeirah', time: '2:00 PM', date: 'Tomorrow' },
    { id: 3, title: 'Investor Call', time: '11:00 AM', date: 'Dec 30' }
  ];

  return (
    <div className="productivity-tools">
      <div className="productivity-header">
        <h2>Productivity Tools</h2>
        <p className="productivity-subtitle">Owner-exclusive workspace applications</p>
      </div>

      <div className="productivity-layout">
        <div className="tools-sidebar">
          <div className="tools-nav">
            {tools.map(tool => (
              <button
                key={tool.id}
                className={`tool-nav-btn ${activeTab === tool.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tool.id)}
              >
                <span className="tool-icon">{tool.icon}</span>
                <span className="tool-name">{tool.name}</span>
              </button>
            ))}
          </div>

          <div className="quick-widgets">
            <div className="widget-card tasks-widget">
              <div className="widget-header" onClick={() => toggleWidget('tasks')}>
                <h4>My Tasks</h4>
                <span className="widget-toggle">{isExpanded.tasks ? '−' : '+'}</span>
              </div>
              <div className={`widget-content ${isExpanded.tasks ? 'expanded' : ''}`}>
                {upcomingTasks.map(task => (
                  <div key={task.id} className={`task-item priority-${task.priority}`}>
                    <input type="checkbox" className="task-checkbox" />
                    <div className="task-details">
                      <span className="task-text">{task.task}</span>
                      <span className="task-due">{task.due}</span>
                    </div>
                  </div>
                ))}
                <button className="add-task-btn">+ Add Task</button>
              </div>
            </div>

            <div className="widget-card events-widget">
              <div className="widget-header" onClick={() => toggleWidget('events')}>
                <h4>Upcoming Events</h4>
                <span className="widget-toggle">{isExpanded.events ? '−' : '+'}</span>
              </div>
              <div className={`widget-content ${isExpanded.events ? 'expanded' : ''}`}>
                {upcomingEvents.map(event => (
                  <div key={event.id} className="event-item">
                    <div className="event-time">
                      <span className="event-date">{event.date}</span>
                      <span className="event-hour">{event.time}</span>
                    </div>
                    <span className="event-title">{event.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="widget-card notes-widget">
              <div className="widget-header" onClick={() => toggleWidget('notes')}>
                <h4>Quick Notes</h4>
                <span className="widget-toggle">{isExpanded.notes ? '−' : '+'}</span>
              </div>
              <div className={`widget-content ${isExpanded.notes ? 'expanded' : ''}`}>
                {quickNotes.map(note => (
                  <div key={note.id} className="note-item">
                    <div className="note-header">
                      <span className="note-title">{note.title}</span>
                      <span className="note-date">{note.date}</span>
                    </div>
                    <p className="note-content">{note.content}</p>
                  </div>
                ))}
                <button className="add-note-btn">+ Add Note</button>
              </div>
            </div>
          </div>
        </div>

        <div className="tools-main">
          <div className="tool-panel">
            <div className="tool-panel-header">
              <span className="panel-icon">{tools.find(t => t.id === activeTab)?.icon}</span>
              <div className="panel-info">
                <h3>{tools.find(t => t.id === activeTab)?.name}</h3>
                <p>{tools.find(t => t.id === activeTab)?.description}</p>
              </div>
              <a 
                href={tools.find(t => t.id === activeTab)?.embedUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="open-external-btn"
              >
                Open in New Tab
              </a>
            </div>
            <div className="tool-embed-container">
              {activeTab === 'drive' && (
                <div className="tool-placeholder">
                  <div className="placeholder-icon">📁</div>
                  <h3>Google Drive - Owner Folder</h3>
                  <p>Access your private document storage</p>
                  <div className="folder-structure">
                    <div className="folder-item">📂 Contracts</div>
                    <div className="folder-item">📂 Financial Reports</div>
                    <div className="folder-item">📂 Agent Documents</div>
                    <div className="folder-item">📂 Legal Documents</div>
                    <div className="folder-item">📂 Marketing Materials</div>
                  </div>
                  <a 
                    href="https://drive.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="access-btn"
                  >
                    Access Google Drive
                  </a>
                </div>
              )}
              {activeTab === 'calendar' && (
                <div className="tool-placeholder">
                  <div className="placeholder-icon">📅</div>
                  <h3>Google Calendar</h3>
                  <p>View and manage your schedule</p>
                  <div className="calendar-preview">
                    <div className="calendar-day">
                      <span className="day-name">Today</span>
                      <div className="day-events">
                        <div className="calendar-event">10:00 AM - Board Meeting</div>
                        <div className="calendar-event">2:00 PM - Property Inspection</div>
                      </div>
                    </div>
                    <div className="calendar-day">
                      <span className="day-name">Tomorrow</span>
                      <div className="day-events">
                        <div className="calendar-event">9:00 AM - Team Standup</div>
                        <div className="calendar-event">3:00 PM - Client Meeting</div>
                      </div>
                    </div>
                  </div>
                  <a 
                    href="https://calendar.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="access-btn"
                  >
                    Open Google Calendar
                  </a>
                </div>
              )}
              {activeTab === 'tasks' && (
                <div className="tool-placeholder">
                  <div className="placeholder-icon">✅</div>
                  <h3>Google Tasks</h3>
                  <p>Manage your task list</p>
                  <div className="tasks-preview">
                    {upcomingTasks.map(task => (
                      <div key={task.id} className={`preview-task priority-${task.priority}`}>
                        <input type="checkbox" />
                        <span>{task.task}</span>
                        <span className="task-badge">{task.due}</span>
                      </div>
                    ))}
                  </div>
                  <a 
                    href="https://tasks.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="access-btn"
                  >
                    Open Google Tasks
                  </a>
                </div>
              )}
              {activeTab === 'keep' && (
                <div className="tool-placeholder">
                  <div className="placeholder-icon">📝</div>
                  <h3>Google Keep</h3>
                  <p>Private notes and reminders</p>
                  <div className="keep-preview">
                    {quickNotes.map(note => (
                      <div key={note.id} className="keep-note">
                        <strong>{note.title}</strong>
                        <p>{note.content}</p>
                      </div>
                    ))}
                  </div>
                  <a 
                    href="https://keep.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="access-btn"
                  >
                    Open Google Keep
                  </a>
                </div>
              )}
              {activeTab === 'trello' && (
                <div className="tool-placeholder">
                  <div className="placeholder-icon">📋</div>
                  <h3>Trello</h3>
                  <p>Project management boards</p>
                  <div className="trello-preview">
                    <div className="trello-column">
                      <h4>To Do</h4>
                      <div className="trello-card">Review new listings</div>
                      <div className="trello-card">Update website content</div>
                    </div>
                    <div className="trello-column">
                      <h4>In Progress</h4>
                      <div className="trello-card">Agent onboarding</div>
                    </div>
                    <div className="trello-column">
                      <h4>Done</h4>
                      <div className="trello-card">Q3 report</div>
                    </div>
                  </div>
                  <a 
                    href="https://trello.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="access-btn"
                  >
                    Open Trello
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductivityTools;
