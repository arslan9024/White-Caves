import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Bot, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, ArrowLeft, Save, MessageCircle } from 'lucide-react';
import './WhatsAppChatbotPage.css';

const OWNER_EMAIL = 'arslanmalikgoraha@gmail.com';

const WhatsAppChatbotPage = () => {
  const navigate = useNavigate();
  const user = useSelector(state => state.user.currentUser);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [newRule, setNewRule] = useState({
    name: '',
    trigger: '',
    triggerType: 'keyword',
    response: '',
    isActive: true,
    priority: 0
  });

  const [rules, setRules] = useState([
    { id: 1, name: 'Welcome Message', trigger: 'hello|hi|hey', triggerType: 'keyword', response: 'Hello! Welcome to White Caves Real Estate. How can I assist you today?', isActive: true, priority: 10, usageCount: 145 },
    { id: 2, name: 'Property Inquiry', trigger: 'property|villa|apartment|house', triggerType: 'contains', response: 'Thank you for your interest in our properties! Would you like to:\n1. Browse available properties\n2. Schedule a viewing\n3. Speak with an agent\n\nPlease reply with your choice.', isActive: true, priority: 8, usageCount: 89 },
    { id: 3, name: 'Price Inquiry', trigger: 'price|cost|how much|budget', triggerType: 'contains', response: 'Our properties range from AED 500,000 to AED 50,000,000+. Could you share your budget range so I can recommend suitable options?', isActive: true, priority: 7, usageCount: 67 },
    { id: 4, name: 'Viewing Request', trigger: 'viewing|visit|see|tour', triggerType: 'contains', response: 'Great! I would be happy to arrange a property viewing. Please share:\n- Your preferred date and time\n- Property type you are interested in\n- Preferred location in Dubai', isActive: true, priority: 6, usageCount: 42 },
    { id: 5, name: 'Contact Agent', trigger: 'agent|speak|call|contact', triggerType: 'contains', response: 'Our agents are available from 9 AM to 10 PM GST. You can:\n- Call us: +971 56 361 6136\n- Email: admin@whitecaves.com\n\nOr share your number and we will call you back!', isActive: true, priority: 5, usageCount: 38 },
    { id: 6, name: 'After Hours', trigger: '*', triggerType: 'any', response: 'Thank you for reaching out! Our team is currently away. We will respond to your message first thing in the morning. For urgent matters, please call +971 56 361 6136.', isActive: false, priority: 0, usageCount: 12 },
  ]);

  useEffect(() => {
    if (!user || user.email !== OWNER_EMAIL) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleToggleRule = (id) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const handleDeleteRule = (id) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      setRules(rules.filter(rule => rule.id !== id));
    }
  };

  const handleSaveRule = () => {
    if (!newRule.name || !newRule.trigger || !newRule.response) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingRule) {
      setRules(rules.map(rule => 
        rule.id === editingRule.id ? { ...rule, ...newRule } : rule
      ));
    } else {
      setRules([...rules, { ...newRule, id: Date.now(), usageCount: 0 }]);
    }

    setNewRule({ name: '', trigger: '', triggerType: 'keyword', response: '', isActive: true, priority: 0 });
    setEditingRule(null);
    setShowAddModal(false);
  };

  const handleEditRule = (rule) => {
    setNewRule(rule);
    setEditingRule(rule);
    setShowAddModal(true);
  };

  return (
    <div className="whatsapp-chatbot-page no-sidebar">
      <div className="chatbot-content full-width">
        <div className="chatbot-header">
          <div className="header-left">
            <Link to="/owner/whatsapp" className="back-btn">
              <ArrowLeft size={20} /> Back to Messages
            </Link>
            <h1><Bot size={28} /> Chatbot Rules Manager</h1>
            <p>Create automated responses for common customer inquiries</p>
          </div>
          <button className="add-rule-btn" onClick={() => setShowAddModal(true)}>
            <Plus size={20} /> Add New Rule
          </button>
        </div>

        <div className="chatbot-stats">
          <div className="stat-box">
            <span className="stat-number">{rules.length}</span>
            <span className="stat-text">Total Rules</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">{rules.filter(r => r.isActive).length}</span>
            <span className="stat-text">Active Rules</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">{rules.reduce((sum, r) => sum + r.usageCount, 0)}</span>
            <span className="stat-text">Total Triggers</span>
          </div>
        </div>

        <div className="rules-list">
          {rules.sort((a, b) => b.priority - a.priority).map(rule => (
            <div key={rule.id} className={`rule-card ${!rule.isActive ? 'inactive' : ''}`}>
              <div className="rule-header">
                <div className="rule-info">
                  <h3>{rule.name}</h3>
                  <span className={`trigger-type ${rule.triggerType}`}>{rule.triggerType}</span>
                  <span className="priority">Priority: {rule.priority}</span>
                </div>
                <div className="rule-actions">
                  <button 
                    className="toggle-btn"
                    onClick={() => handleToggleRule(rule.id)}
                    title={rule.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {rule.isActive ? (
                      <ToggleRight size={24} className="active" />
                    ) : (
                      <ToggleLeft size={24} className="inactive" />
                    )}
                  </button>
                  <button className="edit-btn" onClick={() => handleEditRule(rule)}>
                    <Edit2 size={18} />
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteRule(rule.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="rule-content">
                <div className="trigger-section">
                  <label>Trigger Keywords:</label>
                  <code>{rule.trigger}</code>
                </div>
                <div className="response-section">
                  <label>Auto Response:</label>
                  <p>{rule.response}</p>
                </div>
              </div>
              
              <div className="rule-footer">
                <span className="usage-count">
                  <MessageCircle size={14} /> Used {rule.usageCount} times
                </span>
              </div>
            </div>
          ))}
        </div>

        {showAddModal && (
          <div className="modal-overlay" onClick={() => { setShowAddModal(false); setEditingRule(null); }}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2>{editingRule ? 'Edit Rule' : 'Add New Chatbot Rule'}</h2>
              
              <div className="form-group">
                <label>Rule Name *</label>
                <input 
                  type="text"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  placeholder="e.g., Welcome Message"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Trigger Type *</label>
                  <select 
                    value={newRule.triggerType}
                    onChange={(e) => setNewRule({ ...newRule, triggerType: e.target.value })}
                  >
                    <option value="keyword">Exact Keyword</option>
                    <option value="contains">Contains Word</option>
                    <option value="regex">Regex Pattern</option>
                    <option value="any">Any Message</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority (0-10)</label>
                  <input 
                    type="number"
                    min="0"
                    max="10"
                    value={newRule.priority}
                    onChange={(e) => setNewRule({ ...newRule, priority: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Trigger Keywords/Pattern *</label>
                <input 
                  type="text"
                  value={newRule.trigger}
                  onChange={(e) => setNewRule({ ...newRule, trigger: e.target.value })}
                  placeholder="e.g., hello|hi|hey (separate with |)"
                />
                <small>Use | to separate multiple keywords</small>
              </div>

              <div className="form-group">
                <label>Auto Response *</label>
                <textarea 
                  value={newRule.response}
                  onChange={(e) => setNewRule({ ...newRule, response: e.target.value })}
                  placeholder="Enter the automated response message..."
                  rows={5}
                />
              </div>

              <div className="form-group checkbox">
                <label>
                  <input 
                    type="checkbox"
                    checked={newRule.isActive}
                    onChange={(e) => setNewRule({ ...newRule, isActive: e.target.checked })}
                  />
                  Rule is active
                </label>
              </div>

              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => { setShowAddModal(false); setEditingRule(null); }}>
                  Cancel
                </button>
                <button className="save-btn" onClick={handleSaveRule}>
                  <Save size={18} /> {editingRule ? 'Update Rule' : 'Save Rule'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppChatbotPage;
