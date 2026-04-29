import { createContext, useState, useContext, useEffect, useMemo, ReactNode, Dispatch, SetStateAction, FC } from 'react';
import { safeStorage } from '../utils/safeStorage';

interface ThemeContextType {
  isDark: boolean;
  setIsDark: Dispatch<SetStateAction<boolean>>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const savedTheme = safeStorage.get('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    document.body.className = isDark ? 'dark-mode theme-transition' : 'theme-transition';
    safeStorage.set('theme', isDark ? 'dark' : 'light');
    
    const timer = setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 400);
    
    return () => clearTimeout(timer);
  }, [isDark]);

  const value = useMemo(() => ({ isDark, setIsDark }), [isDark, setIsDark]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
