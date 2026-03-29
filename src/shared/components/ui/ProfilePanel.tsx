import React from 'react';
import { createLogger } from '../../../utils/logger';

const log = createLogger('ProfilePanel');
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { X, User, Mail, Phone, Shield, Settings, LogOut, Edit2, BarChart3, Users, AlertCircle, Zap } from 'lucide-react';
import { auth } from '../../../config/firebase';
import './ProfilePanel.css';
import { safeStorage } from '../../../utils/safeStorage';

interface ProfilePanelProps {
  user: Record<string, unknown> | null;
  onClose: () => void;
  isSuperUser?: boolean;
}

const ProfilePanel = ({ user, onClose, isSuperUser = false }: ProfilePanelProps) => {
  const navigate = useNavigate();
  
  // Detect super user from Redux (stable selectors to avoid unnecessary re-renders)
  const userRole = useSelector((state: any) => state.auth?.user?.role || 'user');
  const authRole = useSelector((state: any) => state.auth?.user?.role);
  const reduxIsSuperUser = authRole === 'lion';
  const effectiveIsSuperUser = isSuperUser || reduxIsSuperUser;

  const handleSignOut = async () => {
    try {
      await auth?.signOut();
      safeStorage.remove('userRole');
      navigate('/');
      onClose();
    } catch (error) {
      log.error('Sign out error:', error);
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

  const handleAdminDashboard = () => {
    navigate('/lion/admin-dashboard');
    onClose();
  };

  const handleSystemHealth = () => {
    navigate('/lion/system-health');
    onClose();
  };

  const handleUserManagement = () => {
    navigate('/lion/users');
    onClose();
  };

  return (
    <>
      <div className="profile-panel-overlay" onClick={onClose} role="presentation" />
      <div className="profile-panel" role="dialog" aria-modal="true" aria-label="User profile" onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}>
        <div className="profile-panel-header">
          <h3>My Profile</h3>
          <button className="profile-panel-close" onClick={onClose} aria-label="Close profile panel">
            <X size={20} />
          </button>
        </div>

        <div className="profile-panel-content">
          <div className="profile-panel-avatar-section">
            {user?.photo ? (
              <img src={String(user.photo)} alt={String(user.name ?? '')} className="profile-panel-avatar" loading="lazy" width={48} height={48} />
            ) : (
              <div className="profile-panel-avatar-placeholder">
                <User size={48} />
              </div>
            )}
            <button className="profile-edit-avatar-btn" aria-label="Edit profile picture">
              <Edit2 size={14} />
            </button>
          </div>

          <div className="profile-panel-info">
            <h4 className="profile-panel-name">{String(user?.name || user?.displayName || 'User')}</h4>
            <span className={`profile-panel-role ${effectiveIsSuperUser ? 'super-user' : ''}`}>
              <Shield size={14} />
              {effectiveIsSuperUser ? '👑 Super User' : String(user?.role || 'Member')}
            </span>
          </div>

          {effectiveIsSuperUser && (
            <div className="profile-panel-admin-section">
              <div className="admin-section-header">
                <Zap size={16} />
                <span>Admin Controls</span>
              </div>
              <div className="admin-quick-actions">
                <button className="admin-quick-action" onClick={handleAdminDashboard} title="Admin Dashboard">
                  <BarChart3 size={18} />
                  <span>Admin</span>
                </button>
                <button className="admin-quick-action" onClick={handleSystemHealth} title="System Health">
                  <AlertCircle size={18} />
                  <span>Health</span>
                </button>
                <button className="admin-quick-action" onClick={handleUserManagement} title="User Management">
                  <Users size={18} />
                  <span>Users</span>
                </button>
              </div>
            </div>
          )}

          <div className="profile-panel-details">
            {Boolean(user?.email) && (
              <div className="profile-detail-item">
                <Mail size={16} />
                <span>{String(user?.email)}</span>
              </div>
            )}
            {Boolean(user?.phone) && (
              <div className="profile-detail-item">
                <Phone size={16} />
                <span>{String(user?.phone)}</span>
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
            {effectiveIsSuperUser && (
              <>
                <button className="profile-action-btn admin" onClick={handleAdminDashboard}>
                  <BarChart3 size={18} />
                  Admin Dashboard
                </button>
                <div className="profile-action-divider" />
              </>
            )}
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
