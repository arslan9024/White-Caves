import React, { useState } from 'react';
import './Profile.css';
import { updateUserProfile, updateUserEmail, updateUserPassword, verifyEmail, reauthenticateWithCredential, EmailAuthProvider } from '../config/firebase';
import { useToast } from './Toast';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="#1877f2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
    <line x1="12" y1="18" x2="12.01" y2="18"/>
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const CameraIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

export default function Profile({ user, onLogout }) {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user.displayName || '',
    photoURL: user.photoURL || ''
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [emailData, setEmailData] = useState({
    newEmail: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const [favorites, setFavorites] = useState([
    { id: 1, title: 'Luxury Villa - Palm Jumeirah', price: '45,000,000 AED', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400', beds: 6, baths: 7, sqft: '12,500' },
    { id: 2, title: 'Penthouse - Downtown Dubai', price: '32,000,000 AED', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400', beds: 4, baths: 5, sqft: '8,200' },
    { id: 3, title: 'Villa - Emirates Hills', price: '55,000,000 AED', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400', beds: 7, baths: 8, sqft: '15,000' }
  ]);
  const [savedSearches, setSavedSearches] = useState([
    { id: 1, query: 'Villas in Palm Jumeirah, 4+ beds, Pool', date: '2025-11-01', results: 24 },
    { id: 2, query: 'Apartments in Downtown Dubai, 2-3 beds', date: '2025-10-28', results: 156 },
    { id: 3, query: 'Penthouses in Dubai Marina, Ocean View', date: '2025-10-25', results: 18 }
  ]);
  const [activityHistory, setActivityHistory] = useState([
    { id: 1, type: 'view', description: 'Viewed Luxury Villa - Palm Jumeirah', date: '2 hours ago' },
    { id: 2, type: 'favorite', description: 'Added Penthouse to favorites', date: '5 hours ago' },
    { id: 3, type: 'search', description: 'Searched for villas in Emirates Hills', date: '1 day ago' },
    { id: 4, type: 'appointment', description: 'Booked viewing for property #12345', date: '2 days ago' }
  ]);

  const getProviderIcon = (providerId) => {
    switch (providerId) {
      case 'google.com': return <GoogleIcon />;
      case 'facebook.com': return <FacebookIcon />;
      case 'apple.com': return <AppleIcon />;
      case 'password': return <EmailIcon />;
      case 'phone': return <PhoneIcon />;
      default: return <UserIcon />;
    }
  };

  const getProviderName = (providerId) => {
    switch (providerId) {
      case 'google.com': return 'Google';
      case 'facebook.com': return 'Facebook';
      case 'apple.com': return 'Apple';
      case 'password': return 'Email & Password';
      case 'phone': return 'Phone Number';
      default: return 'Unknown';
    }
  };

  const loginMethods = user.providerData?.map(provider => ({
    providerId: provider.providerId,
    email: provider.email || provider.phoneNumber
  })) || [];

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      await updateUserProfile(user, {
        displayName: profileData.displayName,
        photoURL: profileData.photoURL
      });
      toast.success('Profile updated successfully!');
      setEditingProfile(false);
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, photoURL: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      await verifyEmail(user);
      toast.success('Verification email sent! Please check your inbox.');
    } catch (error) {
      console.error('Email verification error:', error);
      toast.error('Failed to send verification email');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      setLoading(true);
      const credential = EmailAuthProvider.credential(user.email, passwordData.currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updateUserPassword(user, passwordData.newPassword);
      toast.success('Password changed successfully!');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Password change error:', error);
      if (error.code === 'auth/wrong-password') {
        toast.error('Current password is incorrect');
      } else {
        toast.error('Failed to change password');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!emailData.newEmail || !emailData.newEmail.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }
    try {
      setLoading(true);
      const credential = EmailAuthProvider.credential(user.email, emailData.password);
      await reauthenticateWithCredential(user, credential);
      await updateUserEmail(user, emailData.newEmail);
      toast.success('Email updated successfully! Please verify your new email.');
      setShowEmailModal(false);
      setEmailData({ newEmail: '', password: '' });
    } catch (error) {
      console.error('Email change error:', error);
      if (error.code === 'auth/wrong-password') {
        toast.error('Password is incorrect');
      } else if (error.code === 'auth/email-already-in-use') {
        toast.error('This email is already in use');
      } else {
        toast.error('Failed to update email');
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = (id) => {
    setFavorites(favorites.filter(fav => fav.id !== id));
    toast.success('Removed from favorites');
  };

  const removeSavedSearch = (id) => {
    setSavedSearches(savedSearches.filter(search => search.id !== id));
    toast.success('Search removed');
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'view': return <EyeIcon />;
      case 'favorite': return <HeartIcon />;
      case 'search': return <SearchIcon />;
      case 'appointment': return <ClockIcon />;
      default: return <ClockIcon />;
    }
  };

  const navItems = [
    { id: 'overview', icon: <UserIcon />, label: 'Overview' },
    { id: 'favorites', icon: <HeartIcon />, label: 'Favorites', count: favorites.length },
    { id: 'searches', icon: <SearchIcon />, label: 'Saved Searches', count: savedSearches.length },
    { id: 'activity', icon: <ClockIcon />, label: 'Activity' },
    { id: 'settings', icon: <SettingsIcon />, label: 'Settings' },
    { id: 'security', icon: <ShieldIcon />, label: 'Security' }
  ];

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <aside className="profile-sidebar">
          <div className="profile-card">
            <div className="avatar-container">
              <img 
                src={profileData.photoURL || user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=667eea&color=fff&size=150`} 
                alt="Profile" 
                className="profile-avatar" 
              />
              {editingProfile && (
                <label className="avatar-edit-btn">
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} />
                  <CameraIcon />
                </label>
              )}
              <span className="status-badge">Active</span>
            </div>
            
            {editingProfile ? (
              <input
                type="text"
                value={profileData.displayName}
                onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                className="name-input"
                placeholder="Your name"
              />
            ) : (
              <h2 className="profile-name">{user.displayName || 'User'}</h2>
            )}
            
            <p className="profile-contact">{user.email || user.phoneNumber}</p>
            
            <div className="quick-stats">
              <div className="quick-stat">
                <span className="stat-value">{favorites.length}</span>
                <span className="stat-name">Favorites</span>
              </div>
              <div className="stat-divider"></div>
              <div className="quick-stat">
                <span className="stat-value">{savedSearches.length}</span>
                <span className="stat-name">Searches</span>
              </div>
              <div className="stat-divider"></div>
              <div className="quick-stat">
                <span className="stat-value">{activityHistory.length}</span>
                <span className="stat-name">Activities</span>
              </div>
            </div>

            {editingProfile ? (
              <div className="edit-actions">
                <button className="btn-save" onClick={handleUpdateProfile} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button className="btn-cancel" onClick={() => setEditingProfile(false)}>
                  Cancel
                </button>
              </div>
            ) : (
              <button className="btn-edit-profile" onClick={() => setEditingProfile(true)}>
                Edit Profile
              </button>
            )}
          </div>

          <nav className="profile-nav">
            {navItems.map(item => (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.count !== undefined && (
                  <span className="nav-count">{item.count}</span>
                )}
                <ChevronRightIcon />
              </button>
            ))}
          </nav>

          <button className="logout-btn" onClick={onLogout}>
            <LogoutIcon />
            <span>Sign Out</span>
          </button>
        </aside>

        <main className="profile-main">
          {activeTab === 'overview' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Account Overview</h2>
                <p>Manage your personal information and account settings</p>
              </div>

              <div className="info-cards-grid">
                <div className="info-card">
                  <div className="card-header">
                    <h3>Personal Information</h3>
                  </div>
                  <div className="info-list">
                    <div className="info-row">
                      <span className="info-label">Full Name</span>
                      <span className="info-value">{user.displayName || 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Email</span>
                      <div className="info-value-with-badge">
                        <span>{user.email || 'Not provided'}</span>
                        {user.email && (
                          user.emailVerified ? (
                            <span className="badge verified"><CheckIcon /> Verified</span>
                          ) : (
                            <button className="badge-btn" onClick={handleVerifyEmail}>Verify</button>
                          )
                        )}
                      </div>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Phone</span>
                      <span className="info-value">{user.phoneNumber || 'Not provided'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Member Since</span>
                      <span className="info-value">
                        {user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="info-card">
                  <div className="card-header">
                    <h3>Connected Accounts</h3>
                  </div>
                  <div className="connected-accounts">
                    {loginMethods.length > 0 ? (
                      loginMethods.map((method, index) => (
                        <div key={index} className="account-item">
                          <span className="account-icon">{getProviderIcon(method.providerId)}</span>
                          <div className="account-details">
                            <span className="account-name">{getProviderName(method.providerId)}</span>
                            <span className="account-email">{method.email}</span>
                          </div>
                          <span className="connected-badge"><CheckIcon /> Connected</span>
                        </div>
                      ))
                    ) : (
                      <p className="no-accounts">No connected accounts</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="info-card full-width">
                <div className="card-header">
                  <h3>Recent Activity</h3>
                  <button className="link-btn" onClick={() => setActiveTab('activity')}>View All</button>
                </div>
                <div className="recent-activity">
                  {activityHistory.slice(0, 3).map(activity => (
                    <div key={activity.id} className="activity-row">
                      <span className="activity-icon">{getActivityIcon(activity.type)}</span>
                      <span className="activity-text">{activity.description}</span>
                      <span className="activity-time">{activity.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Favorite Properties</h2>
                <p>Properties you've saved for later viewing</p>
              </div>
              
              {favorites.length > 0 ? (
                <div className="favorites-grid">
                  {favorites.map(property => (
                    <div key={property.id} className="property-card">
                      <div className="property-image">
                        <img src={property.image} alt={property.title} />
                        <button className="remove-btn" onClick={() => removeFavorite(property.id)}>
                          <TrashIcon />
                        </button>
                      </div>
                      <div className="property-content">
                        <h3 className="property-title">{property.title}</h3>
                        <p className="property-price">{property.price}</p>
                        <div className="property-specs">
                          <span>{property.beds} Beds</span>
                          <span>{property.baths} Baths</span>
                          <span>{property.sqft} sqft</span>
                        </div>
                        <button className="view-property-btn">View Details</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <HeartIcon />
                  <h3>No favorites yet</h3>
                  <p>Start browsing and save properties you love</p>
                  <button className="btn-primary">Explore Properties</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'searches' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Saved Searches</h2>
                <p>Your saved search filters for quick access</p>
              </div>
              
              {savedSearches.length > 0 ? (
                <div className="searches-list">
                  {savedSearches.map(search => (
                    <div key={search.id} className="search-item">
                      <div className="search-icon"><SearchIcon /></div>
                      <div className="search-content">
                        <h4 className="search-query">{search.query}</h4>
                        <div className="search-meta">
                          <span>Saved {new Date(search.date).toLocaleDateString()}</span>
                          <span className="separator">|</span>
                          <span>{search.results} properties</span>
                        </div>
                      </div>
                      <div className="search-actions">
                        <button className="btn-run">Run Search</button>
                        <button className="btn-delete" onClick={() => removeSavedSearch(search.id)}>
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <SearchIcon />
                  <h3>No saved searches</h3>
                  <p>Save your search filters to quickly find properties</p>
                  <button className="btn-primary">Start Searching</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Activity History</h2>
                <p>Your recent interactions and browsing history</p>
              </div>
              
              {activityHistory.length > 0 ? (
                <div className="activity-list">
                  {activityHistory.map(activity => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-icon-wrapper">{getActivityIcon(activity.type)}</div>
                      <div className="activity-content">
                        <p className="activity-description">{activity.description}</p>
                        <span className="activity-time">{activity.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <ClockIcon />
                  <h3>No activity yet</h3>
                  <p>Your browsing history will appear here</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Notification Settings</h2>
                <p>Manage how we communicate with you</p>
              </div>

              <div className="settings-group">
                <h3 className="settings-title">
                  <BellIcon /> Email Notifications
                </h3>
                <div className="settings-list">
                  <label className="setting-toggle">
                    <div className="setting-info">
                      <span className="setting-name">Property Alerts</span>
                      <span className="setting-desc">New properties matching your saved searches</span>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle-input" />
                    <span className="toggle-slider"></span>
                  </label>
                  <label className="setting-toggle">
                    <div className="setting-info">
                      <span className="setting-name">Price Drop Alerts</span>
                      <span className="setting-desc">When prices drop on your favorite properties</span>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle-input" />
                    <span className="toggle-slider"></span>
                  </label>
                  <label className="setting-toggle">
                    <div className="setting-info">
                      <span className="setting-name">Newsletter</span>
                      <span className="setting-desc">Weekly market updates and featured properties</span>
                    </div>
                    <input type="checkbox" className="toggle-input" />
                    <span className="toggle-slider"></span>
                  </label>
                  <label className="setting-toggle">
                    <div className="setting-info">
                      <span className="setting-name">Marketing Communications</span>
                      <span className="setting-desc">Promotional offers and special events</span>
                    </div>
                    <input type="checkbox" className="toggle-input" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="settings-group">
                <h3 className="settings-title">
                  <EyeIcon /> Privacy
                </h3>
                <div className="settings-list">
                  <label className="setting-toggle">
                    <div className="setting-info">
                      <span className="setting-name">Profile Visibility</span>
                      <span className="setting-desc">Allow agents to view your profile and preferences</span>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle-input" />
                    <span className="toggle-slider"></span>
                  </label>
                  <label className="setting-toggle">
                    <div className="setting-info">
                      <span className="setting-name">Activity Tracking</span>
                      <span className="setting-desc">Use your activity for personalized recommendations</span>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle-input" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Security Settings</h2>
                <p>Manage your account security and authentication</p>
              </div>

              <div className="security-cards">
                <div className="security-card" onClick={() => setShowPasswordModal(true)}>
                  <div className="security-icon"><LockIcon /></div>
                  <div className="security-content">
                    <h4>Change Password</h4>
                    <p>Update your password to keep your account secure</p>
                  </div>
                  <ChevronRightIcon />
                </div>

                <div className="security-card" onClick={() => setShowEmailModal(true)}>
                  <div className="security-icon"><EmailIcon /></div>
                  <div className="security-content">
                    <h4>Update Email Address</h4>
                    <p>Change the email associated with your account</p>
                  </div>
                  <ChevronRightIcon />
                </div>

                <div className="security-card">
                  <div className="security-icon"><ShieldIcon /></div>
                  <div className="security-content">
                    <h4>Two-Factor Authentication</h4>
                    <p>Add an extra layer of security to your account</p>
                  </div>
                  <span className="coming-soon-badge">Coming Soon</span>
                </div>

                <div className="security-card danger">
                  <div className="security-icon"><TrashIcon /></div>
                  <div className="security-content">
                    <h4>Delete Account</h4>
                    <p>Permanently delete your account and all data</p>
                  </div>
                  <ChevronRightIcon />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Change Password</h3>
              <button className="modal-close" onClick={() => setShowPasswordModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Current Password</label>
                <input 
                  type="password" 
                  value={passwordData.currentPassword}
                  onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  placeholder="Enter current password"
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input 
                  type="password" 
                  value={passwordData.newPassword}
                  onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                  placeholder="Enter new password"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input 
                  type="password" 
                  value={passwordData.confirmPassword}
                  onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowPasswordModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleChangePassword} disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showEmailModal && (
        <div className="modal-overlay" onClick={() => setShowEmailModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Update Email Address</h3>
              <button className="modal-close" onClick={() => setShowEmailModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>New Email Address</label>
                <input 
                  type="email" 
                  value={emailData.newEmail}
                  onChange={e => setEmailData({...emailData, newEmail: e.target.value})}
                  placeholder="Enter new email"
                />
              </div>
              <div className="form-group">
                <label>Current Password</label>
                <input 
                  type="password" 
                  value={emailData.password}
                  onChange={e => setEmailData({...emailData, password: e.target.value})}
                  placeholder="Enter your password"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowEmailModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleChangeEmail} disabled={loading}>
                {loading ? 'Updating...' : 'Update Email'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
