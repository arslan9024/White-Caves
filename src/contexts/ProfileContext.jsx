import React, { createContext, useState, useContext, useEffect } from 'react';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setUserProfile({
          id: 'owner_001',
          displayName: 'Company Owner',
          email: 'owner@whitecaves.ae',
          role: 'Owner',
          photoURL: null,
          phone: '+971 50 123 4567',
          company: 'White Caves Real Estate LLC',
          permissions: ['all'],
          preferences: {
            theme: 'dark',
            language: 'en',
            notifications: true
          }
        });
        
        setNotifications([
          { id: 1, message: 'New lead from Palm Jumeirah inquiry', timestamp: '5 min ago', isRead: false, type: 'lead' },
          { id: 2, message: 'Contract ready for signature - Unit DH2-1234', timestamp: '1 hour ago', isRead: false, type: 'contract' },
          { id: 3, message: 'Maintenance request completed', timestamp: '3 hours ago', isRead: true, type: 'maintenance' }
        ]);
        
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfileData();
  }, []);
  
  const updateProfile = (updates) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };
  
  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };
  
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };
  
  const addNotification = (notification) => {
    setNotifications(prev => [
      { ...notification, id: Date.now(), timestamp: 'Just now', isRead: false },
      ...prev
    ]);
  };
  
  const value = {
    userProfile,
    notifications,
    loading,
    updateProfile,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    addNotification
  };
  
  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    return {
      userProfile: null,
      notifications: [],
      loading: false,
      updateProfile: () => {},
      markNotificationAsRead: () => {},
      markAllNotificationsAsRead: () => {},
      addNotification: () => {}
    };
  }
  return context;
};

export default ProfileContext;
