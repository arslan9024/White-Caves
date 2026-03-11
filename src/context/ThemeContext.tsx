import { createContext, useState, useContext, useEffect, ReactNode, Dispatch, SetStateAction, FC } from 'react';

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
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    document.body.className = isDark ? 'dark-mode theme-transition' : 'theme-transition';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    const timer = setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 400);
    
    return () => clearTimeout(timer);
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
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
