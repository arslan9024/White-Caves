import React, { useState, useEffect } from 'react';
import { X, Phone, MessageCircle, Calendar, Star, MapPin, Award } from 'lucide-react';
import './ContactAgentModal.css';

const ContactAgentModal = ({
  isOpen,
  onClose,
  propertyId,
  property,
  availableAgents = [],
  onScheduleViewing,
}) => {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [contactMethod, setContactMethod] = useState('whatsapp');
  const [message, setMessage] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (availableAgents && availableAgents.length > 0) {
      setSelectedAgent(availableAgents[0]);
    }
  }, [availableAgents]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create agent contact request
      const response = await fetch('/api/agent-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: selectedAgent._id,
          propertyId,
          contactMethod,
          message,
          preferredDate,
          preferredTime,
        }),
      });

      if (!response.ok) throw new Error('Failed to send contact request');

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error contacting agent:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="agent-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        {success ? (
          <div className="success-state">
            <div className="success-icon">✓</div>
            <h3>Request Sent Successfully!</h3>
            <p>The agent will contact you shortly</p>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <h2>Contact Agent</h2>
              {property && (
                <p className="property-name">
                  For: <strong>{property.title}</strong>
                </p>
              )}
            </div>

            {/* Agent Selection */}
            <div className="section">
              <h3>Select an Agent</h3>
              <div className="agents-grid">
                {availableAgents && availableAgents.length > 0 ? (
                  availableAgents.map((agent) => (
                    <div
                      key={agent._id}
                      className={`agent-card ${
                        selectedAgent?._id === agent._id ? 'selected' : ''
                      }`}
                      onClick={() => setSelectedAgent(agent)}
                    >
                      <div className="agent-avatar">
                        <img
                          src={agent.profilePicture || '/default-avatar.png'}
                          alt={agent.name}
                        />
                        {agent.isOnline && <div className="online-indicator" />}
                      </div>
                      <div className="agent-info">
                        <h4>{agent.name}</h4>
                        <p className="specialization">{agent.specialization}</p>
                        <div className="rating">
                          <Star size={14} fill="#ffc107" color="#ffc107" />
                          <span>{agent.rating || 4.8}</span>
                        </div>
                      </div>
                      <div className="agent-meta">
                        <span className="listings-count">
                          {agent.activeListings} listings
                        </span>
                        {agent.responseTime && (
                          <span className="response-time">
                            ⚡ {agent.responseTime}min avg
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-agents">No agents available</p>
                )}
              </div>
            </div>

            {/* Contact Method */}
            <div className="section">
              <h3>How would you like to be contacted?</h3>
              <div className="contact-methods">
                <label className="method-option">
                  <input
                    type="radio"
                    value="whatsapp"
                    checked={contactMethod === 'whatsapp'}
                    onChange={(e) => setContactMethod(e.target.value)}
                  />
                  <div className="method-info">
                    <MessageCircle size={20} />
                    <div>
                      <span className="method-name">WhatsApp</span>
                      <span className="method-desc">Instant message</span>
                    </div>
                  </div>
                </label>

                <label className="method-option">
                  <input
                    type="radio"
                    value="call"
                    checked={contactMethod === 'call'}
                    onChange={(e) => setContactMethod(e.target.value)}
                  />
                  <div className="method-info">
                    <Phone size={20} />
                    <div>
                      <span className="method-name">Phone Call</span>
                      <span className="method-desc">Direct call</span>
                    </div>
                  </div>
                </label>

                <label className="method-option">
                  <input
                    type="radio"
                    value="email"
                    checked={contactMethod === 'email'}
                    onChange={(e) => setContactMethod(e.target.value)}
                  />
                  <div className="method-info">
                    <span className="email-icon">📧</span>
                    <div>
                      <span className="method-name">Email</span>
                      <span className="method-desc">Detailed info</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Message & Scheduling */}
            <form onSubmit={handleSubmit} className="agent-form">
              <div className="form-group">
                <label>Your Message (Optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell the agent about your preferences or ask specific questions..."
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Preferred Viewing Date</label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group">
                  <label>Preferred Time</label>
                  <input
                    type="time"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    disabled={!preferredDate}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={onClose}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={loading || !selectedAgent}
                >
                  {loading ? 'Sending...' : 'Contact Agent'}
                </button>
              </div>
            </form>

            {/* Agent Details Preview */}
            {selectedAgent && (
              <div className="agent-details">
                <h4>About {selectedAgent.name}</h4>
                <div className="details-grid">
                  <div className="detail-item">
                    <Award size={18} />
                    <div>
                      <span className="label">Experience</span>
                      <span className="value">{selectedAgent.yearsExperience || 5}+ years</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <Calendar size={18} />
                    <div>
                      <span className="label">Response Time</span>
                      <span className="value">{selectedAgent.responseTime || 15}min avg</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <MapPin size={18} />
                    <div>
                      <span className="label">Coverage Areas</span>
                      <span className="value">
                        {selectedAgent.coverageAreas?.slice(0, 2).join(', ') || 'Dubai'}
                      </span>
                    </div>
                  </div>
                </div>
                {selectedAgent.bio && (
                  <p className="agent-bio">{selectedAgent.bio}</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ContactAgentModal;
