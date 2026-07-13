import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import AuthModal from './AuthModal';

interface AuthModalContextType {
  openAuthModal: (initialMode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};

interface AuthModalProviderProps {
  children: ReactNode;
}

export const AuthModalProvider: React.FC<AuthModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const openAuthModal = useCallback((initialMode: 'signin' | 'signup' = 'signin') => {
    setMode(initialMode);
    setIsOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <AuthModalContext.Provider value={{ openAuthModal, closeAuthModal, isAuthModalOpen: isOpen }}>
      {children}
      {isOpen && <AuthModal mode={mode} onClose={closeAuthModal} />}
    </AuthModalContext.Provider>
  );
};
