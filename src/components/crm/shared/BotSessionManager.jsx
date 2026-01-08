import React, { memo, useState, useCallback } from 'react';
import { 
  QrCode, Plus, Trash2, RefreshCw, Smartphone, Wifi, WifiOff,
  Check, X, AlertTriangle, Clock, Activity
} from 'lucide-react';
import './BotComponents.css';

const BotSessionManager = memo(({ 
  bots = [],
  onCreateBot,
  onDeleteBot,
  onRefreshSession,
  onSelectBot,
  selectedBotId
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [newBotName, setNewBotName] = useState('');
  const [newBotNumber, setNewBotNumber] = useState('');
  
  const handleCreateBot = useCallback(() => {
    if (newBotName && newBotNumber && onCreateBot) {
      onCreateBot({ name: newBotName, number: newBotNumber });
      setNewBotName('');
      setNewBotNumber('');
      setShowCreateModal(false);
    }
  }, [newBotName, newBotNumber, onCreateBot]);
  
  const handleDeleteBot = useCallback((botId) => {
    if (onDeleteBot) {
      onDeleteBot(botId);
    }
    setShowDeleteConfirm(null);
  }, [onDeleteBot]);
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return <Wifi size={14} className="status-icon connected" />;
      case 'disconnected': return <WifiOff size={14} className="status-icon disconnected" />;
      case 'pending': return <Clock size={14} className="status-icon pending" />;
      default: return <AlertTriangle size={14} className="status-icon warning" />;
    }
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'connected': return 'Connected';
      case 'disconnected': return 'Disconnected';
      case 'pending': return 'Awaiting QR Scan';
      default: return 'Unknown';
    }
  };
  
  return (
    <div className="bot-session-manager">
      <div className="manager-header">
        <h3>WhatsApp Bot Sessions</h3>
        <button className="create-btn" onClick={() => setShowCreateModal(true)}>
          <Plus size={16} />
          Create New Bot
        </button>
      </div>
      
      <div className="bots-grid">
        {bots.map(bot => (
          <div 
            key={bot.id}
            className={`bot-card ${selectedBotId === bot.id ? 'selected' : ''} ${bot.status}`}
            onClick={() => onSelectBot?.(bot.id)}
          >
            <div className="bot-header">
              <div className="bot-name">
                <Smartphone size={18} />
                <span>{bot.name}</span>
              </div>
              <div className="bot-actions">
                <button 
                  className="action-btn refresh"
                  onClick={(e) => { e.stopPropagation(); onRefreshSession?.(bot.id); }}
                  title="Refresh Session"
                >
                  <RefreshCw size={14} />
                </button>
                <button 
                  className="action-btn delete"
                  onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(bot.id); }}
                  title="Delete Bot"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            
            <div className="bot-number">{bot.number}</div>
            
            <div className="bot-status">
              {getStatusIcon(bot.status)}
              <span>{getStatusLabel(bot.status)}</span>
            </div>
            
            {bot.status === 'pending' || bot.status === 'disconnected' ? (
              <div className="qr-section">
                {bot.qrCode ? (
                  <div className="qr-display">
                    <img src={bot.qrCode} alt="Scan QR Code" />
                    <p>Scan with WhatsApp</p>
                  </div>
                ) : (
                  <div className="qr-placeholder">
                    <QrCode size={48} />
                    <p>Generating QR Code...</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bot-metrics">
                <div className="metric">
                  <span className="metric-value">{bot.messagesProcessed?.toLocaleString() || 0}</span>
                  <span className="metric-label">Messages</span>
                </div>
                <div className="metric">
                  <span className="metric-value">{bot.responseRate || 0}%</span>
                  <span className="metric-label">Response Rate</span>
                </div>
                <div className="metric">
                  <span className="metric-value">{bot.uptime || '0%'}</span>
                  <span className="metric-label">Uptime</span>
                </div>
              </div>
            )}
            
            {bot.features && bot.features.length > 0 && (
              <div className="bot-features">
                {bot.features.map((feature, idx) => (
                  <span key={idx} className="feature-tag">{feature}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Create New WhatsApp Bot</h4>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Bot Name</label>
                <input 
                  type="text"
                  value={newBotName}
                  onChange={(e) => setNewBotName(e.target.value)}
                  placeholder="e.g., Lion3"
                />
              </div>
              <div className="form-group">
                <label>WhatsApp Number</label>
                <input 
                  type="text"
                  value={newBotNumber}
                  onChange={(e) => setNewBotNumber(e.target.value)}
                  placeholder="+971501234567"
                />
              </div>
              <p className="modal-note">
                After creating the bot, you'll need to scan the QR code with WhatsApp to connect.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </button>
              <button 
                className="btn primary" 
                onClick={handleCreateBot}
                disabled={!newBotName || !newBotNumber}
              >
                <Plus size={14} /> Create Bot
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal-content confirm" onClick={e => e.stopPropagation()}>
            <div className="confirm-icon">
              <AlertTriangle size={48} />
            </div>
            <h4>Delete Bot?</h4>
            <p>This will permanently delete the bot and disconnect the WhatsApp session. This action cannot be undone.</p>
            <div className="modal-footer">
              <button className="btn secondary" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn danger" onClick={() => handleDeleteBot(showDeleteConfirm)}>
                <Trash2 size={14} /> Delete Bot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

BotSessionManager.displayName = 'BotSessionManager';
export default BotSessionManager;
