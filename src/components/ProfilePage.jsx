import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Phone, MapPin, Heart, Settings, FileCheck, Camera, Save, X } from 'lucide-react';
import { authFetch } from '../utils/authFetch';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('personal'); // personal, documents, preferences, favorites

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    avatar: '',
    address: {},
    preferences: {},
    social: {},
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await authFetch(`/api/profiles/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          setFormData(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedInputChange = (e, parent) => {
    const { name, value } = e.target;
    if (parent === 'address') {
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
      return;
    }

    if (parent === 'preferences') {
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [name]: value,
        },
      }));
      return;
    }

    if (parent === 'social') {
      setFormData(prev => ({
        ...prev,
        social: {
          ...prev.social,
          [name]: value,
        },
      }));
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await authFetch(`/api/profiles/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updated = await response.json();
        setProfile(updated.profile);
        setEditing(false);
        setStatusMessage({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDocumentUpload = async (docType, file) => {
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async e => {
        const base64 = e.target.result;

        const response = await authFetch(`/api/profiles/${user.id}/documents/${docType}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            document: base64,
            expiryDate: new Date(), // Update as needed
          }),
        });

        if (response.ok) {
          const updated = await response.json();
          setProfile(updated.profile);
          setStatusMessage({ type: 'success', text: `${docType} uploaded successfully!` });
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="profile-loading">Loading profile...</div>;

  const completionPercentage = profile?.profileCompletion?.percentage || 0;

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div
          className="profile-cover"
          style={{ backgroundImage: 'url(https://via.placeholder.com/1200x300)' }}
        />

        <div className="profile-avatar-section">
          <div className="profile-avatar">
            <img src={profile?.avatar || `https://via.placeholder.com/120`} alt={profile?.name} />
            {editing && (
              <label className="upload-avatar">
                <Camera size={20} />
                <input type="file" accept="image/*" hidden />
              </label>
            )}
          </div>

          <div className="profile-header-info">
            <h1>{profile?.name || 'User Profile'}</h1>
            <p className="role-badge">{profile?.role}</p>
          </div>

          {!editing && (
            <button className="btn-edit-profile" onClick={() => setEditing(true)}>
              <Settings size={16} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <button
          className={`tab ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          Personal Info
        </button>
        <button
          className={`tab ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          Documents & KYC
        </button>
        <button
          className={`tab ${activeTab === 'preferences' ? 'active' : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          Preferences
        </button>
        <button
          className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          <Heart size={16} />
          Favorites
        </button>
      </div>

      {/* Content */}
      <div className="profile-content">
        {statusMessage && (
          <div
            className={`status-message ${statusMessage.type === 'error' ? 'error-message' : 'success-message'}`}
            role={statusMessage.type === 'error' ? 'alert' : 'status'}
            data-testid="profile-status-banner"
          >
            {statusMessage.text}
          </div>
        )}
        {error && <div className="error-message">{error}</div>}

        {/* Personal Info Tab */}
        {activeTab === 'personal' && (
          <div className="tab-content">
            {!editing ? (
              <div className="info-display">
                <div className="info-group">
                  <Mail size={20} />
                  <div>
                    <label>Email</label>
                    <p>{profile?.email}</p>
                  </div>
                </div>

                <div className="info-group">
                  <Phone size={20} />
                  <div>
                    <label>Phone</label>
                    <p>{profile?.phone || 'Not provided'}</p>
                  </div>
                </div>

                <div className="info-group">
                  <MapPin size={20} />
                  <div>
                    <label>Address</label>
                    <p>
                      {profile?.address?.street || ''} {profile?.address?.emirate || ''}{' '}
                      {profile?.address?.country || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="bio-section">
                  <h3>Bio</h3>
                  <p>{profile?.bio || 'No bio provided'}</p>
                </div>
              </div>
            ) : (
              <form className="edit-form">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.address?.street || ''}
                    onChange={e => handleNestedInputChange(e, 'address')}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Emirate</label>
                    <input
                      type="text"
                      name="emirate"
                      value={formData.address?.emirate || ''}
                      onChange={e => handleNestedInputChange(e, 'address')}
                    />
                  </div>

                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.address?.country || ''}
                      onChange={e => handleNestedInputChange(e, 'address')}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={4} />
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-save" onClick={handleSaveProfile}>
                    <Save size={16} />
                    Save Changes
                  </button>
                  <button type="button" className="btn-cancel" onClick={() => setEditing(false)}>
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Documents & KYC Tab */}
        {activeTab === 'documents' && (
          <div className="tab-content">
            <div className="kyc-section">
              <div className="kyc-status">
                <h3>KYC Verification Status</h3>
                <div className={`status-badge ${profile?.kyc?.status}`}>
                  {profile?.kyc?.status?.toUpperCase()}
                </div>
                {profile?.kyc?.rejectionReason && (
                  <p className="rejection-reason">Reason: {profile.kyc.rejectionReason}</p>
                )}
              </div>

              <div className="documents-grid">
                {/* Emirates ID */}
                <div className="document-card">
                  <div className="doc-header">
                    <FileCheck size={24} />
                    <h4>Emirates ID</h4>
                  </div>
                  {profile?.documents?.emiratesId?.verified ? (
                    <div className="verified-badge">✓ Verified</div>
                  ) : (
                    <>
                      <p className="doc-hint">Upload your Emirates ID front and back</p>
                      <label className="upload-btn">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleDocumentUpload('emiratesId', e.target.files[0])}
                          hidden
                        />
                        Upload Document
                      </label>
                    </>
                  )}
                </div>

                {/* Passport */}
                <div className="document-card">
                  <div className="doc-header">
                    <FileCheck size={24} />
                    <h4>Passport</h4>
                  </div>
                  {profile?.documents?.passport?.verified ? (
                    <div className="verified-badge">✓ Verified</div>
                  ) : (
                    <>
                      <p className="doc-hint">Upload your passport bio page</p>
                      <label className="upload-btn">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleDocumentUpload('passport', e.target.files[0])}
                          hidden
                        />
                        Upload Document
                      </label>
                    </>
                  )}
                </div>

                {/* Address Proof */}
                <div className="document-card">
                  <div className="doc-header">
                    <FileCheck size={24} />
                    <h4>Address Proof</h4>
                  </div>
                  {profile?.documents?.addressProof?.verified ? (
                    <div className="verified-badge">✓ Verified</div>
                  ) : (
                    <>
                      <p className="doc-hint">Utility bill or lease agreement</p>
                      <label className="upload-btn">
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={e => handleDocumentUpload('addressProof', e.target.files[0])}
                          hidden
                        />
                        Upload Document
                      </label>
                    </>
                  )}
                </div>
              </div>

              <div className="profile-completion">
                <h4>Profile Completion</h4>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${completionPercentage}%` }} />
                </div>
                <p>{completionPercentage}% Complete</p>
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="tab-content">
            <div className="preferences-section">
              <h3>Notification Settings</h3>
              <div className="preference-item">
                <label>
                  <input
                    type="checkbox"
                    checked={profile?.notifications?.emailNotifications}
                    onChange={e => {
                      setFormData(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          emailNotifications: e.target.checked,
                        },
                      }));
                    }}
                  />
                  Email Notifications
                </label>
              </div>

              <div className="preference-item">
                <label>
                  <input
                    type="checkbox"
                    checked={profile?.notifications?.newPropertyAlerts}
                    onChange={e => {
                      setFormData(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          newPropertyAlerts: e.target.checked,
                        },
                      }));
                    }}
                  />
                  New Property Alerts
                </label>
              </div>

              <h3 style={{ marginTop: '24px' }}>Privacy Settings</h3>
              <div className="preference-item">
                <label htmlFor="visibility">Profile Visibility</label>
                <select
                  id="visibility"
                  value={profile?.privacy?.profileVisibility || 'agents-only'}
                  onChange={e => {
                    setFormData(prev => ({
                      ...prev,
                      privacy: {
                        ...prev.privacy,
                        profileVisibility: e.target.value,
                      },
                    }));
                  }}
                >
                  <option value="public">Public</option>
                  <option value="agents-only">Agents Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="tab-content">
            <div className="favorites-section">
              <h3>Favorite Properties ({profile?.favorites?.properties?.length || 0})</h3>
              {profile?.favorites?.properties?.length > 0 ? (
                <div className="favorites-grid">
                  {/* Properties will be fetched and rendered here */}
                  <p>Loading favorite properties...</p>
                </div>
              ) : (
                <p className="no-favorites">No favorite properties yet</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
