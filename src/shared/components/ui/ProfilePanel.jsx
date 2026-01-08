import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, User, Mail, Phone, Shield, Settings, LogOut, Edit2 } from 'lucide-react';
import { auth } from '../../../config/firebase';
import './ProfilePanel.css';

const ProfilePanel = ({ user, onClose }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('userRole');
      navigate('/');
      onClose();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleEditProfile = () => {
    navigate('/profile');
    onClose();
  };

  const handleSettings = () => {
    navigate('/settings');
    onClose();
  };

  return (
    <>
      <div className="profile-panel-overlay" onClick={onClose} />
      <div className="profile-panel">
        <div className="profile-panel-header">
          <h3>My Profile</h3>
          <button className="profile-panel-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="profile-panel-content">
          <div className="profile-panel-avatar-section">
            {user?.photo ? (
              <img src={user.photo} alt={user.name} className="profile-panel-avatar" />
            ) : (
              <div className="profile-panel-avatar-placeholder">
                <User size={48} />
              </div>
            )}
            <button className="profile-edit-avatar-btn">
              <Edit2 size={14} />
            </button>
          </div>

          <div className="profile-panel-info">
            <h4 className="profile-panel-name">{user?.name || user?.displayName || 'User'}</h4>
            <span className="profile-panel-role">
              <Shield size={14} />
              {user?.role || 'Member'}
            </span>
          </div>

          <div className="profile-panel-details">
            {user?.email && (
              <div className="profile-detail-item">
                <Mail size={16} />
                <span>{user.email}</span>
              </div>
            )}
            {user?.phone && (
              <div className="profile-detail-item">
                <Phone size={16} />
                <span>{user.phone}</span>
              </div>
            )}
          </div>

          <div className="profile-panel-stats">
            <div className="profile-stat">
              <span className="profile-stat-value">12</span>
              <span className="profile-stat-label">Activities</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-value">5</span>
              <span className="profile-stat-label">Properties</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-value">3</span>
              <span className="profile-stat-label">Messages</span>
            </div>
          </div>

          <div className="profile-panel-actions">
            <button className="profile-action-btn" onClick={handleEditProfile}>
              <Edit2 size={18} />
              Edit Profile
            </button>
            <button className="profile-action-btn" onClick={handleSettings}>
              <Settings size={18} />
              Settings
            </button>
            <button className="profile-action-btn danger" onClick={handleSignOut}>
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePanel;
