import React, { useState } from 'react';
import './ProfileCompletion.css';
import { useToast } from './Toast';

export default function ProfileCompletion({ user, token, onComplete, onSkip }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/auth/complete-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim() || undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      toast.success('Profile updated successfully!');
      onComplete(data.user, data.token);
    } catch (error) {
      console.error('Profile completion error:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-completion-overlay">
      <div className="profile-completion-modal">
        <div className="profile-completion-header">
          <div className="welcome-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2>Complete Your Profile</h2>
          <p>Just a few more details to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="profile-completion-form">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address (Optional)</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email for updates"
            />
            <span className="form-hint">We'll use this for property alerts and updates</span>
          </div>

          <div className="phone-display">
            <span className="phone-label">Phone Number</span>
            <span className="phone-value">{user?.phone || 'Not provided'}</span>
            <span className="verified-badge">Verified</span>
          </div>

          <div className="profile-completion-actions">
            <button 
              type="submit" 
              className="btn-complete" 
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Complete Profile'}
            </button>
            
            <button 
              type="button" 
              className="btn-skip"
              onClick={onSkip}
              disabled={loading}
            >
              Skip for now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
