import React, { useState } from 'react';
import { 
  Bot, MessageSquare, Code, Terminal, Play, Pause, RefreshCw, 
  Settings, Users, Phone, CheckCircle, XCircle, Clock, Zap,
  FileCode, Folder, ChevronRight, ChevronDown, Copy, Download,
  AlertTriangle, Activity, Send, QrCode, Smartphone, Wifi
} from 'lucide-react';
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

const CODE_MODULES = [
  {
    name: 'WhatsAppBot',
    expanded: true,
    files: [
      { name: 'CreatingNewWhatsAppClient.js', type: 'js', lines: 45 },
      { name: 'WhatsAppClientFunctions.js', type: 'js', lines: 234 },
      { name: 'MessageHandler.js', type: 'js', lines: 178 },
      { name: 'SessionManager.js', type: 'js', lines: 89 }
    ]
  },
  {
    name: 'Inputs',
    expanded: false,
    files: [
      { name: 'ArslanNumbers.js', type: 'js', lines: 25 },
      { name: 'NawalNumbers.js', type: 'js', lines: 18 },
      { name: 'BotConfig.js', type: 'js', lines: 42 }
    ]
  },
  {
    name: 'core-modules',
    expanded: false,
    files: [
      { name: 'LeadScoring.js', type: 'js', lines: 156 },
      { name: 'AutoReply.js', type: 'js', lines: 89 },
      { name: 'AppointmentBooking.js', type: 'js', lines: 112 }
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
  const [activeTab, setActiveTab] = useState('bots');
  const [ninaActive, setNinaActive] = useState(true);
  const [terminalLogs, setTerminalLogs] = useState(TERMINAL_LOGS);
  const [codeModules, setCodeModules] = useState(CODE_MODULES);
  const [terminalInput, setTerminalInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return '#10b981';
      case 'disconnected': return '#ef4444';
      case 'pending': return '#f59e0b';
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
          className={`nina-tab ${activeTab === 'bots' ? 'active' : ''}`}
          onClick={() => setActiveTab('bots')}
        >
          <Smartphone size={16} />
          Bot Sessions
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
          Code Modules
        </button>
        <button 
          className={`nina-tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <Activity size={16} />
          Analytics
        </button>
      </div>

      <div className="nina-content">
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
// WhatsApp Bot Module - Nina AI Managed

import { WhatsAppClientFunctions } from "./WhatsAppClientFunctions.js";
import { CreatingNewWhatsAppClient } from "./CreatingNewWhatsAppClient.js";

export const initializeBot = async (agentNumber) => {
  const client = await CreatingNewWhatsAppClient(agentNumber);
  WhatsAppClientFunctions(client, agentNumber, true);
  
  console.log(\`Bot initialized for \${agentNumber}\`);
  return client;
};

// Nina AI: This module handles WhatsApp client initialization
// Last modified: ${new Date().toISOString().split('T')[0]}
// Lines: ${selectedFile.lines}`}
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
      </div>
    </div>
  );
}
