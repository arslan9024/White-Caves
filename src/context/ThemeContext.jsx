
import { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
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
}

export function useTheme() {
  return useContext(ThemeContext);
}
