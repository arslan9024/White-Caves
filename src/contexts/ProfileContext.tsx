import React, { createContext, useState, useContext, useEffect, ReactNode, Dispatch, SetStateAction, FC } from 'react';

interface UserPreferences {
  theme: 'dark' | 'light';
  language: 'en' | 'ar';
  notifications: boolean;
}

interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  role: string;
  photoURL: string | null;
  phone: string;
  company: string;
  permissions: string[];
  preferences: UserPreferences;
}

interface Notification {
  id: number;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'lead' | 'contract' | 'maintenance' | string;
}

interface ProfileContextType {
  userProfile: UserProfile | null;
  notifications: Notification[];
  loading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => void;
  markNotificationAsRead: (id: number) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: FC<ProfileProviderProps> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
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
  
  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => prev ? { ...prev, ...updates } : null);
  };
  
  const markNotificationAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };
  
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };
  
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    setNotifications(prev => [
      { ...notification, id: Date.now(), timestamp: 'Just now', isRead: false },
      ...prev
    ]);
  };
  
  const value: ProfileContextType = {
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

const defaultContextValue: ProfileContextType = {
  userProfile: null,
  notifications: [],
  loading: false,
  updateProfile: () => {},
  markNotificationAsRead: () => {},
  markAllNotificationsAsRead: () => {},
  addNotification: () => {}
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  return context || defaultContextValue;
};
