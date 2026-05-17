import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * DarkModeToggle Component
 * Theme toggle button for TopNavigation
 * Features:
 * - Sun/Moon icons with smooth rotation animation
 * - Keyboard accessible with tooltip
 * - Persists preference to localStorage (via ThemeContext)
 * - WCAG AAA compliant
 *
 * @component
 * @example
 * <DarkModeToggle />
 *
 * @requires lucide-react for Moon and Sun icons
 */
const DarkModeToggle = ({ Moon, Sun }) => {
  const { isDark, toggleTheme } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleToggle = () => {
    toggleTheme();
  };

  const tooltipText = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';

  return (
    <div className="dark-mode-toggle-wrapper">
      <button
        className="theme-toggle-btn"
        onClick={handleToggle}
        aria-label={tooltipText}
        title={tooltipText}
        aria-pressed={isDark}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
      >
        {/* Icon container with rotation animation */}
        <span
          className="theme-icon-container"
          aria-hidden="true"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
            height: '20px',
            position: 'relative',
          }}
        >
          {isDark ? (
            <Sun
              size={20}
              className="theme-icon sun-icon"
              style={{
                animation: 'rotateIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                color: '#C4161C',
              }}
            />
          ) : (
            <Moon
              size={20}
              className="theme-icon moon-icon"
              style={{
                animation: 'rotateIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                color: '#C4161C',
              }}
            />
          )}
        </span>

        {/* Tooltip */}
        {showTooltip && (
          <span
            className="theme-tooltip"
            role="tooltip"
            style={{
              position: 'absolute',
              bottom: '-40px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              zIndex: 1000,
              pointerEvents: 'none',
              animation: 'tooltipFadeIn 0.2s ease',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            }}
          >
            {tooltipText}
            {/* Tooltip arrow */}
            <div
              style={{
                content: '""',
                position: 'absolute',
                top: '-4px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderBottom: '4px solid rgba(0, 0, 0, 0.9)',
              }}
            />
          </span>
        )}
      </button>

      <style>{`
        .dark-mode-toggle-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 8px;
        }

        .theme-toggle-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          padding: 8px;
          border: none;
          border-radius: 6px;
          background: transparent;
          cursor: pointer;
          color: #C4161C;
          transition: all 0.3s ease;
          position: relative;
          font-size: 14px;
          font-weight: 500;
          min-width: 44px;
          min-height: 44px;
        }

        .theme-toggle-btn:hover {
          background-color: rgba(196, 22, 28, 0.08);
          color: #C4161C;
        }

        .theme-toggle-btn:focus {
          outline: 2px solid #C4161C;
          outline-offset: 2px;
        }

        .theme-toggle-btn:focus:not(:focus-visible) {
          outline: none;
        }

        .theme-toggle-btn:focus-visible {
          outline: 2px solid #C4161C;
          outline-offset: 2px;
        }

        .theme-toggle-btn[aria-pressed="true"] {
          background-color: rgba(196, 22, 28, 0.1);
        }

        @keyframes rotateIn {
          from {
            opacity: 0;
            transform: rotate(-180deg) scale(0.8);
          }
          to {
            opacity: 1;
            transform: rotate(0deg) scale(1);
          }
        }

        @keyframes tooltipFadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        @media (max-width: 768px) {
          .theme-toggle-btn {
            width: 36px;
            height: 36px;
            min-width: 44px;
            min-height: 44px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .theme-icon {
            transition: none;
            animation: none;
          }

          .theme-toggle-btn:hover {
            background-color: transparent;
          }

          .theme-tooltip {
            animation: none;
            opacity: 1;
          }
        }

        @media (forced-colors: active) {
          .theme-toggle-btn {
            border: 1px solid CanvasText;
          }

          .theme-toggle-btn:focus {
            outline-width: 3px;
          }

          .theme-tooltip {
            background-color: Canvas;
            color: CanvasText;
            border: 1px solid CanvasText;
          }
        }

        /* Dark mode specific styles */
        body.dark-mode .theme-toggle-btn:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        body.dark-mode .theme-toggle-btn {
          color: #E31E24;
        }

        body.dark-mode .theme-tooltip {
          background-color: rgba(255, 255, 255, 0.95);
          color: #000;
        }

        body.dark-mode .theme-tooltip::before {
          border-bottom-color: rgba(255, 255, 255, 0.95);
        }

        /* Smooth theme transition */
        body.theme-transition {
          transition: background-color 0.3s ease, color 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default DarkModeToggle;
