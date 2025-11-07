import React, { useState } from 'react';
import './Profile.css';
import { updateUserProfile, updateUserEmail, updateUserPassword, verifyEmail } from '../config/firebase';
import { useToast } from './Toast';

const roleLabels = {
  VISITOR: 'Visitor',
  AGENT: 'Real Estate Agent',
  EMPLOYEE: 'Employee',
  BUYER: 'Property Buyer',
  SELLER: 'Property Seller',
  TENANT: 'Tenant',
  LANDLORD: 'Landlord',
  PROPERTY_OWNER: 'Property Owner',
  SUPER_USER: 'Company Owner'
};

export default function Profile({ user, onLogout }) {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user.displayName || '',
    photoURL: user.photoURL || ''
  });
  const [favorites, setFavorites] = useState([
    { id: 1, title: 'Luxury Villa - Palm Jumeirah', price: '45,000,000 AED', image: 'https://via.placeholder.com/300x200' },
    { id: 2, title: 'Penthouse - Downtown Dubai', price: '32,000,000 AED', image: 'https://via.placeholder.com/300x200' },
    { id: 3, title: 'Villa - Emirates Hills', price: '55,000,000 AED', image: 'https://via.placeholder.com/300x200' }
  ]);
  const [savedSearches, setSavedSearches] = useState([
    { id: 1, query: 'Villas in Palm Jumeirah, 4+ beds, Pool', date: '2025-11-01' },
    { id: 2, query: 'Apartments in Downtown Dubai, 2-3 beds', date: '2025-10-28' },
    { id: 3, query: 'Penthouses in Dubai Marina, Ocean View', date: '2025-10-25' }
  ]);
  const [activityHistory, setActivityHistory] = useState([
    { id: 1, type: 'view', description: 'Viewed Luxury Villa - Palm Jumeirah', date: '2 hours ago' },
    { id: 2, type: 'favorite', description: 'Added Penthouse to favorites', date: '5 hours ago' },
    { id: 3, type: 'search', description: 'Searched for villas in Emirates Hills', date: '1 day ago' },
    { id: 4, type: 'appointment', description: 'Booked viewing for property #12345', date: '2 days ago' }
  ]);

  const loginMethods = [];
  if (user.providerData) {
    user.providerData.forEach(provider => {
      const providerId = provider.providerId;
      if (providerId === 'google.com') {
        loginMethods.push({ icon: '🔍', name: 'Google', email: provider.email });
      } else if (providerId === 'facebook.com') {
        loginMethods.push({ icon: '📘', name: 'Facebook', email: provider.email });
      } else if (providerId === 'apple.com') {
        loginMethods.push({ icon: '🍎', name: 'Apple', email: provider.email });
      } else if (providerId === 'password') {
        loginMethods.push({ icon: '📧', name: 'Email/Password', email: provider.email });
      } else if (providerId === 'phone') {
        loginMethods.push({ icon: '📱', name: 'Phone', email: provider.phoneNumber });
      }
    });
  }

  const handleUpdateProfile = async () => {
    try {
      await updateUserProfile(user, {
        displayName: profileData.displayName,
        photoURL: profileData.photoURL
      });
      toast.success('Profile updated successfully!');
      setEditingProfile(false);
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
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
      case 'view': return '👁️';
      case 'favorite': return '❤️';
      case 'search': return '🔍';
      case 'appointment': return '📅';
      default: return '•';
    }
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-avatar-section">
            <div className="avatar-wrapper">
              <img 
                src={profileData.photoURL || user.photoURL || 'https://via.placeholder.com/150'} 
                alt="Profile" 
                className="profile-avatar-large" 
              />
              {editingProfile && (
                <label className="avatar-upload-btn">
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                  📸 Change Photo
                </label>
              )}
            </div>
            {editingProfile ? (
              <input
                type="text"
                value={profileData.displayName}
                onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                className="profile-name-input"
                placeholder="Your name"
              />
            ) : (
              <h2 className="profile-name">{user.displayName || 'User'}</h2>
            )}
            <p className="profile-email">{user.email || user.phoneNumber}</p>
            
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-number">{favorites.length}</span>
                <span className="stat-label">Favorites</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{savedSearches.length}</span>
                <span className="stat-label">Saved Searches</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{activityHistory.length}</span>
                <span className="stat-label">Activities</span>
              </div>
            </div>
          </div>

          <div className="profile-nav">
            <button 
              className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 Overview
            </button>
            <button 
              className={`nav-btn ${activeTab === 'favorites' ? 'active' : ''}`}
              onClick={() => setActiveTab('favorites')}
            >
              ❤️ Favorites
            </button>
            <button 
              className={`nav-btn ${activeTab === 'searches' ? 'active' : ''}`}
              onClick={() => setActiveTab('searches')}
            >
              🔍 Saved Searches
            </button>
            <button 
              className={`nav-btn ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              📜 Activity History
            </button>
            <button 
              className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              ⚙️ Settings
            </button>
          </div>

          <button className="logout-btn" onClick={onLogout}>
            🚪 Logout
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'overview' && (
            <div className="tab-content">
              <h2 className="tab-title">Profile Overview</h2>
              
              <div className="info-card">
                <h3>Account Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Full Name</span>
                    <span className="info-value">{user.displayName || 'Not set'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email Address</span>
                    <span className="info-value">{user.email || 'Not provided'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phone Number</span>
                    <span className="info-value">{user.phoneNumber || 'Not provided'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email Verified</span>
                    <span className="info-value">
                      {user.emailVerified ? (
                        <span className="verified-badge">✅ Verified</span>
                      ) : (
                        <button className="verify-btn" onClick={handleVerifyEmail}>
                          Verify Email
                        </button>
                      )}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Member Since</span>
                    <span className="info-value">
                      {user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown'}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Last Sign In</span>
                    <span className="info-value">
                      {user.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="info-card">
                <h3>Login Methods</h3>
                <div className="login-methods">
                  {loginMethods.length > 0 ? (
                    loginMethods.map((method, index) => (
                      <div key={index} className="login-method-item">
                        <span className="method-icon">{method.icon}</span>
                        <div className="method-details">
                          <span className="method-name">{method.name}</span>
                          <span className="method-email">{method.email}</span>
                        </div>
                        <span className="method-status">Connected</span>
                      </div>
                    ))
                  ) : (
                    <p className="no-data">No login methods configured</p>
                  )}
                </div>
              </div>

              <div className="profile-actions">
                {editingProfile ? (
                  <>
                    <button className="btn-primary" onClick={handleUpdateProfile}>
                      💾 Save Changes
                    </button>
                    <button className="btn-secondary" onClick={() => setEditingProfile(false)}>
                      ❌ Cancel
                    </button>
                  </>
                ) : (
                  <button className="btn-primary" onClick={() => setEditingProfile(true)}>
                    ✏️ Edit Profile
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="tab-content">
              <h2 className="tab-title">Favorite Properties</h2>
              {favorites.length > 0 ? (
                <div className="favorites-grid">
                  {favorites.map(property => (
                    <div key={property.id} className="favorite-card">
                      <img src={property.image} alt={property.title} className="favorite-image" />
                      <div className="favorite-content">
                        <h3 className="favorite-title">{property.title}</h3>
                        <p className="favorite-price">{property.price}</p>
                        <div className="favorite-actions">
                          <button className="btn-view">👁️ View Details</button>
                          <button className="btn-remove" onClick={() => removeFavorite(property.id)}>
                            🗑️ Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data-placeholder">
                  <p className="no-data-icon">❤️</p>
                  <p className="no-data-text">No favorite properties yet</p>
                  <p className="no-data-subtext">Start browsing and save your dream properties!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'searches' && (
            <div className="tab-content">
              <h2 className="tab-title">Saved Searches</h2>
              {savedSearches.length > 0 ? (
                <div className="saved-searches-list">
                  {savedSearches.map(search => (
                    <div key={search.id} className="search-card">
                      <div className="search-icon">🔍</div>
                      <div className="search-details">
                        <h3 className="search-query">{search.query}</h3>
                        <p className="search-date">Saved on {new Date(search.date).toLocaleDateString()}</p>
                      </div>
                      <div className="search-actions">
                        <button className="btn-run-search">▶️ Run Search</button>
                        <button className="btn-delete" onClick={() => removeSavedSearch(search.id)}>
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data-placeholder">
                  <p className="no-data-icon">🔍</p>
                  <p className="no-data-text">No saved searches yet</p>
                  <p className="no-data-subtext">Save your favorite search filters for quick access!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="tab-content">
              <h2 className="tab-title">Activity History</h2>
              {activityHistory.length > 0 ? (
                <div className="activity-timeline">
                  {activityHistory.map(activity => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-icon">{getActivityIcon(activity.type)}</div>
                      <div className="activity-details">
                        <p className="activity-description">{activity.description}</p>
                        <p className="activity-date">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data-placeholder">
                  <p className="no-data-icon">📜</p>
                  <p className="no-data-text">No activity yet</p>
                  <p className="no-data-subtext">Your recent activities will appear here</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="tab-content">
              <h2 className="tab-title">Account Settings</h2>
              
              <div className="settings-card">
                <h3>Notification Preferences</h3>
                <div className="settings-options">
                  <label className="setting-item">
                    <input type="checkbox" defaultChecked />
                    <div>
                      <span className="setting-name">Email Notifications</span>
                      <span className="setting-desc">Receive updates via email</span>
                    </div>
                  </label>
                  <label className="setting-item">
                    <input type="checkbox" defaultChecked />
                    <div>
                      <span className="setting-name">New Property Alerts</span>
                      <span className="setting-desc">Get notified about new listings</span>
                    </div>
                  </label>
                  <label className="setting-item">
                    <input type="checkbox" />
                    <div>
                      <span className="setting-name">Price Drop Alerts</span>
                      <span className="setting-desc">Get notified when prices drop</span>
                    </div>
                  </label>
                  <label className="setting-item">
                    <input type="checkbox" />
                    <div>
                      <span className="setting-name">Marketing Emails</span>
                      <span className="setting-desc">Receive promotional content</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="settings-card">
                <h3>Privacy Settings</h3>
                <div className="settings-options">
                  <label className="setting-item">
                    <input type="checkbox" defaultChecked />
                    <div>
                      <span className="setting-name">Profile Visibility</span>
                      <span className="setting-desc">Make your profile visible to agents</span>
                    </div>
                  </label>
                  <label className="setting-item">
                    <input type="checkbox" defaultChecked />
                    <div>
                      <span className="setting-name">Activity Tracking</span>
                      <span className="setting-desc">Allow tracking for personalized recommendations</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="settings-card">
                <h3>Security</h3>
                <div className="security-actions">
                  <button className="btn-security">🔑 Change Password</button>
                  <button className="btn-security">📧 Update Email</button>
                  <button className="btn-security">🔐 Two-Factor Authentication</button>
                  <button className="btn-danger">⚠️ Delete Account</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
