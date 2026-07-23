import React, { useMemo, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * KPICard — Premium animated dashboard metric card.
 * Features: count-up animation, glassmorphism, sparkline, trend badge.
 */

const useCountUp = (target, duration = 1200, enabled = true) => {
  const [count, setCount] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!enabled || typeof target !== 'number') {
      setCount(target);
      return;
    }
    const startTime = performance.now();
    const startVal = 0;

    const tick = now => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(startVal + (target - startVal) * eased));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration, enabled]);

  return count;
};

const GRADIENTS = {
  red: 'linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(220,38,38,0.04) 100%)',
  blue: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(37,99,235,0.04) 100%)',
  green: 'linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(22,163,74,0.04) 100%)',
  purple: 'linear-gradient(135deg, rgba(168,85,247,0.12) 0%, rgba(147,51,234,0.04) 100%)',
  gold: 'linear-gradient(135deg, rgba(234,179,8,0.12) 0%, rgba(202,138,4,0.04) 100%)',
};

const ACCENT_COLORS = {
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#22c55e',
  purple: '#a855f7',
  gold: '#eab308',
};

const KPICard = ({
  title,
  value,
  unit = '',
  unitPrefix = false,
  trend = 0,
  color = 'blue',
  icon,
  loading = false,
  sparklineData = [],
  subtitle,
  animate = true,
  onClick,
}) => {
  const numericValue =
    typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]/g, '')) || 0;
  const displayValue = useCountUp(numericValue, 1200, animate && !loading);
  const formattedDisplay =
    typeof value === 'number' ? displayValue.toLocaleString() : String(value);

  const accent = ACCENT_COLORS[color] || ACCENT_COLORS.blue;
  const gradient = GRADIENTS[color] || GRADIENTS.blue;

  const isPositive = trend > 0;
  const isNegative = trend < 0;

  const sparklinePoints = useMemo(() => {
    if (!sparklineData || sparklineData.length < 2) return [];
    const max = Math.max(...sparklineData);
    const min = Math.min(...sparklineData);
    const range = max - min || 1;
    return sparklineData.map((val, idx) => ({
      x: (idx / (sparklineData.length - 1)) * 100,
      y: 100 - ((val - min) / range) * 80 - 10,
    }));
  }, [sparklineData]);

  const polylineStr = sparklinePoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div
      role="region"
      aria-label={`${title} metric card`}
      onClick={onClick}
      style={{
        background: `${gradient}`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${accent}22`,
        borderLeft: `4px solid ${accent}`,
        borderRadius: '16px',
        padding: '20px 24px',
        boxShadow: `0 4px 24px ${accent}18, 0 1px 4px rgba(0,0,0,0.08)`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow 0.2s ease, transform 0.15s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        if (onClick) {
          e.currentTarget.style.boxShadow = `0 8px 32px ${accent}30, 0 2px 8px rgba(0,0,0,0.12)`;
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = `0 4px 24px ${accent}18, 0 1px 4px rgba(0,0,0,0.08)`;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Glow orb decoration */}
      <div
        style={{
          position: 'absolute',
          top: '-30px',
          right: '-30px',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accent}20 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '12px',
        }}
      >
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '6px',
            }}
          >
            {title}
          </p>

          {loading ? (
            <div
              style={{
                height: '36px',
                width: '120px',
                background: 'rgba(148,163,184,0.2)',
                borderRadius: '8px',
                animation: 'pulse 1.5s infinite',
              }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              {unitPrefix && unit && (
                <span style={{ fontSize: '18px', fontWeight: 700, color: accent }}>{unit}</span>
              )}
              <span
                style={{
                  fontSize: '32px',
                  fontWeight: 800,
                  color: '#0f172a',
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {formattedDisplay}
              </span>
              {!unitPrefix && unit && (
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>{unit}</span>
              )}
            </div>
          )}

          {subtitle && !loading && (
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{subtitle}</p>
          )}
        </div>

        {icon && (
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: `${accent}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: accent,
              fontSize: '20px',
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
      </div>

      {trend !== 0 && !loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              padding: '2px 8px',
              borderRadius: '99px',
              fontSize: '11px',
              fontWeight: 700,
              background: isPositive ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
              color: isPositive ? '#16a34a' : '#dc2626',
            }}
          >
            <span>{isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend).toFixed(1)}%</span>
          </span>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>vs last period</span>
        </div>
      )}

      {sparklinePoints.length > 1 && !loading && (
        <div style={{ marginTop: '16px', height: '40px', position: 'relative' }}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={`sg-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accent} stopOpacity="0.3" />
                <stop offset="100%" stopColor={accent} stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon points={`0,100 ${polylineStr} 100,100`} fill={`url(#sg-${color})`} />
            <polyline
              points={polylineStr}
              fill="none"
              stroke={accent}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

KPICard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  unit: PropTypes.string,
  unitPrefix: PropTypes.bool,
  trend: PropTypes.number,
  color: PropTypes.oneOf(['red', 'blue', 'green', 'purple', 'gold']),
  icon: PropTypes.node,
  loading: PropTypes.bool,
  sparklineData: PropTypes.arrayOf(PropTypes.number),
  subtitle: PropTypes.string,
  animate: PropTypes.bool,
  onClick: PropTypes.func,
};

export default KPICard;
