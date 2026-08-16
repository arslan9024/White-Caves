import React, { createContext, useContext } from 'react';

// The exact "400x Overdrive" luxury tokens we use across the app
export const LuxuryTokens = {
  colors: {
    obsidian: '#0f0f0f',
    goldFoil: '#D4AF37',
    emerald: '#10B981',
    glassBase: 'rgba(250, 250, 250, 0.7)',
    glassDark: 'rgba(20, 20, 20, 0.65)',
    danger: '#EF4444',
  },
  shadows: {
    goldGlow: '0 40px 100px rgba(212, 175, 55, 0.2), 0 10px 40px rgba(0,0,0,0.05)',
    darkGlow: '0 40px 100px rgba(0, 0, 0, 0.3), 0 10px 40px rgba(0,0,0,0.2)',
  },
  filters: {
    glassBlur: 'blur(30px) saturate(200%)',
    softBlur: 'blur(12px)',
  },
  transitions: {
    springBouncy: { type: 'spring', stiffness: 300, damping: 15 },
    springSmooth: { type: 'spring', stiffness: 100, damping: 20 },
    cubicLiquid: '0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
  }
};

const ThemeContext = createContext(LuxuryTokens);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeContext.Provider value={LuxuryTokens}>
      {children}
    </ThemeContext.Provider>
  );
};
