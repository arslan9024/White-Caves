import React, { useState } from 'react';
import { Palette, Code, Sun, Moon } from 'lucide-react';

interface DesignTokens {
  colors: Record<string, string>;
  typography: Record<string, string>;
  spacing: string[];
}

interface DesignSystemTabProps {
  designTokens: DesignTokens;
  themeMode: string;
  onThemeChange: (mode: string) => void;
}

const DesignSystemTab: React.FC<DesignSystemTabProps> = ({ designTokens, themeMode, onThemeChange }) => {
  return (
    <div className="design-system-view">
      <h3>Design System</h3>
      
      <div className="token-section">
        <h4><Palette size={16} /> Color Tokens</h4>
        <div className="color-tokens">
          {Object.entries(designTokens.colors).map(([name, value]: [string, string]) => (
            <div key={name} className="color-token">
              <div 
                className="color-swatch" 
                style={{ background: value }}
                title={value}
              ></div>
              <span className="token-name">{name}</span>
              <span className="token-value">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="token-section">
        <h4><Code size={16} /> Typography</h4>
        <div className="typography-tokens">
          {Object.entries(designTokens.typography).map(([role, font]: [string, string]) => (
            <div key={role} className="typography-token">
              <span className="token-name">{role}</span>
              <span className="token-value" style={{ fontFamily: font }}>
                {font}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="token-section">
        <h4><Palette size={16} /> Spacing Scale</h4>
        <div className="spacing-tokens">
          {designTokens.spacing.map((value: string, idx: number) => (
            <div key={value} className="spacing-token">
              <div 
                className="spacing-demo" 
                style={{ width: value, height: '20px', background: 'var(--color-6366f1, #6366F1)' }}
              ></div>
              <span className="token-value">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="theme-section">
        <h4><Sun size={16} /> Theme Mode</h4>
        <div className="toggle-buttons">
          <button
            className={`theme-btn ${themeMode === 'light' ? 'active' : ''}`}
            onClick={() => onThemeChange('light')}
          >
            <Sun size={16} /> Light
          </button>
          <button
            className={`theme-btn ${themeMode === 'dark' ? 'active' : ''}`}
            onClick={() => onThemeChange('dark')}
          >
            <Moon size={16} /> Dark
          </button>
        </div>
      </div>
    </div>
  );
};

export default DesignSystemTab;
