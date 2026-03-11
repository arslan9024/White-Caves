import React, { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './WhatsAppChatbotPage.css';

interface ChatbotMessage {
  id: string;
  trigger: string;
  response: string;
  enabled: boolean;
}

interface WhatsAppChatbotPageProps {}

const OWNER_EMAIL = 'arslanmalikgoraha@gmail.com';

const WhatsAppChatbotPage: FC<WhatsAppChatbotPageProps> = () => {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user.currentUser);
  const [chatbotMessages, setChatbotMessages] = useState<ChatbotMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('messages');
  const [newTrigger, setNewTrigger] = useState<string>('');
  const [newResponse, setNewResponse] = useState<string>('');

  useEffect(() => {
    if (!user || user.email !== OWNER_EMAIL) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchChatbotMessages();
  }, []);

  const fetchChatbotMessages = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch('/api/whatsapp/chatbot/messages');
      if (response.ok) {
        const data = await response.json();
        setChatbotMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching chatbot messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMessage = async (): Promise<void> => {
    if (!newTrigger.trim() || !newResponse.trim()) {
      alert('Please fill in both trigger and response');
      return;
    }

    try {
      const response = await fetch('/api/whatsapp/chatbot/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trigger: newTrigger, response: newResponse })
      });
      
      if (response.ok) {
        setNewTrigger('');
        setNewResponse('');
        fetchChatbotMessages();
      }
    } catch (error) {
      console.error('Error adding chatbot message:', error);
    }
  };

  const handleToggleMessage = async (id: string, enabled: boolean): Promise<void> => {
    try {
      await fetch(`/api/whatsapp/chatbot/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !enabled })
      });
      fetchChatbotMessages();
    } catch (error) {
      console.error('Error toggling message:', error);
    }
  };

  return (
    <div className="whatsapp-chatbot-page no-sidebar">
      <div className="chatbot-container full-width">
        <header className="chatbot-header">
          <h1>WhatsApp Chatbot Manager</h1>
          <p>Automate your WhatsApp responses</p>
        </header>

        <div className="chatbot-tabs">
          <button
            className={`chatbot-tab ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </button>
          <button
            className={`chatbot-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>

        {activeTab === 'messages' && (
          <div className="chatbot-section">
            <div className="chatbot-add-message">
              <h3>Add New Automated Message</h3>
              <div className="form-group">
                <label>Trigger Keyword</label>
                <input
                  type="text"
                  placeholder="e.g., 'hello', 'pricing', 'contact'"
                  value={newTrigger}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTrigger(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Response Message</label>
                <textarea
                  placeholder="Enter the response message..."
                  value={newResponse}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewResponse(e.target.value)}
                  rows={4}
                />
              </div>
              <button onClick={handleAddMessage} className="btn-add">Add Message</button>
            </div>

            {loading ? (
              <p>Loading messages...</p>
            ) : (
              <div className="chatbot-messages-list">
                <h3>Configured Messages</h3>
                {chatbotMessages.length > 0 ? (
                  chatbotMessages.map(msg => (
                    <div key={msg.id} className={`chatbot-message-item ${msg.enabled ? 'active' : 'inactive'}`}>
                      <div className="message-content">
                        <strong>Trigger:</strong> {msg.trigger}
                        <p><strong>Response:</strong> {msg.response}</p>
                      </div>
                      <button
                        className={`toggle-btn ${msg.enabled ? 'enabled' : 'disabled'}`}
                        onClick={() => handleToggleMessage(msg.id, msg.enabled)}
                      >
                        {msg.enabled ? '✓ Active' : '✗ Inactive'}
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No messages configured yet</p>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="chatbot-section">
            <h3>Chatbot Settings</h3>
            <div className="chatbot-settings">
              <div className="setting-item">
                <label>
                  <input type="checkbox" defaultChecked /> Enable chatbot
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input type="checkbox" defaultChecked /> Respond to unknown messages
                </label>
              </div>
              <div className="setting-item">
                <label>Default Response for Unknown Messages:</label>
                <textarea placeholder="Enter default response..." rows={3} />
              </div>
              <button className="btn-save">Save Settings</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppChatbotPage;
