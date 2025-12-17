import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import './AuthPages.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.currentUser);
  const [activeTab, setActiveTab] = useState('overview');
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    
    const stored = localStorage.getItem('userRole');
    if (stored) {
      try {
        setUserRole(JSON.parse(stored));
      } catch (e) {
        setUserRole(null);
      }
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('userRole');
      dispatch(setUser(null));
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getRoleLabel = (role) => {
    const labels = {
      'buyer': 'Buyer',
      'seller': 'Seller',
      'landlord': 'Landlord',
      'leasing-agent': 'Leasing Agent',
      'secondary-sales-agent': 'Sales Agent',
      'leasing-team-leader': 'Leasing Team Leader',
      'sales-team-leader': 'Sales Team Leader',
      'admin': 'Administrator'
    };
    return labels[role] || role;
  };

  if (!user) {
    return null;
  }

  return (
    <div className="auth-page profile-page">
      <div className="profile-container">
        <div className="profile-sidebar">
          <Link to="/" className="auth-logo">
            <img src="/company-logo.jpg" alt="White Caves" />
            <span>White Caves</span>
          </Link>

          <div className="profile-user-card">
            <div className="profile-avatar">
              {user.photo ? (
                <img src={user.photo} alt={user.name || 'User'} />
              ) : (
                <span>{(user.name || user.email || 'U')[0].toUpperCase()}</span>
              )}
            </div>
            <h3>{user.name || 'User'}</h3>
            <p>{user.email}</p>
            {userRole && (
              <span className="role-badge">{getRoleLabel(userRole.role)}</span>
            )}
          </div>

          <nav className="profile-nav">
            <button 
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <span className="nav-icon">📊</span>
              Overview
            </button>
            <button 
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <span className="nav-icon">⚙️</span>
              Settings
            </button>
            <button 
              className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <span className="nav-icon">🔒</span>
              Security
            </button>
            
            <div className="nav-divider"></div>
            
            {userRole && (
              <Link to={`/${userRole.role}/dashboard`} className="nav-item">
                <span className="nav-icon">🏠</span>
                Go to Dashboard
              </Link>
            )}
            
            <Link to="/" className="nav-item">
              <span className="nav-icon">🏡</span>
              Home
            </Link>
            
            <button className="nav-item logout" onClick={handleLogout}>
              <span className="nav-icon">🚪</span>
              Sign Out
            </button>
          </nav>
        </div>

        <div className="profile-content">
          {activeTab === 'overview' && (
            <div className="profile-section">
              <h1>Profile Overview</h1>
              <p className="section-subtitle">Manage your account information</p>

              <div className="info-cards">
                <div className="info-card">
                  <h3>Account Information</h3>
                  <div className="info-rows">
                    <div className="info-row">
                      <span className="info-label">Full Name</span>
                      <span className="info-value">{user.name || 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Email</span>
                      <span className="info-value">{user.email || 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Phone</span>
                      <span className="info-value">{user.phone || 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Role</span>
                      <span className="info-value">{userRole ? getRoleLabel(userRole.role) : 'Not selected'}</span>
                    </div>
                  </div>
                </div>

                <div className="info-card">
                  <h3>Quick Stats</h3>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-value">0</span>
                      <span className="stat-label">Saved Properties</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">0</span>
                      <span className="stat-label">Viewings</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">0</span>
                      <span className="stat-label">Inquiries</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">0</span>
                      <span className="stat-label">Alerts</span>
                    </div>
                  </div>
                </div>

                <div className="info-card">
                  <h3>Connected Accounts</h3>
                  <div className="connected-accounts">
                    <div className="account-item">
                      <span className="account-icon google">G</span>
                      <span className="account-name">Google</span>
                      <span className="account-status connected">Connected</span>
                    </div>
                    <div className="account-item">
                      <span className="account-icon facebook">f</span>
                      <span className="account-name">Facebook</span>
                      <span className="account-status">Not connected</span>
                    </div>
                    <div className="account-item">
                      <span className="account-icon apple">A</span>
                      <span className="account-name">Apple</span>
                      <span className="account-status">Not connected</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="profile-section">
              <h1>Account Settings</h1>
              <p className="section-subtitle">Update your profile information</p>

              <div className="settings-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" defaultValue={user.name || ''} placeholder="Enter your name" />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" defaultValue={user.email || ''} placeholder="Enter your email" disabled />
                  <span className="input-hint">Email cannot be changed</span>
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" defaultValue={user.phone || ''} placeholder="+971 50 123 4567" />
                </div>
                <div className="form-group">
                  <label>Preferred Language</label>
                  <select defaultValue="en">
                    <option value="en">English</option>
                    <option value="ar">Arabic</option>
                  </select>
                </div>
                <button className="btn btn-primary">Save Changes</button>
              </div>

              <div className="settings-section">
                <h3>Notification Preferences</h3>
                <div className="toggle-group">
                  <label className="toggle-item">
                    <span>Email notifications</span>
                    <input type="checkbox" defaultChecked />
                  </label>
                  <label className="toggle-item">
                    <span>Price drop alerts</span>
                    <input type="checkbox" defaultChecked />
                  </label>
                  <label className="toggle-item">
                    <span>New property matches</span>
                    <input type="checkbox" defaultChecked />
                  </label>
                  <label className="toggle-item">
                    <span>Marketing emails</span>
                    <input type="checkbox" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="profile-section">
              <h1>Security Settings</h1>
              <p className="section-subtitle">Manage your account security</p>

              <div className="security-cards">
                <div className="info-card">
                  <h3>Change Password</h3>
                  <div className="settings-form">
                    <div className="form-group">
                      <label>Current Password</label>
                      <input type="password" placeholder="Enter current password" />
                    </div>
                    <div className="form-group">
                      <label>New Password</label>
                      <input type="password" placeholder="Enter new password" />
                    </div>
                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <input type="password" placeholder="Confirm new password" />
                    </div>
                    <button className="btn btn-primary">Update Password</button>
                  </div>
                </div>

                <div className="info-card">
                  <h3>Two-Factor Authentication</h3>
                  <p>Add an extra layer of security to your account</p>
                  <button className="btn btn-secondary">Enable 2FA</button>
                </div>

                <div className="info-card danger">
                  <h3>Danger Zone</h3>
                  <p>Permanently delete your account and all associated data</p>
                  <button className="btn btn-danger">Delete Account</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
