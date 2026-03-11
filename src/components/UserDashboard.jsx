import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import * as S from './UserDashboard.styles';

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
      <S.UserDashboard>
        <S.DashboardLoading>
          <S.LoadingSpinner></S.LoadingSpinner>
          <p>Loading your dashboard...</p>
        </S.DashboardLoading>
      </S.UserDashboard>
    );
  }

  return (
    <S.UserDashboard>
      <S.DashboardHeader>
        <S.DashboardWelcome>
          <S.UserAvatar>
            {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </S.UserAvatar>
          <S.WelcomeText>
            <h2>Welcome back, {user?.name || 'User'}!</h2>
            <p>Here's what's happening with your property search</p>
          </S.WelcomeText>
        </S.DashboardWelcome>
      </S.DashboardHeader>

      <S.DashboardTabs>
        {tabs.map(tab => (
          <S.DashboardTab
            key={tab.id}
            isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            <S.TabIcon>{tab.icon}</S.TabIcon>
            <S.TabLabel>{tab.label}</S.TabLabel>
            {tab.count !== undefined && (
              <S.TabCount>{tab.count}</S.TabCount>
            )}
          </S.DashboardTab>
        ))}
      </S.DashboardTabs>

      <S.DashboardContent>
        {activeTab === 'overview' && (
          <div>
            <S.StatsGrid>
              <S.StatCard>
                <S.StatIcon>👁️</S.StatIcon>
                <S.StatInfo>
                  <S.StatValue>{stats.totalViews}</S.StatValue>
                  <S.StatLabel>Properties Viewed</S.StatLabel>
                </S.StatInfo>
              </S.StatCard>
              <S.StatCard>
                <S.StatIcon>💬</S.StatIcon>
                <S.StatInfo>
                  <S.StatValue>{stats.totalInquiries}</S.StatValue>
                  <S.StatLabel>Inquiries Sent</S.StatLabel>
                </S.StatInfo>
              </S.StatCard>
              <S.StatCard>
                <S.StatIcon>📅</S.StatIcon>
                <S.StatInfo>
                  <S.StatValue>{stats.scheduledViewings}</S.StatValue>
                  <S.StatLabel>Scheduled Viewings</S.StatLabel>
                </S.StatInfo>
              </S.StatCard>
              <S.StatCard>
                <S.StatIcon>❤️</S.StatIcon>
                <S.StatInfo>
                  <S.StatValue>{favorites.length}</S.StatValue>
                  <S.StatLabel>Saved Properties</S.StatLabel>
                </S.StatInfo>
              </S.StatCard>
            </S.StatsGrid>

            <S.OverviewSections>
              <S.OverviewSection>
                <h3>Recent Favorites</h3>
                {favorites.length > 0 ? (
                  <S.MiniPropertyList>
                    {favorites.slice(0, 3).map(fav => {
                      const property = getPropertyById(fav.propertyId);
                      return property ? (
                        <S.MiniPropertyCard key={fav.propertyId}>
                          <S.MiniPropertyImage style={{
                            backgroundImage: `url(${property.images?.[0] || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c'})`
                          }}></S.MiniPropertyImage>
                          <S.MiniPropertyInfo>
                            <h4>{property.title}</h4>
                            <p>{formatPrice(property.price)}</p>
                          </S.MiniPropertyInfo>
                        </S.MiniPropertyCard>
                      ) : null;
                    })}
                  </S.MiniPropertyList>
                ) : (
                  <S.EmptyMessage>No favorites yet. Start exploring!</S.EmptyMessage>
                )}
              </S.OverviewSection>

              <S.OverviewSection>
                <h3>Active Alerts</h3>
                {alerts.filter(a => a.active).length > 0 ? (
                  <S.AlertList>
                    {alerts.filter(a => a.active).slice(0, 3).map(alert => (
                      <S.AlertItem key={alert._id}>
                        <S.AlertName>{alert.name}</S.AlertName>
                        <S.AlertFrequency>{alert.frequency}</S.AlertFrequency>
                      </S.AlertItem>
                    ))}
                  </S.AlertList>
                ) : (
                  <S.EmptyMessage>No active alerts. Set up notifications!</S.EmptyMessage>
                )}
              </S.OverviewSection>
            </S.OverviewSections>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div>
            <h3>Your Favorite Properties</h3>
            {favorites.length > 0 ? (
              <S.FavoritesGrid>
                {favorites.map(fav => {
                  const property = getPropertyById(fav.propertyId);
                  return property ? (
                    <S.FavoriteCard key={fav.propertyId}>
                      <S.FavoriteImage style={{
                        backgroundImage: `url(${property.images?.[0] || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c'})`
                      }}>
                        <S.RemoveFavorite 
                          onClick={() => removeFavorite(fav.propertyId)}
                        >
                          ×
                        </S.RemoveFavorite>
                      </S.FavoriteImage>
                      <S.FavoriteDetails>
                        <h4>{property.title}</h4>
                        <S.FavoriteLocation>{property.location}</S.FavoriteLocation>
                        <S.FavoriteSpecs>
                          <span>🛏️ {property.beds}</span>
                          <span>🚿 {property.baths}</span>
                          <span>📏 {property.sqft.toLocaleString()} sqft</span>
                        </S.FavoriteSpecs>
                        <S.FavoritePrice>{formatPrice(property.price)}</S.FavoritePrice>
                        <S.FavoriteDate>Saved {formatDate(fav.createdAt || new Date())}</S.FavoriteDate>
                      </S.FavoriteDetails>
                    </S.FavoriteCard>
                  ) : null;
                })}
              </S.FavoritesGrid>
            ) : (
              <S.EmptyState>
                <S.EmptyIcon>❤️</S.EmptyIcon>
                <h4>No favorites yet</h4>
                <p>Click the heart icon on properties you love to save them here</p>
              </S.EmptyState>
            )}
          </div>
        )}

        {activeTab === 'searches' && (
          <div>
            <h3>Your Saved Searches</h3>
            {savedSearches.length > 0 ? (
              <S.SearchesList>
                {savedSearches.map(search => (
                  <S.SearchCard key={search._id}>
                    <S.SearchInfo>
                      <h4>{search.name}</h4>
                      <S.SearchCriteria>
                        {search.criteria?.location && (
                          <S.CriteriaTag>📍 {search.criteria.location}</S.CriteriaTag>
                        )}
                        {search.criteria?.propertyType && (
                          <S.CriteriaTag>🏠 {search.criteria.propertyType}</S.CriteriaTag>
                        )}
                        {(search.criteria?.minPrice || search.criteria?.maxPrice) && (
                          <S.CriteriaTag>
                            💰 {search.criteria.minPrice ? formatPrice(search.criteria.minPrice) : 'Any'} - {search.criteria.maxPrice ? formatPrice(search.criteria.maxPrice) : 'Any'}
                          </S.CriteriaTag>
                        )}
                        {search.criteria?.beds && (
                          <S.CriteriaTag>🛏️ {search.criteria.beds}+ beds</S.CriteriaTag>
                        )}
                      </S.SearchCriteria>
                      <S.SearchDate>Saved {formatDate(search.createdAt || new Date())}</S.SearchDate>
                    </S.SearchInfo>
                    <S.SearchActions>
                      <S.RunSearchBtn>Run Search</S.RunSearchBtn>
                      <S.DeleteSearchBtn 
                        onClick={() => deleteSavedSearch(search._id)}
                      >
                        Delete
                      </S.DeleteSearchBtn>
                    </S.SearchActions>
                  </S.SearchCard>
                ))}
              </S.SearchesList>
            ) : (
              <S.EmptyState>
                <S.EmptyIcon>🔍</S.EmptyIcon>
                <h4>No saved searches</h4>
                <p>Save your search criteria to quickly find matching properties later</p>
              </S.EmptyState>
            )}
          </div>
        )}

        {activeTab === 'alerts' && (
          <div>
            <h3>Price & Property Alerts</h3>
            {alerts.length > 0 ? (
              <S.AlertsList>
                {alerts.map(alert => (
                  <S.AlertCard key={alert._id} isInactive={!alert.active}>
                    <S.AlertInfo>
                      <h4>{alert.name}</h4>
                      <S.AlertType>{alert.type} Alert</S.AlertType>
                      <S.AlertCriteria>
                        {alert.criteria?.location && (
                          <span>📍 {alert.criteria.location}</span>
                        )}
                        {alert.criteria?.maxPrice && (
                          <span>💰 Under {formatPrice(alert.criteria.maxPrice)}</span>
                        )}
                      </S.AlertCriteria>
                      <S.AlertFrequencyInfo>
                        {alert.frequency} notifications via {alert.notificationMethod || 'email'}
                      </S.AlertFrequencyInfo>
                    </S.AlertInfo>
                    <S.AlertControls>
                      <S.AlertToggle>
                        <input 
                          type="checkbox" 
                          checked={alert.active}
                          onChange={() => toggleAlert(alert._id, alert.active)}
                        />
                        <S.ToggleSlider></S.ToggleSlider>
                      </S.AlertToggle>
                    </S.AlertControls>
                  </S.AlertCard>
                ))}
              </S.AlertsList>
            ) : (
              <S.EmptyState>
                <S.EmptyIcon>🔔</S.EmptyIcon>
                <h4>No alerts set up</h4>
                <p>Get notified when new properties match your criteria or prices drop</p>
              </S.EmptyState>
            )}
          </div>
        )}

        {activeTab === 'activity' && (
          <div>
            <h3>Recent Activity</h3>
            <S.ActivityTimeline>
              <S.ActivityItem>
                <S.ActivityIcon>👁️</S.ActivityIcon>
                <S.ActivityContent>
                  <p>Viewed <strong>Beachfront Villa - Palm Jumeirah</strong></p>
                  <S.ActivityTime>2 hours ago</S.ActivityTime>
                </S.ActivityContent>
              </S.ActivityItem>
              <S.ActivityItem>
                <S.ActivityIcon>❤️</S.ActivityIcon>
                <S.ActivityContent>
                  <p>Saved <strong>Penthouse - Downtown Dubai</strong> to favorites</p>
                  <S.ActivityTime>Yesterday</S.ActivityTime>
                </S.ActivityContent>
              </S.ActivityItem>
              <S.ActivityItem>
                <S.ActivityIcon>💬</S.ActivityIcon>
                <S.ActivityContent>
                  <p>Sent inquiry for <strong>Villa - Emirates Hills</strong></p>
                  <S.ActivityTime>3 days ago</S.ActivityTime>
                </S.ActivityContent>
              </S.ActivityItem>
              <S.ActivityItem>
                <S.ActivityIcon>📅</S.ActivityIcon>
                <S.ActivityContent>
                  <p>Scheduled viewing for <strong>Apartment - Dubai Marina</strong></p>
                  <S.ActivityTime>1 week ago</S.ActivityTime>
                </S.ActivityContent>
              </S.ActivityItem>
              <S.ActivityItem>
                <S.ActivityIcon>🔍</S.ActivityIcon>
                <S.ActivityContent>
                  <p>Created saved search: <strong>Palm Jumeirah Villas</strong></p>
                  <S.ActivityTime>2 weeks ago</S.ActivityTime>
                </S.ActivityContent>
              </S.ActivityItem>
            </S.ActivityTimeline>
          </div>
        )}
      </S.DashboardContent>
    </S.UserDashboard>
  );
}
