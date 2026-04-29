import { useTheme } from '../context/ThemeContext';

/**
 * Custom Hook: useDarkMode
 * Simplified interface for dark mode management
 * Provides easy access to dark mode state and toggle function
 * 
 * @version 1.0
 * @lastUpdated January 16, 2026
 * 
 * @returns {Object} Dark mode state and control methods
 * @returns {boolean} isDarkMode - Current dark mode status
 * @returns {Function} toggleDarkMode - Toggle dark mode on/off
 * @returns {Function} setDarkMode - Set dark mode to specific state
 * @returns {boolean} isLoading - Theme initialization loading state
 * 
 * @example
 * const { isDarkMode, toggleDarkMode } = useDarkMode();
 * 
 * return (
 *   <button onClick={toggleDarkMode}>
 *     {isDarkMode ? '☀️' : '🌙'}
 *   </button>
 * );
 */
export const useDarkMode = () => {
  const { isDark, toggleTheme, updateTheme, isLoading } = useTheme();

  return {
    isDarkMode: isDark,
    toggleDarkMode: toggleTheme,
    setDarkMode: (isDark) => updateTheme(isDark ? 'dark' : 'light'),
    isLoading,
  };
};

export default useDarkMode;
