import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Theme Context for Dark/Light Mode Management
 * Handles theme state, persistence, and system preference detection
 * 
 * @version 1.0
 * @lastUpdated January 16, 2026
 */

const ThemeContext = createContext(undefined);

/**
 * ThemeProvider Component
 * Wraps application to provide theme context to all children
 * 
 * @param {React.ReactNode} children - Child components
 * @param {string} defaultTheme - Default theme ('light' or 'dark')
 */
export const ThemeProvider = ({ children, defaultTheme = 'light' }) => {
  const [theme, setTheme] = useState(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('app-theme');
      const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      
      const initialTheme = storedTheme || defaultTheme || systemPreference;
      setTheme(initialTheme);
      applyTheme(initialTheme);
    } catch (error) {
      
      applyTheme(defaultTheme);
    } finally {
      setIsLoading(false);
    }
  }, [defaultTheme]);

  /**
   * Apply theme to document root
   * Updates HTML element classes and data attribute
   */
  const applyTheme = (themeValue) => {
    const htmlElement = document.documentElement;
    
    if (themeValue === 'dark') {
      htmlElement.classList.add('dark-theme');
      htmlElement.classList.remove('light-theme');
      htmlElement.setAttribute('data-theme', 'dark');
    } else {
      htmlElement.classList.add('light-theme');
      htmlElement.classList.remove('dark-theme');
      htmlElement.setAttribute('data-theme', 'light');
    }

    // Trigger CSS transitions for smooth theme change
    htmlElement.classList.add('theme-transition');
    setTimeout(() => {
      htmlElement.classList.remove('theme-transition');
    }, 300);
  };

  /**
   * Toggle between light and dark theme
   */
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
    
    try {
      localStorage.setItem('app-theme', newTheme);
    } catch (error) {
      
    }
  };

  /**
   * Set theme to specific value
   * @param {string} newTheme - Theme value ('light' or 'dark')
   */
  const updateTheme = (newTheme) => {
    if (newTheme === 'light' || newTheme === 'dark') {
      setTheme(newTheme);
      applyTheme(newTheme);
      
      try {
        localStorage.setItem('app-theme', newTheme);
      } catch (error) {
        
      }
    } else {
      
    }
  };

  const value = {
    theme,
    toggleTheme,
    updateTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    isLoading,
    setIsDark: (isDark) => updateTheme(isDark ? 'dark' : 'light'),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom Hook: useTheme
 * Use this hook to access theme context in any component
 * 
 * @returns {Object} Theme context value with theme state and toggles
 * @throws {Error} If used outside ThemeProvider
 * 
 * @example
 * const { theme, toggleTheme, isDark } = useTheme();
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error(
      'useTheme must be used within a ThemeProvider. ' +
      'Make sure your component is wrapped with <ThemeProvider>'
    );
  }
  
  return context;
};

/**
 * Higher Order Component for class-based components
 * Use this if you have class components that need theme access
 * 
 * @param {React.ComponentType} Component - Component to wrap
 * @returns {React.ComponentType} Wrapped component with theme prop
 * 
 * @example
 * export default withTheme(MyClassComponent);
 */
export const withTheme = (Component) => {
  return (props) => {
    const theme = useTheme();
    return <Component {...props} theme={theme} />;
  };
};

export default ThemeContext;
