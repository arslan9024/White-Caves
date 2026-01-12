import React, { useState, useCallback, useEffect } from 'react';
import { 
  Bot, MessageSquare, Code, Terminal, Play, Pause, RefreshCw, 
  Settings, Users, Phone, CheckCircle, XCircle, Clock, Zap,
  FileCode, Folder, ChevronRight, ChevronDown, Copy, Download,
  AlertTriangle, Activity, Send, QrCode, Smartphone, Wifi, Star, Plus,
  Megaphone, UserX, FileText, Table, Search, Filter, Trash2, Edit,
  Upload, BarChart3, Globe, Shield, Mail, Brain, Lock, Eye, Key,
  Timer, Languages, Map, Fingerprint, Shuffle
} from 'lucide-react';
import AssistantFeatureMatrix from './shared/AssistantFeatureMatrix';
import { BotSessionManager } from './shared';
import { NINA_FEATURES } from './data/assistantFeatures';
import './NinaWhatsAppBotCRM.css';

const DUMMY_BOTS = [
  {
    id: 'bot-1',
    name: 'Lion0',
    number: '+971501234567',
    status: 'connected',
    qrCode: null,
    messagesProcessed: 1247,
    responseRate: 98.5,
    avgResponseTime: '2.3s',
    lastActive: '2 min ago',
    uptime: '99.8%',
    features: ['Auto-Reply', 'Lead Scoring', 'Appointment Booking']
  },
  {
    id: 'bot-2',
    name: 'Lion1',
    number: '+971507654321',
    status: 'disconnected',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=WhatsAppSession',
    messagesProcessed: 856,
    responseRate: 95.2,
    avgResponseTime: '3.1s',
    lastActive: '1 hour ago',
    uptime: '87.3%',
    features: ['Auto-Reply', 'FAQ Bot']
  },
  {
    id: 'bot-3',
    name: 'Lion2',
    number: '+971509876543',
    status: 'pending',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=WhatsAppNewSession',
    messagesProcessed: 0,
    responseRate: 0,
    avgResponseTime: '-',
    lastActive: 'Never',
    uptime: '0%',
    features: []
  }
];

const PROJECTS = [
  { id: 1, name: 'Vardon', category: 'cluster', contacts: 245, lastSync: '2h ago' },
  { id: 2, name: 'Sanctuary', category: 'cluster', contacts: 312, lastSync: '1h ago' },
  { id: 4, name: 'Amazonia', category: 'cluster', contacts: 189, lastSync: '3h ago' },
  { id: 5, name: 'Pacifica', category: 'cluster', contacts: 156, lastSync: '30m ago' },
  { id: 6, name: 'Acuna', category: 'cluster', contacts: 278, lastSync: '45m ago' },
  { id: 10, name: 'Sycamore', category: 'cluster', contacts: 201, lastSync: '1h ago' },
  { id: 14, name: 'Claret', category: 'cluster', contacts: 167, lastSync: '2h ago' },
  { id: 15, name: 'Juniper', category: 'cluster', contacts: 223, lastSync: '1h ago' },
  { id: 26, name: 'Victoria', category: 'cluster', contacts: 189, lastSync: '4h ago' },
  { id: 30, name: 'Albizia', category: 'cluster', contacts: 145, lastSync: '2h ago' },
  { id: 33, name: 'Oxygen2023', category: 'campaign', contacts: 567, lastSync: '30m ago' },
  { id: 35, name: 'TAG2024', category: 'campaign', contacts: 423, lastSync: '1h ago' },
  { id: 48, name: 'Lagoons', category: 'cluster', contacts: 298, lastSync: '45m ago' }
];

const CAMPAIGNS = [
  { id: 'camp-1', name: 'Victoria Outreach', project: 'Victoria', status: 'running', sent: 145, total: 189, failed: 3, startedAt: '10:30 AM' },
  { id: 'camp-2', name: 'Lagoons Follow-up', project: 'Lagoons', status: 'paused', sent: 87, total: 298, failed: 1, startedAt: '09:15 AM' },
  { id: 'camp-3', name: 'Oxygen Blast', project: 'Oxygen2023', status: 'completed', sent: 567, total: 567, failed: 12, startedAt: 'Yesterday' }
];

const MESSAGE_TEMPLATES = [
  { id: 'tpl-1', name: 'Morning Greeting (EN)', category: 'greetings', language: 'en', preview: 'Good morning! How are you doing today?' },
  { id: 'tpl-2', name: 'Morning Greeting (AR)', category: 'greetings', language: 'ar', preview: 'صباح الخير! كيف حالك اليوم؟' },
  { id: 'tpl-3', name: 'Property Inquiry', category: 'property_inquiry', language: 'en', preview: 'Thank you for your interest in {property_name}...' },
  { id: 'tpl-4', name: 'Appointment Confirm', category: 'appointment', language: 'en', preview: 'Your viewing is confirmed for {date}...' },
  { id: 'tpl-5', name: 'D2 Campaign', category: 'campaigns', language: 'en', preview: 'Is your property still available for Sale or Rent?' },
  { id: 'tpl-6', name: 'Ramadan Greeting', category: 'greetings', language: 'bilingual', preview: 'Ramadan Kareem! رمضان كريم' }
];

const CODE_MODULES = [
  {
    name: 'WhatsAppBot',
    expanded: true,
    files: [
      { name: 'WhatsAppClientFactory.js', type: 'js', lines: 156 },
      { name: 'MessageRouter.js', type: 'js', lines: 189 },
      { name: 'BroadcastManager.js', type: 'js', lines: 234 },
      { name: 'RateLimiter.js', type: 'js', lines: 89 }
    ]
  },
  {
    name: 'Services',
    expanded: false,
    files: [
      { name: 'GoogleSheetsService.js', type: 'js', lines: 145 },
      { name: 'PhoneNumberService.js', type: 'js', lines: 178 },
      { name: 'ProjectService.js', type: 'js', lines: 112 },
      { name: 'CampaignService.js', type: 'js', lines: 198 }
    ]
  },
  {
    name: 'AI Services',
    expanded: false,
    files: [
      { name: 'AIServices.js', type: 'js', lines: 245 },
      { name: 'IntentClassifier.js', type: 'js', lines: 89 },
      { name: 'LeadScorer.js', type: 'js', lines: 112 },
      { name: 'SentimentAnalyzer.js', type: 'js', lines: 78 }
    ]
  },
  {
    name: 'Security',
    expanded: false,
    files: [
      { name: 'SecurityServices.js', type: 'js', lines: 198 },
      { name: 'EncryptedStorage.js', type: 'js', lines: 87 },
      { name: 'AuditLogger.js', type: 'js', lines: 112 },
      { name: 'AccessControl.js', type: 'js', lines: 145 }
    ]
  },
  {
    name: 'Scheduling',
    expanded: false,
    files: [
      { name: 'SchedulingServices.js', type: 'js', lines: 267 },
      { name: 'ISOCountryMapper.js', type: 'js', lines: 98 },
      { name: 'LocalTimeScheduler.js', type: 'js', lines: 134 },
      { name: 'BehavioralSimulator.js', type: 'js', lines: 89 }
    ]
  },
  {
    name: 'Templates',
    expanded: false,
    files: [
      { name: 'MessageTemplates.js', type: 'js', lines: 156 },
      { name: 'greetings.json', type: 'json', lines: 45 },
      { name: 'campaigns.json', type: 'json', lines: 32 }
    ]
  }
];

const TERMINAL_LOGS = [
  { time: '10:45:23', type: 'info', message: 'WhatsApp client initialized successfully' },
  { time: '10:45:24', type: 'success', message: 'Connected to session: Lion0' },
  { time: '10:45:25', type: 'info', message: 'Listening for incoming messages...' },
  { time: '10:46:01', type: 'message', message: 'New message from +971501234567: "Hello, I need info about properties"' },
  { time: '10:46:02', type: 'ai', message: 'Nina AI: Intent detected - Property Inquiry. Auto-reply sent.' },
  { time: '10:47:15', type: 'message', message: 'New message from +971507654321: "What is the price?"' },
  { time: '10:47:16', type: 'ai', message: 'Nina AI: Lead scored 85/100. Escalating to human agent.' },
  { time: '10:48:30', type: 'warning', message: 'Session Lion1 disconnected. Attempting reconnect...' },
  { time: '10:48:45', type: 'error', message: 'Reconnect failed. QR code scan required.' }
];

export default function NinaWhatsAppBotCRM() {
  const [bots, setBots] = useState(DUMMY_BOTS);
  const [selectedBot, setSelectedBot] = useState(DUMMY_BOTS[0]);
  const [activeTab, setActiveTab] = useState('sessions');
  const [ninaActive, setNinaActive] = useState(true);
  const [terminalLogs, setTerminalLogs] = useState(TERMINAL_LOGS);
  const [codeModules, setCodeModules] = useState(CODE_MODULES);
  const [terminalInput, setTerminalInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [projects, setProjects] = useState(PROJECTS);
  const [campaigns, setCampaigns] = useState(CAMPAIGNS);
  const [templates, setTemplates] = useState(MESSAGE_TEMPLATES);
  const [selectedProject, setSelectedProject] = useState(null);
  const [blocklist, setBlocklist] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const handleCreateBot = useCallback((newBot) => {
    const bot = {
      id: `bot-${Date.now()}`,
      name: newBot.name,
      number: newBot.number,
      status: 'pending',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=WhatsAppNewSession',
      messagesProcessed: 0,
      responseRate: 0,
      avgResponseTime: '-',
      lastActive: 'Never',
      uptime: '0%',
      features: []
    };
    setBots(prev => [...prev, bot]);
    
    const log = {
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      type: 'info',
      message: `Created new bot session: ${newBot.name} (${newBot.number})`
    };
    setTerminalLogs(prev => [...prev, log]);
  }, []);
  
  const handleDeleteBot = useCallback((botId) => {
    const bot = bots.find(b => b.id === botId);
    setBots(prev => prev.filter(b => b.id !== botId));
    
    const log = {
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      type: 'warning',
      message: `Deleted bot session: ${bot?.name || botId}`
    };
    setTerminalLogs(prev => [...prev, log]);
  }, [bots]);
  
  const handleRefreshSession = useCallback((botId) => {
    setBots(prev => prev.map(bot => 
      bot.id === botId ? { ...bot, status: 'pending', qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=WhatsAppReconnect' } : bot
    ));
    
    const log = {
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      type: 'info',
      message: `Refreshing bot session... Scan QR code to reconnect.`
    };
    setTerminalLogs(prev => [...prev, log]);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return '#10b981';
      case 'disconnected': return '#ef4444';
      case 'pending': return '#f59e0b';
      case 'running': return '#10b981';
      case 'paused': return '#f59e0b';
      case 'completed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getLogTypeColor = (type) => {
    switch (type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'ai': return '#8b5cf6';
      case 'message': return '#3b82f6';
      default: return '#9ca3af';
    }
  };

  const toggleFolder = (folderName) => {
    setCodeModules(prev => prev.map(mod => 
      mod.name === folderName ? { ...mod, expanded: !mod.expanded } : mod
    ));
  };

  const handleTerminalCommand = (e) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const newLog = {
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      type: 'info',
      message: `> ${terminalInput}`
    };

    const response = {
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      type: 'ai',
      message: `Nina AI: Processing command "${terminalInput}"...`
    };

    setTerminalLogs(prev => [...prev, newLog, response]);
    setTerminalInput('');
  };

  const restartBot = (botId) => {
    setBots(prev => prev.map(bot => 
      bot.id === botId ? { ...bot, status: 'pending' } : bot
    ));
    
    const log = {
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      type: 'info',
      message: `Restarting bot session...`
    };
    setTerminalLogs(prev => [...prev, log]);

    setTimeout(() => {
      setBots(prev => prev.map(bot => 
        bot.id === botId ? { ...bot, status: 'connected', qrCode: null } : bot
      ));
      const successLog = {
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        type: 'success',
        message: `Bot session reconnected successfully`
      };
      setTerminalLogs(prev => [...prev, successLog]);
    }, 2000);
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="nina-crm-container">
      <div className="nina-header">
        <div className="nina-title">
          <div className="nina-avatar">
            <Bot size={24} />
          </div>
          <div className="nina-details">
            <h2>Nina - WhatsApp Bot Developer</h2>
            <span className={`nina-status ${ninaActive ? 'active' : 'inactive'}`}>
              {ninaActive ? 'AI Active' : 'AI Paused'}
            </span>
          </div>
        </div>
        <div className="nina-actions">
          <button 
            className={`nina-toggle ${ninaActive ? 'active' : ''}`}
            onClick={() => setNinaActive(!ninaActive)}
          >
            {ninaActive ? 'Pause Nina' : 'Activate Nina'}
          </button>
        </div>
      </div>

      <div className="nina-tabs">
        <button 
          className={`nina-tab ${activeTab === 'sessions' ? 'active' : ''}`}
          onClick={() => setActiveTab('sessions')}
        >
          <QrCode size={16} />
          Sessions
        </button>
        <button 
          className={`nina-tab ${activeTab === 'bots' ? 'active' : ''}`}
          onClick={() => setActiveTab('bots')}
        >
          <Smartphone size={16} />
          Bots
        </button>
        <button 
          className={`nina-tab ${activeTab === 'campaigns' ? 'active' : ''}`}
          onClick={() => setActiveTab('campaigns')}
        >
          <Megaphone size={16} />
          Campaigns
        </button>
        <button 
          className={`nina-tab ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          <Users size={16} />
          Contacts
        </button>
        <button 
          className={`nina-tab ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          <Mail size={16} />
          Messages
        </button>
        <button 
          className={`nina-tab ${activeTab === 'ai' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai')}
        >
          <Brain size={16} />
          AI/ML
        </button>
        <button 
          className={`nina-tab ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <Shield size={16} />
          Security
        </button>
        <button 
          className={`nina-tab ${activeTab === 'scheduling' ? 'active' : ''}`}
          onClick={() => setActiveTab('scheduling')}
        >
          <Timer size={16} />
          Scheduling
        </button>
        <button 
          className={`nina-tab ${activeTab === 'sheets' ? 'active' : ''}`}
          onClick={() => setActiveTab('sheets')}
        >
          <Table size={16} />
          Sheets
        </button>
        <button 
          className={`nina-tab ${activeTab === 'terminal' ? 'active' : ''}`}
          onClick={() => setActiveTab('terminal')}
        >
          <Terminal size={16} />
          Terminal
        </button>
        <button 
          className={`nina-tab ${activeTab === 'code' ? 'active' : ''}`}
          onClick={() => setActiveTab('code')}
        >
          <FileCode size={16} />
          Code
        </button>
        <button 
          className={`nina-tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <Activity size={16} />
          Analytics
        </button>
        <button 
          className={`nina-tab ${activeTab === 'features' ? 'active' : ''}`}
          onClick={() => setActiveTab('features')}
        >
          <Star size={16} />
          Features
        </button>
      </div>

      <div className="nina-content">
        {activeTab === 'sessions' && (
          <div className="sessions-view">
            <BotSessionManager
              bots={bots}
              selectedBotId={selectedBot?.id}
              onCreateBot={handleCreateBot}
              onDeleteBot={handleDeleteBot}
              onRefreshSession={handleRefreshSession}
              onSelectBot={(id) => setSelectedBot(bots.find(b => b.id === id))}
            />
          </div>
        )}

        {activeTab === 'bots' && (
          <div className="bots-view">
            <div className="bots-grid">
              {bots.map(bot => (
                <div 
                  key={bot.id} 
                  className={`bot-card ${selectedBot?.id === bot.id ? 'selected' : ''}`}
                  onClick={() => setSelectedBot(bot)}
                >
                  <div className="bot-header">
                    <div className="bot-info">
                      <div 
                        className="bot-status-indicator" 
                        style={{ backgroundColor: getStatusColor(bot.status) }}
                      />
                      <h4>{bot.name}</h4>
                    </div>
                    <span className={`status-badge ${bot.status}`}>
                      {bot.status}
                    </span>
                  </div>
                  
                  <div className="bot-number">
                    <Phone size={14} />
                    {bot.number}
                  </div>

                  {bot.status === 'connected' ? (
                    <div className="bot-stats">
                      <div className="stat">
                        <MessageSquare size={14} />
                        <span>{bot.messagesProcessed.toLocaleString()}</span>
                      </div>
                      <div className="stat">
                        <Zap size={14} />
                        <span>{bot.responseRate}%</span>
                      </div>
                      <div className="stat">
                        <Clock size={14} />
                        <span>{bot.avgResponseTime}</span>
                      </div>
                    </div>
                  ) : bot.qrCode ? (
                    <div className="qr-section">
                      <p>Scan QR to connect:</p>
                      <img src={bot.qrCode} alt="QR Code" className="qr-code" />
                    </div>
                  ) : null}

                  <div className="bot-actions">
                    {bot.status === 'connected' ? (
                      <button className="bot-action-btn pause" onClick={(e) => { e.stopPropagation(); }}>
                        <Pause size={14} /> Pause
                      </button>
                    ) : (
                      <button className="bot-action-btn start" onClick={(e) => { e.stopPropagation(); restartBot(bot.id); }}>
                        <Play size={14} /> Start
                      </button>
                    )}
                    <button className="bot-action-btn refresh" onClick={(e) => { e.stopPropagation(); restartBot(bot.id); }}>
                      <RefreshCw size={14} />
                    </button>
                    <button className="bot-action-btn settings" onClick={(e) => { e.stopPropagation(); }}>
                      <Settings size={14} />
                    </button>
                  </div>
                </div>
              ))}

              <div className="bot-card add-bot">
                <div className="add-bot-content">
                  <Smartphone size={32} />
                  <span>Add New Bot</span>
                </div>
              </div>
            </div>

            {selectedBot && (
              <div className="bot-detail-panel">
                <h3>Bot Details: {selectedBot.name}</h3>
                
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Status</label>
                    <span className={`status ${selectedBot.status}`}>
                      {selectedBot.status === 'connected' ? <Wifi size={14} /> : <XCircle size={14} />}
                      {selectedBot.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Uptime</label>
                    <span>{selectedBot.uptime}</span>
                  </div>
                  <div className="detail-item">
                    <label>Messages Processed</label>
                    <span>{selectedBot.messagesProcessed.toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <label>Response Rate</label>
                    <span>{selectedBot.responseRate}%</span>
                  </div>
                  <div className="detail-item">
                    <label>Avg Response Time</label>
                    <span>{selectedBot.avgResponseTime}</span>
                  </div>
                  <div className="detail-item">
                    <label>Last Active</label>
                    <span>{selectedBot.lastActive}</span>
                  </div>
                </div>

                <div className="features-section">
                  <h4>Active Features</h4>
                  <div className="features-list">
                    {selectedBot.features.map((feature, i) => (
                      <span key={i} className="feature-tag">
                        <CheckCircle size={12} />
                        {feature}
                      </span>
                    ))}
                    {selectedBot.features.length === 0 && (
                      <span className="no-features">No features configured</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="campaigns-view">
            <div className="campaigns-header">
              <h3>Campaign Manager</h3>
              <button className="create-campaign-btn">
                <Plus size={16} />
                New Campaign
              </button>
            </div>

            <div className="campaigns-stats">
              <div className="stat-card">
                <div className="stat-icon running"><Megaphone size={20} /></div>
                <div className="stat-info">
                  <span className="stat-value">{campaigns.filter(c => c.status === 'running').length}</span>
                  <span className="stat-label">Running</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon paused"><Pause size={20} /></div>
                <div className="stat-info">
                  <span className="stat-value">{campaigns.filter(c => c.status === 'paused').length}</span>
                  <span className="stat-label">Paused</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon completed"><CheckCircle size={20} /></div>
                <div className="stat-info">
                  <span className="stat-value">{campaigns.filter(c => c.status === 'completed').length}</span>
                  <span className="stat-label">Completed</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon total"><BarChart3 size={20} /></div>
                <div className="stat-info">
                  <span className="stat-value">{campaigns.reduce((sum, c) => sum + c.sent, 0)}</span>
                  <span className="stat-label">Messages Sent</span>
                </div>
              </div>
            </div>

            <div className="campaigns-table">
              <table>
                <thead>
                  <tr>
                    <th>Campaign</th>
                    <th>Project</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Failed</th>
                    <th>Started</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map(campaign => (
                    <tr key={campaign.id}>
                      <td className="campaign-name">{campaign.name}</td>
                      <td>{campaign.project}</td>
                      <td>
                        <span className={`status-badge ${campaign.status}`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td>
                        <div className="progress-cell">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill"
                              style={{ width: `${(campaign.sent / campaign.total) * 100}%` }}
                            />
                          </div>
                          <span>{campaign.sent}/{campaign.total}</span>
                        </div>
                      </td>
                      <td className="failed-count">{campaign.failed}</td>
                      <td>{campaign.startedAt}</td>
                      <td>
                        <div className="action-buttons">
                          {campaign.status === 'running' && (
                            <button className="action-btn pause"><Pause size={14} /></button>
                          )}
                          {campaign.status === 'paused' && (
                            <button className="action-btn play"><Play size={14} /></button>
                          )}
                          <button className="action-btn"><Settings size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="contacts-view">
            <div className="contacts-header">
              <h3>Contact Management</h3>
              <div className="contacts-actions">
                <button className="action-btn-primary">
                  <Upload size={16} />
                  Import
                </button>
                <button className="action-btn-secondary">
                  <Download size={16} />
                  Export
                </button>
              </div>
            </div>

            <div className="contacts-filters">
              <div className="search-box">
                <Search size={16} />
                <input 
                  type="text" 
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="filter-buttons">
                <button 
                  className={`filter-btn ${categoryFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setCategoryFilter('all')}
                >
                  All
                </button>
                <button 
                  className={`filter-btn ${categoryFilter === 'cluster' ? 'active' : ''}`}
                  onClick={() => setCategoryFilter('cluster')}
                >
                  Clusters
                </button>
                <button 
                  className={`filter-btn ${categoryFilter === 'campaign' ? 'active' : ''}`}
                  onClick={() => setCategoryFilter('campaign')}
                >
                  Campaigns
                </button>
              </div>
            </div>

            <div className="contacts-grid">
              <div className="projects-list">
                <h4>Projects ({filteredProjects.length})</h4>
                {filteredProjects.map(project => (
                  <div 
                    key={project.id} 
                    className={`project-item ${selectedProject?.id === project.id ? 'selected' : ''}`}
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="project-info">
                      <span className="project-name">{project.name}</span>
                      <span className={`project-category ${project.category}`}>{project.category}</span>
                    </div>
                    <div className="project-meta">
                      <span className="contact-count"><Users size={12} /> {project.contacts}</span>
                      <span className="last-sync"><RefreshCw size={12} /> {project.lastSync}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="blocklist-panel">
                <h4>Blocklist <Shield size={16} /></h4>
                <p className="blocklist-count">{blocklist.length || 245} numbers blocked</p>
                <div className="blocklist-actions">
                  <button className="blocklist-btn">
                    <Plus size={14} /> Add Numbers
                  </button>
                  <button className="blocklist-btn">
                    <RefreshCw size={14} /> Refresh
                  </button>
                </div>
                <div className="blocklist-info">
                  <p>Blocked numbers are automatically excluded from all campaigns.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="messages-view">
            <div className="messages-header">
              <h3>Message Templates</h3>
              <button className="create-template-btn">
                <Plus size={16} />
                New Template
              </button>
            </div>

            <div className="template-categories">
              <button className="category-btn active">All</button>
              <button className="category-btn">Greetings</button>
              <button className="category-btn">Property</button>
              <button className="category-btn">Appointment</button>
              <button className="category-btn">Campaigns</button>
            </div>

            <div className="templates-grid">
              {templates.map(template => (
                <div key={template.id} className="template-card">
                  <div className="template-header">
                    <span className="template-name">{template.name}</span>
                    <span className={`template-lang ${template.language}`}>
                      {template.language === 'ar' ? 'عربي' : template.language === 'bilingual' ? 'EN/AR' : 'EN'}
                    </span>
                  </div>
                  <div className="template-category">{template.category}</div>
                  <div className="template-preview">{template.preview}</div>
                  <div className="template-actions">
                    <button className="template-btn"><Edit size={14} /> Edit</button>
                    <button className="template-btn"><Copy size={14} /> Copy</button>
                    <button className="template-btn use"><Send size={14} /> Use</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sheets' && (
          <div className="sheets-view">
            <div className="sheets-header">
              <h3>Google Sheets Integration</h3>
              <div className="sheets-status">
                <span className="status-indicator connected" />
                Connected
              </div>
            </div>

            <div className="sheets-stats">
              <div className="sheet-stat">
                <Table size={24} />
                <div>
                  <span className="stat-value">{projects.length}</span>
                  <span className="stat-label">Connected Sheets</span>
                </div>
              </div>
              <div className="sheet-stat">
                <Users size={24} />
                <div>
                  <span className="stat-value">{projects.reduce((sum, p) => sum + p.contacts, 0).toLocaleString()}</span>
                  <span className="stat-label">Total Contacts</span>
                </div>
              </div>
              <div className="sheet-stat">
                <RefreshCw size={24} />
                <div>
                  <span className="stat-value">30m</span>
                  <span className="stat-label">Last Sync</span>
                </div>
              </div>
            </div>

            <div className="sheets-table">
              <table>
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>Category</th>
                    <th>Contacts</th>
                    <th>Last Sync</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(project => (
                    <tr key={project.id}>
                      <td className="sheet-name">
                        <Table size={14} />
                        {project.name}
                      </td>
                      <td>
                        <span className={`category-badge ${project.category}`}>
                          {project.category}
                        </span>
                      </td>
                      <td>{project.contacts}</td>
                      <td>{project.lastSync}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn" title="Sync"><RefreshCw size={14} /></button>
                          <button className="action-btn" title="View"><Globe size={14} /></button>
                          <button className="action-btn" title="Settings"><Settings size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'terminal' && (
          <div className="terminal-view">
            <div className="terminal-header">
              <div className="terminal-title">
                <Terminal size={16} />
                <span>Nina Terminal</span>
              </div>
              <div className="terminal-actions">
                <button onClick={() => setTerminalLogs([])}>Clear</button>
                <button><Download size={14} /> Export Logs</button>
              </div>
            </div>
            
            <div className="terminal-output">
              {terminalLogs.map((log, i) => (
                <div key={i} className="log-line">
                  <span className="log-time">[{log.time}]</span>
                  <span className="log-type" style={{ color: getLogTypeColor(log.type) }}>
                    [{log.type.toUpperCase()}]
                  </span>
                  <span className="log-message">{log.message}</span>
                </div>
              ))}
            </div>

            <form className="terminal-input" onSubmit={handleTerminalCommand}>
              <span className="prompt">nina@whitecaves:~$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="Enter command..."
              />
              <button type="submit"><Send size={14} /></button>
            </form>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="code-view">
            <div className="file-explorer">
              <h4>Project Structure</h4>
              {codeModules.map(module => (
                <div key={module.name} className="folder-item">
                  <div 
                    className="folder-header"
                    onClick={() => toggleFolder(module.name)}
                  >
                    {module.expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <Folder size={14} />
                    <span>{module.name}</span>
                  </div>
                  {module.expanded && (
                    <div className="folder-files">
                      {module.files.map(file => (
                        <div 
                          key={file.name} 
                          className={`file-item ${selectedFile?.name === file.name ? 'selected' : ''}`}
                          onClick={() => setSelectedFile(file)}
                        >
                          <FileCode size={14} />
                          <span>{file.name}</span>
                          <span className="file-lines">{file.lines} lines</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="code-editor">
              {selectedFile ? (
                <>
                  <div className="editor-header">
                    <span>{selectedFile.name}</span>
                    <div className="editor-actions">
                      <button><Copy size={14} /> Copy</button>
                      <button><Download size={14} /> Download</button>
                    </div>
                  </div>
                  <div className="editor-content">
                    <pre>
{`// ${selectedFile.name}
// Nina WhatsApp Bot - Consolidated Services

import { EventEmitter } from 'events';

export class ${selectedFile.name.replace('.js', '')} extends EventEmitter {
  constructor() {
    super();
    this.initialized = false;
    console.log('${selectedFile.name} loaded');
  }

  async initialize() {
    if (this.initialized) return true;
    // Initialization logic
    this.initialized = true;
    this.emit('ready');
    return true;
  }

  // Additional methods...
}

export default new ${selectedFile.name.replace('.js', '')}();

// Lines: ${selectedFile.lines}
// Last modified: ${new Date().toISOString().split('T')[0]}`}
                    </pre>
                  </div>
                </>
              ) : (
                <div className="no-file-selected">
                  <FileCode size={48} />
                  <p>Select a file to view code</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-view">
            <div className="analytics-cards">
              <div className="analytics-card">
                <div className="card-icon green">
                  <MessageSquare size={24} />
                </div>
                <div className="card-info">
                  <h4>Total Messages</h4>
                  <span className="card-value">12,458</span>
                  <span className="card-change positive">+12% this week</span>
                </div>
              </div>
              
              <div className="analytics-card">
                <div className="card-icon blue">
                  <Users size={24} />
                </div>
                <div className="card-info">
                  <h4>Leads Generated</h4>
                  <span className="card-value">847</span>
                  <span className="card-change positive">+8% this week</span>
                </div>
              </div>
              
              <div className="analytics-card">
                <div className="card-icon purple">
                  <Zap size={24} />
                </div>
                <div className="card-info">
                  <h4>Response Rate</h4>
                  <span className="card-value">97.3%</span>
                  <span className="card-change positive">+2.1%</span>
                </div>
              </div>
              
              <div className="analytics-card">
                <div className="card-icon orange">
                  <Clock size={24} />
                </div>
                <div className="card-info">
                  <h4>Avg Response Time</h4>
                  <span className="card-value">2.4s</span>
                  <span className="card-change positive">-0.3s</span>
                </div>
              </div>
            </div>

            <div className="analytics-charts">
              <div className="chart-card">
                <h4>Message Volume (Last 7 Days)</h4>
                <div className="chart-placeholder">
                  <Activity size={48} />
                  <p>Chart visualization would appear here</p>
                </div>
              </div>
              
              <div className="chart-card">
                <h4>Bot Performance Comparison</h4>
                <div className="performance-list">
                  {bots.map(bot => (
                    <div key={bot.id} className="performance-item">
                      <span className="bot-name">{bot.name}</span>
                      <div className="performance-bar">
                        <div 
                          className="performance-fill"
                          style={{ width: `${bot.responseRate}%` }}
                        />
                      </div>
                      <span className="performance-value">{bot.responseRate}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="ai-view">
            <div className="ai-header">
              <h3>AI/ML Intelligence Engine</h3>
              <div className="ai-status">
                <span className="status-indicator active" />
                All Models Active
              </div>
            </div>

            <div className="ai-models-grid">
              <div className="ai-model-card">
                <div className="model-icon intent"><Brain size={24} /></div>
                <div className="model-info">
                  <h4>Intent Classifier</h4>
                  <p>Detects property inquiry, viewing requests, negotiation, opt-out, greetings</p>
                  <div className="model-stats">
                    <span className="stat"><CheckCircle size={12} /> 10 Intent Categories</span>
                    <span className="stat"><Languages size={12} /> Arabic + English</span>
                  </div>
                </div>
                <span className="model-badge active">Active</span>
              </div>

              <div className="ai-model-card">
                <div className="model-icon scoring"><Star size={24} /></div>
                <div className="model-info">
                  <h4>Lead Scorer</h4>
                  <p>AI-powered lead scoring 0-100 based on engagement, budget, timeline</p>
                  <div className="model-stats">
                    <span className="stat"><Zap size={12} /> Real-time Scoring</span>
                    <span className="stat"><Activity size={12} /> 10 Weight Factors</span>
                  </div>
                </div>
                <span className="model-badge active">Active</span>
              </div>

              <div className="ai-model-card">
                <div className="model-icon sentiment"><Activity size={24} /></div>
                <div className="model-info">
                  <h4>Sentiment Analyzer</h4>
                  <p>Analyze customer mood: positive, negative, urgent communications</p>
                  <div className="model-stats">
                    <span className="stat"><CheckCircle size={12} /> Urgency Detection</span>
                    <span className="stat"><AlertTriangle size={12} /> Escalation Triggers</span>
                  </div>
                </div>
                <span className="model-badge active">Active</span>
              </div>

              <div className="ai-model-card">
                <div className="model-icon language"><Languages size={24} /></div>
                <div className="model-info">
                  <h4>Language Detector</h4>
                  <p>Auto-detect Arabic, English, Hindi, Chinese for bilingual routing</p>
                  <div className="model-stats">
                    <span className="stat"><Globe size={12} /> 4 Languages</span>
                    <span className="stat"><CheckCircle size={12} /> Script Analysis</span>
                  </div>
                </div>
                <span className="model-badge active">Active</span>
              </div>

              <div className="ai-model-card">
                <div className="model-icon response"><MessageSquare size={24} /></div>
                <div className="model-info">
                  <h4>Response Generator</h4>
                  <p>Generate personalized AR/EN responses based on intent and context</p>
                  <div className="model-stats">
                    <span className="stat"><FileText size={12} /> Template Library</span>
                    <span className="stat"><Users size={12} /> Personalization</span>
                  </div>
                </div>
                <span className="model-badge active">Active</span>
              </div>
            </div>

            <div className="ai-test-section">
              <h4>Test AI Models</h4>
              <div className="test-input">
                <input type="text" placeholder="Enter a message to test intent classification..." />
                <button className="test-btn"><Brain size={14} /> Analyze</button>
              </div>
              <div className="test-results">
                <div className="result-item">
                  <span className="label">Intent:</span>
                  <span className="value">property_inquiry</span>
                  <span className="confidence">95%</span>
                </div>
                <div className="result-item">
                  <span className="label">Sentiment:</span>
                  <span className="value positive">Positive</span>
                  <span className="confidence">87%</span>
                </div>
                <div className="result-item">
                  <span className="label">Language:</span>
                  <span className="value">English</span>
                  <span className="confidence">92%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="security-view">
            <div className="security-header">
              <h3>Security & Compliance Center</h3>
              <div className="security-status">
                <span className="status-indicator secure" />
                All Systems Secure
              </div>
            </div>

            <div className="security-cards">
              <div className="security-card">
                <div className="security-icon encryption"><Lock size={24} /></div>
                <div className="security-info">
                  <h4>AES-256 Encryption</h4>
                  <p>Military-grade encryption for session data</p>
                  <span className="security-badge active">Enabled</span>
                </div>
              </div>

              <div className="security-card">
                <div className="security-icon audit"><Eye size={24} /></div>
                <div className="security-info">
                  <h4>Audit Logging</h4>
                  <p>Complete action tracking with IP logging</p>
                  <span className="security-badge active">Recording</span>
                </div>
              </div>

              <div className="security-card">
                <div className="security-icon access"><Key size={24} /></div>
                <div className="security-info">
                  <h4>Role-Based Access</h4>
                  <p>Admin, Manager, Agent, Viewer roles</p>
                  <span className="security-badge active">Enforced</span>
                </div>
              </div>

              <div className="security-card">
                <div className="security-icon session"><Fingerprint size={24} /></div>
                <div className="security-info">
                  <h4>Session Management</h4>
                  <p>Auto-expiry and activity tracking</p>
                  <span className="security-badge active">Active</span>
                </div>
              </div>
            </div>

            <div className="audit-log-section">
              <h4>Recent Audit Log</h4>
              <div className="audit-table">
                <div className="audit-row header">
                  <span>Time</span>
                  <span>User</span>
                  <span>Action</span>
                  <span>Resource</span>
                  <span>Status</span>
                </div>
                <div className="audit-row">
                  <span>13:45:23</span>
                  <span>admin@whitecaves.ae</span>
                  <span>Campaign Started</span>
                  <span>Victoria Outreach</span>
                  <span className="status success">Success</span>
                </div>
                <div className="audit-row">
                  <span>13:42:15</span>
                  <span>nina@system</span>
                  <span>Session Refresh</span>
                  <span>Lion0</span>
                  <span className="status success">Success</span>
                </div>
                <div className="audit-row">
                  <span>13:38:01</span>
                  <span>agent@whitecaves.ae</span>
                  <span>Template Edit</span>
                  <span>Morning Greeting</span>
                  <span className="status success">Success</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scheduling' && (
          <div className="scheduling-view">
            <div className="scheduling-header">
              <h3>Intelligent Scheduling System</h3>
              <div className="schedule-status">
                <span className="status-indicator active" />
                Within Working Hours
              </div>
            </div>

            <div className="scheduling-cards">
              <div className="schedule-card">
                <div className="schedule-icon timezone"><Map size={24} /></div>
                <div className="schedule-info">
                  <h4>ISO Country Mapper</h4>
                  <p>18 countries with timezone + business hours</p>
                  <div className="schedule-detail">
                    <span>UAE: Asia/Dubai (GMT+4)</span>
                  </div>
                </div>
              </div>

              <div className="schedule-card">
                <div className="schedule-icon local"><Clock size={24} /></div>
                <div className="schedule-info">
                  <h4>Local Time Scheduler</h4>
                  <p>Respects target timezone business hours</p>
                  <div className="schedule-detail">
                    <span>Current: 1:30 PM Dubai</span>
                  </div>
                </div>
              </div>

              <div className="schedule-card">
                <div className="schedule-icon strict"><Timer size={24} /></div>
                <div className="schedule-info">
                  <h4>Strict Schedule Manager</h4>
                  <p>Off-hours blocking, hourly limits</p>
                  <div className="schedule-detail">
                    <span>Limit: 25/hour (Afternoon Peak)</span>
                  </div>
                </div>
              </div>

              <div className="schedule-card">
                <div className="schedule-icon behavior"><Bot size={24} /></div>
                <div className="schedule-info">
                  <h4>Behavioral Simulator</h4>
                  <p>Human-like typing delays</p>
                  <div className="schedule-detail">
                    <span>Delay: 2-8s randomized</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="schedule-timeline">
              <h4>Today's Schedule</h4>
              <div className="timeline">
                <div className="timeline-block off">
                  <span className="time">00:00 - 08:00</span>
                  <span className="label">Night Off</span>
                </div>
                <div className="timeline-block active">
                  <span className="time">08:00 - 12:00</span>
                  <span className="label">Morning (20/hr)</span>
                </div>
                <div className="timeline-block off">
                  <span className="time">12:00 - 13:00</span>
                  <span className="label">Lunch</span>
                </div>
                <div className="timeline-block current">
                  <span className="time">13:00 - 19:00</span>
                  <span className="label">Afternoon Peak (25/hr)</span>
                </div>
                <div className="timeline-block off">
                  <span className="time">19:00 - 24:00</span>
                  <span className="label">Evening Off</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <AssistantFeatureMatrix 
            features={NINA_FEATURES}
            title="Nina's Programmed Capabilities"
            accentColor="#7c3aed"
            categories={['Bot Management', 'Development Tools', 'Analytics', 'Automation', 'AI/ML', 'Integrations', 'Core System', 'Monitoring', 'Communication', 'Security', 'Scheduling', 'Anti-Detection', 'Compliance', 'Campaign Intelligence']}
          />
        )}
      </div>
    </div>
  );
}
