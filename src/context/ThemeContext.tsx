import {
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

interface ThemeContextType {
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  /** @deprecated Use setThemeMode instead */
  setIsDark: Dispatch<SetStateAction<boolean>>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

function getSystemDark(): boolean {
  return typeof window !== 'undefined'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : false;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const saved = safeStorage.get('themeMode') as ThemeMode | null;
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
    // Legacy support
    const legacy = safeStorage.get('theme');
    if (legacy === 'dark') return 'dark';
    return 'system';
  });

  const [systemDark, setSystemDark] = useState<boolean>(getSystemDark);

  // Listen to OS preference changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemDark);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    safeStorage.set('themeMode', mode);
    safeStorage.set('theme', mode === 'dark' ? 'dark' : mode === 'light' ? 'light' : 'system');
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
    document.body.className = isDark ? 'dark-mode theme-transition' : 'theme-transition';
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme-mode', themeMode);

    const timer = setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 400);

    return () => clearTimeout(timer);
  }, [isDark, themeMode]);

  const value = useMemo(
    () => ({ isDark, themeMode, setThemeMode, setIsDark }),
    [isDark, themeMode, setThemeMode, setIsDark]
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
