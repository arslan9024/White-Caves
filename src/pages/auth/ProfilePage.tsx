import React, { FC, useState, useEffect, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import type { RootState } from '../../store/store';
import { setUser } from '../../store/userSlice';
import { auth } from '../../config/firebase';
import { createLogger } from '../../utils/logger';
import { safeStorage } from '../../utils/safeStorage';
import { authFetch } from '../../utils/authFetch';
import { useToast } from '../../components/Toast';

const log = createLogger('ProfilePage');
import { signOut } from 'firebase/auth';
import { BiometricSetup } from '../../features/auth/components/BiometricLogin';
import './AuthPages.css';

// Type definitions
interface UserData {
  role: string;
  locked?: boolean;
}

interface ProfilePageUser {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  photo?: string;
}

interface RoleLabels {
  [key: string]: string;
}

const ProfilePage: FC = () => {
  useDocumentTitle('My Profile');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser) as ProfilePageUser | null;
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [userRole, setUserRole] = useState<UserData | null>(null);

  // Controlled form state for settings
  const [profileName, setProfileName] = useState<string>('');
  const [profilePhone, setProfilePhone] = useState<string>('');
  const [profileLanguage, setProfileLanguage] = useState<string>('en');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect((): void => {
    if (!user) {
      navigate('/signin');
      return;
    }
    
    // Initialize form state from user data
    setProfileName(user.name || '');
    setProfilePhone(user.phone || '');

    const stored = safeStorage.getJSON<UserData>('userRole');
    if (stored) {
      setUserRole(stored);
    }
  }, [user, navigate]);

  const handleLogout = async (): Promise<void> => {
    try {
      if (auth) {
        await signOut(auth);
      }
      safeStorage.remove('userRole');
      dispatch(setUser(null));
      navigate('/');
    } catch (error) {
      log.error('Logout error:', error);
    }
  };

  const handleSaveProfile = async (): Promise<void> => {
    if (!profileName.trim()) {
      toast.warning('Name cannot be empty.');
      return;
    }
    setIsSaving(true);
    try {
      const response = await authFetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileName.trim(),
          phone: profilePhone.trim() || null,
          language: profileLanguage,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error((errorData as Record<string, string>).error || 'Failed to save profile');
      }
      const data = await response.json();
      // Update Redux user state with new data
      if (user?.id && user?.email) {
        dispatch(setUser({ ...user, id: user.id, email: user.email, name: profileName.trim(), phone: profilePhone.trim() || undefined }));
      }
      toast.success('Profile updated successfully.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save profile. Please try again.';
      toast.error(message);
      log.error('Save profile error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleLabel = (role: string): string => {
    const labels: RoleLabels = {
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
            <img src="/company-logo.jpg" alt="White Caves" loading="lazy" width={120} height={40} />
            <span>White Caves</span>
          </Link>

          <div className="profile-user-card">
            <div className="profile-avatar">
              {user.photo ? (
                <img src={user.photo} alt={user.name || 'User'} loading="lazy" width={48} height={48} />
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
                  <label htmlFor="profile-name">Full Name</label>
                  <input id="profile-name" type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="Enter your name" autoComplete="name" />
                </div>
                <div className="form-group">
                  <label htmlFor="profile-email">Email Address</label>
                  <input id="profile-email" type="email" value={user.email || ''} placeholder="Enter your email" disabled autoComplete="email" />
                  <span className="input-hint">Email cannot be changed</span>
                </div>
                <div className="form-group">
                  <label htmlFor="profile-phone">Phone Number</label>
                  <input id="profile-phone" type="tel" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} placeholder="+971 50 123 4567" autoComplete="tel" />
                </div>
                <div className="form-group">
                  <label htmlFor="profile-language">Preferred Language</label>
                  <select id="profile-language" value={profileLanguage} onChange={(e) => setProfileLanguage(e.target.value)}>
                    <option value="en">English</option>
                    <option value="ar">Arabic</option>
                  </select>
                </div>
                <button className="btn btn-primary" onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

              <div className="settings-section">
                <h3>Notification Preferences</h3>
                <div className="toggle-group" role="group" aria-label="Notification preferences">
                  <label className="toggle-item">
                    <span>Email notifications</span>
                    <input type="checkbox" defaultChecked aria-label="Email notifications" />
                  </label>
                  <label className="toggle-item">
                    <span>Price drop alerts</span>
                    <input type="checkbox" defaultChecked aria-label="Price drop alerts" />
                  </label>
                  <label className="toggle-item">
                    <span>New property matches</span>
                    <input type="checkbox" defaultChecked aria-label="New property matches" />
                  </label>
                  <label className="toggle-item">
                    <span>Marketing emails</span>
                    <input type="checkbox" aria-label="Marketing emails" />
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
                <BiometricSetup />

                <div className="info-card">
                  <h3>Change Password</h3>
                  <div className="settings-form">
                    <div className="form-group">
                      <label htmlFor="current-password">Current Password</label>
                      <input id="current-password" type="password" placeholder="Enter current password" autoComplete="current-password" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="new-password">New Password</label>
                      <input id="new-password" type="password" placeholder="Enter new password" autoComplete="new-password" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="confirm-new-password">Confirm New Password</label>
                      <input id="confirm-new-password" type="password" placeholder="Confirm new password" autoComplete="new-password" />
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

export default ProfilePage;
