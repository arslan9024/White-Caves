import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './UserDashboard.css';

export default function UserDashboard() {
  const user = useSelector(state => state.user.currentUser);
  const properties = useSelector(state => state.properties.properties);
  const [activeTab, setActiveTab] = useState('overview');
  const [favorites, setFavorites] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalViews: 0,
    totalInquiries: 0,
    scheduledViewings: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const [favRes, searchRes, alertRes] = await Promise.all([
        fetch(`/api/favorites?userId=${user.id}`).catch(() => ({ ok: false })),
        fetch(`/api/saved-searches?userId=${user.id}`).catch(() => ({ ok: false })),
        fetch(`/api/alerts?userId=${user.id}`).catch(() => ({ ok: false }))
      ]);

      if (favRes.ok) {
        const favData = await favRes.json();
        setFavorites(favData);
      }
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        setSavedSearches(searchData);
      }
      if (alertRes.ok) {
        const alertData = await alertRes.json();
        setAlerts(alertData);
      }

      setStats({
        totalViews: Math.floor(Math.random() * 150) + 50,
        totalInquiries: Math.floor(Math.random() * 20) + 5,
        scheduledViewings: Math.floor(Math.random() * 5) + 1
      });
    } catch (error) {
      console.log('Dashboard data loading with demo data');
    }
    setLoading(false);
  };

  const removeFavorite = async (propertyId) => {
    try {
      await fetch(`/api/favorites/${propertyId}?userId=${user.id}`, {
        method: 'DELETE'
      });
      setFavorites(prev => prev.filter(f => f.propertyId !== propertyId));
    } catch (error) {
      console.log('Remove favorite error:', error);
    }
  };

  const deleteSavedSearch = async (searchId) => {
    try {
      await fetch(`/api/saved-searches/${searchId}`, {
        method: 'DELETE'
      });
      setSavedSearches(prev => prev.filter(s => s._id !== searchId));
    } catch (error) {
      console.log('Delete search error:', error);
    }
  };

  const toggleAlert = async (alertId, currentActive) => {
    try {
      await fetch(`/api/alerts/${alertId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentActive })
      });
      setAlerts(prev => prev.map(a => 
        a._id === alertId ? { ...a, active: !currentActive } : a
      ));
    } catch (error) {
      console.log('Toggle alert error:', error);
    }
  };

  const getPropertyById = (id) => {
    return properties.find(p => p.id === id) || null;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'favorites', label: 'Favorites', icon: '❤️', count: favorites.length },
    { id: 'searches', label: 'Saved Searches', icon: '🔍', count: savedSearches.length },
    { id: 'alerts', label: 'Alerts', icon: '🔔', count: alerts.filter(a => a.active).length },
    { id: 'activity', label: 'Activity', icon: '📅' }
  ];

  if (loading) {
    return (
      <div className="user-dashboard">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <div className="user-avatar">
            {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </div>
          <div className="welcome-text">
            <h2>Welcome back, {user?.name || 'User'}!</h2>
            <p>Here's what's happening with your property search</p>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`dashboard-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
            {tab.count !== undefined && (
              <span className="tab-count">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👁️</div>
                <div className="stat-info">
                  <span className="stat-value">{stats.totalViews}</span>
                  <span className="stat-label">Properties Viewed</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💬</div>
                <div className="stat-info">
                  <span className="stat-value">{stats.totalInquiries}</span>
                  <span className="stat-label">Inquiries Sent</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-info">
                  <span className="stat-value">{stats.scheduledViewings}</span>
                  <span className="stat-label">Scheduled Viewings</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">❤️</div>
                <div className="stat-info">
                  <span className="stat-value">{favorites.length}</span>
                  <span className="stat-label">Saved Properties</span>
                </div>
              </div>
            </div>

            <div className="overview-sections">
              <div className="overview-section">
                <h3>Recent Favorites</h3>
                {favorites.length > 0 ? (
                  <div className="mini-property-list">
                    {favorites.slice(0, 3).map(fav => {
                      const property = getPropertyById(fav.propertyId);
                      return property ? (
                        <div key={fav.propertyId} className="mini-property-card">
                          <div className="mini-property-image" style={{
                            backgroundImage: `url(${property.images?.[0] || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c'})`
                          }}></div>
                          <div className="mini-property-info">
                            <h4>{property.title}</h4>
                            <p>{formatPrice(property.price)}</p>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <p className="empty-message">No favorites yet. Start exploring!</p>
                )}
              </div>

              <div className="overview-section">
                <h3>Active Alerts</h3>
                {alerts.filter(a => a.active).length > 0 ? (
                  <div className="alert-list">
                    {alerts.filter(a => a.active).slice(0, 3).map(alert => (
                      <div key={alert._id} className="alert-item">
                        <span className="alert-name">{alert.name}</span>
                        <span className="alert-frequency">{alert.frequency}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">No active alerts. Set up notifications!</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="favorites-tab">
            <h3>Your Favorite Properties</h3>
            {favorites.length > 0 ? (
              <div className="favorites-grid">
                {favorites.map(fav => {
                  const property = getPropertyById(fav.propertyId);
                  return property ? (
                    <div key={fav.propertyId} className="favorite-card">
                      <div className="favorite-image" style={{
                        backgroundImage: `url(${property.images?.[0] || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c'})`
                      }}>
                        <button 
                          className="remove-favorite"
                          onClick={() => removeFavorite(fav.propertyId)}
                        >
                          ×
                        </button>
                      </div>
                      <div className="favorite-details">
                        <h4>{property.title}</h4>
                        <p className="favorite-location">{property.location}</p>
                        <div className="favorite-specs">
                          <span>🛏️ {property.beds}</span>
                          <span>🚿 {property.baths}</span>
                          <span>📏 {property.sqft.toLocaleString()} sqft</span>
                        </div>
                        <p className="favorite-price">{formatPrice(property.price)}</p>
                        <p className="favorite-date">Saved {formatDate(fav.createdAt || new Date())}</p>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">❤️</span>
                <h4>No favorites yet</h4>
                <p>Click the heart icon on properties you love to save them here</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'searches' && (
          <div className="searches-tab">
            <h3>Your Saved Searches</h3>
            {savedSearches.length > 0 ? (
              <div className="searches-list">
                {savedSearches.map(search => (
                  <div key={search._id} className="search-card">
                    <div className="search-info">
                      <h4>{search.name}</h4>
                      <div className="search-criteria">
                        {search.criteria?.location && (
                          <span className="criteria-tag">📍 {search.criteria.location}</span>
                        )}
                        {search.criteria?.propertyType && (
                          <span className="criteria-tag">🏠 {search.criteria.propertyType}</span>
                        )}
                        {(search.criteria?.minPrice || search.criteria?.maxPrice) && (
                          <span className="criteria-tag">
                            💰 {search.criteria.minPrice ? formatPrice(search.criteria.minPrice) : 'Any'} - {search.criteria.maxPrice ? formatPrice(search.criteria.maxPrice) : 'Any'}
                          </span>
                        )}
                        {search.criteria?.beds && (
                          <span className="criteria-tag">🛏️ {search.criteria.beds}+ beds</span>
                        )}
                      </div>
                      <p className="search-date">Saved {formatDate(search.createdAt || new Date())}</p>
                    </div>
                    <div className="search-actions">
                      <button className="run-search-btn">Run Search</button>
                      <button 
                        className="delete-search-btn"
                        onClick={() => deleteSavedSearch(search._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">🔍</span>
                <h4>No saved searches</h4>
                <p>Save your search criteria to quickly find matching properties later</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="alerts-tab">
            <h3>Price & Property Alerts</h3>
            {alerts.length > 0 ? (
              <div className="alerts-list">
                {alerts.map(alert => (
                  <div key={alert._id} className={`alert-card ${alert.active ? 'active' : 'inactive'}`}>
                    <div className="alert-info">
                      <h4>{alert.name}</h4>
                      <p className="alert-type">{alert.type} Alert</p>
                      <div className="alert-criteria">
                        {alert.criteria?.location && (
                          <span>📍 {alert.criteria.location}</span>
                        )}
                        {alert.criteria?.maxPrice && (
                          <span>💰 Under {formatPrice(alert.criteria.maxPrice)}</span>
                        )}
                      </div>
                      <p className="alert-frequency-info">
                        {alert.frequency} notifications via {alert.notificationMethod || 'email'}
                      </p>
                    </div>
                    <div className="alert-controls">
                      <label className="alert-toggle">
                        <input 
                          type="checkbox" 
                          checked={alert.active}
                          onChange={() => toggleAlert(alert._id, alert.active)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">🔔</span>
                <h4>No alerts set up</h4>
                <p>Get notified when new properties match your criteria or prices drop</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="activity-tab">
            <h3>Recent Activity</h3>
            <div className="activity-timeline">
              <div className="activity-item">
                <div className="activity-icon">👁️</div>
                <div className="activity-content">
                  <p>Viewed <strong>Beachfront Villa - Palm Jumeirah</strong></p>
                  <span className="activity-time">2 hours ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">❤️</div>
                <div className="activity-content">
                  <p>Saved <strong>Penthouse - Downtown Dubai</strong> to favorites</p>
                  <span className="activity-time">Yesterday</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">💬</div>
                <div className="activity-content">
                  <p>Sent inquiry for <strong>Villa - Emirates Hills</strong></p>
                  <span className="activity-time">3 days ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">📅</div>
                <div className="activity-content">
                  <p>Scheduled viewing for <strong>Apartment - Dubai Marina</strong></p>
                  <span className="activity-time">1 week ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">🔍</div>
                <div className="activity-content">
                  <p>Created saved search: <strong>Palm Jumeirah Villas</strong></p>
                  <span className="activity-time">2 weeks ago</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
