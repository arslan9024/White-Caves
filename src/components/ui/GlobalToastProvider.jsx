/**
 * GlobalToastProvider — World-class toast notification system.
 * Features: slide-in animation, auto-dismiss, stacking, type variants,
 * progress bar, dismiss on click.
 *
 * Usage:
 *   Wrap your app with <GlobalToastProvider />
 *   import { useToast } from './GlobalToastProvider'
 *   const { toast } = useToast();
 *   toast.success('Saved!'); toast.error('Failed'); toast.info('Tip'); toast.warn('Low quota');
 */

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

// ─── Types ───────────────────────────────────────────────────────────────────

const TOAST_VARIANTS = {
  success: {
    bg: 'rgba(17,24,39,0.97)',
    accent: '#22c55e',
    icon: '✓',
    label: 'Success',
  },
  error: {
    bg: 'rgba(17,24,39,0.97)',
    accent: '#ef4444',
    icon: '✕',
    label: 'Error',
  },
  warn: {
    bg: 'rgba(17,24,39,0.97)',
    accent: '#f59e0b',
    icon: '⚠',
    label: 'Warning',
  },
  info: {
    bg: 'rgba(17,24,39,0.97)',
    accent: '#3b82f6',
    icon: 'ℹ',
    label: 'Info',
  },
};

const DEFAULT_DURATION = 4500;

// ─── Context ─────────────────────────────────────────────────────────────────

const ToastContext = createContext(null);

let _addToast = null;

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (ctx) return ctx;
  // Fallback: allow calls outside Provider tree via module-level ref
  const fire = (type, message, options) =>
    _addToast?.({ type, message, duration: DEFAULT_DURATION, ...options });
  return {
    toast: {
      success: (msg, opts) => fire('success', msg, opts),
      error: (msg, opts) => fire('error', msg, opts),
      warn: (msg, opts) => fire('warn', msg, opts),
      info: (msg, opts) => fire('info', msg, opts),
    },
  };
};

// ─── Single Toast Item ────────────────────────────────────────────────────────

const ToastItem = ({ id, type, message, duration, title, onDismiss }) => {
  const variant = TOAST_VARIANTS[type] || TOAST_VARIANTS.info;
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const timerRef = useRef(null);

  const dismiss = useCallback(() => {
    setLeaving(true);
    setTimeout(() => onDismiss(id), 320);
  }, [id, onDismiss]);

  useEffect(() => {
    // Animate in
    const t = setTimeout(() => setVisible(true), 16);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (duration > 0) {
      timerRef.current = setTimeout(dismiss, duration);
    }
    return () => clearTimeout(timerRef.current);
  }, [dismiss, duration]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      onClick={dismiss}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        background: variant.bg,
        borderLeft: `4px solid ${variant.accent}`,
        borderRadius: '12px',
        padding: '14px 16px',
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)`,
        minWidth: '300px',
        maxWidth: '420px',
        cursor: 'pointer',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        transform: visible && !leaving ? 'translateX(0) scale(1)' : 'translateX(100%) scale(0.96)',
        opacity: visible && !leaving ? 1 : 0,
        transition: leaving
          ? 'transform 0.28s cubic-bezier(0.4,0,1,1), opacity 0.28s ease'
          : 'transform 0.32s cubic-bezier(0.34,1.56,0.64,1), opacity 0.28s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: `${variant.accent}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: variant.accent,
          fontWeight: 800,
          fontSize: '13px',
          flexShrink: 0,
          marginTop: '1px',
        }}
      >
        {variant.icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-f1f5f9, #f1f5f9)', margin: '0 0 2px 0' }}>
            {title}
          </p>
        )}
        <p
          style={{
            fontSize: '13px',
            color: '#94a3b8',
            margin: 0,
            lineHeight: 1.5,
            wordBreak: 'break-word',
          }}
        >
          {message}
        </p>
      </div>

      {/* Close hint */}
      <span
        style={{
          fontSize: '16px',
          color: '#475569',
          flexShrink: 0,
          lineHeight: 1,
          marginTop: '2px',
        }}
      >
        ×
      </span>

      {/* Progress bar */}
      {duration > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '2px',
            background: variant.accent,
            width: '100%',
            transformOrigin: 'left',
            animation: `wc-toast-progress ${duration}ms linear forwards`,
            opacity: 0.6,
          }}
        />
      )}
    </div>
  );
};

// ─── Provider ─────────────────────────────────────────────────────────────────

let _idCounter = 0;

const GlobalToastProvider = ({ children, maxToasts = 5 }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(
    ({ type, message, duration = DEFAULT_DURATION, title }) => {
      const id = `wc-toast-${++_idCounter}`;
      setToasts(prev => {
        const next = [...prev, { id, type, message, duration, title }];
        return next.slice(-maxToasts);
      });
      return id;
    },
    [maxToasts]
  );

  const dismiss = useCallback(id => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Expose to module-level helper (for use outside React tree)
  useEffect(() => {
    _addToast = addToast;
    return () => {
      _addToast = null;
    };
  }, [addToast]);

  const ctxValue = {
    toast: {
      success: (msg, opts) => addToast({ type: 'success', message: msg, ...opts }),
      error: (msg, opts) => addToast({ type: 'error', message: msg, ...opts }),
      warn: (msg, opts) => addToast({ type: 'warn', message: msg, ...opts }),
      info: (msg, opts) => addToast({ type: 'info', message: msg, ...opts }),
    },
    dismiss,
  };

  return (
    <ToastContext.Provider value={ctxValue}>
      {children}

      {/* Inject keyframe */}
      <style>{`
        @keyframes wc-toast-progress {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>

      {/* Toast stack */}
      <div
        aria-label="Notifications"
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'flex-end',
          pointerEvents: 'none',
        }}
      >
        {toasts.map(t => (
          <div key={t.id} style={{ pointerEvents: 'auto' }}>
            <ToastItem {...t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

GlobalToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
  maxToasts: PropTypes.number,
};

export default GlobalToastProvider;
