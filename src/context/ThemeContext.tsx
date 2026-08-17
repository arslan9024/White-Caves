import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
  Dispatch,
  SetStateAction,
  FC,
} from 'react';
import { safeStorage } from '../utils/safeStorage';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  updateTheme: (mode: ThemeMode) => void;
  isLoading: boolean;
  /** @deprecated Use setThemeMode instead */
  setIsDark: Dispatch<SetStateAction<boolean>>;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

function getSystemDark(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
    return false;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const saved = safeStorage.get('themeMode') as ThemeMode | null;
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
    // Legacy support
    const legacy = safeStorage.get('theme');
    if (legacy === 'dark') return 'dark';
    if (legacy === 'light') return 'light';
    return 'system';
  });

  const [systemDark, setSystemDark] = useState<boolean>(getSystemDark);
  const [isLoading, setIsLoading] = useState(false);

  // Listen to OS preference changes
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemDark);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setIsLoading(true);
    setThemeModeState(mode);
    safeStorage.set('themeMode', mode);
    safeStorage.set('theme', mode === 'dark' ? 'dark' : mode === 'light' ? 'light' : 'system');
    setIsLoading(false);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeModeState(prev => {
      let next: ThemeMode = 'dark';
      if (prev === 'dark') next = 'light';
      else if (prev === 'light') next = 'system';
      else next = 'dark';

      safeStorage.set('themeMode', next);
      safeStorage.set('theme', next === 'dark' ? 'dark' : next === 'light' ? 'light' : 'system');
      return next;
    });
  }, []);

  // Legacy compat: setIsDark toggles between light/dark
  const setIsDark: Dispatch<SetStateAction<boolean>> = useCallback(
    value => {
      const next = typeof value === 'function' ? value(isDark) : value;
      setThemeMode(next ? 'dark' : 'light');
    },
    [isDark, setThemeMode]
  );

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.className = isDark ? 'dark-mode theme-transition' : 'theme-transition';
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme-mode', themeMode);

    const timer = setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 400);

    return () => clearTimeout(timer);
  }, [isDark, themeMode]);

  const value = useMemo(
    () => ({
      isDark,
      themeMode,
      setThemeMode,
      toggleTheme,
      updateTheme: setThemeMode,
      isLoading,
      setIsDark,
    }),
    [isDark, themeMode, setThemeMode, toggleTheme, isLoading, setIsDark]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
