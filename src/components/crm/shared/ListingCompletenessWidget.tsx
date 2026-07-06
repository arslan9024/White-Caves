/**
 * ListingCompletenessWidget — W18.1-P0-011
 * Fetches completeness score from /api/properties/:id/completeness
 * and renders a circular progress ring + remediation checklist.
 */

import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────

interface FailedItem {
  key: string;
  label: string;
  hint: string;
}

interface CompletenessData {
  propertyId: string;
  title: string;
  score: number;
  passed: string[];
  failed: FailedItem[];
  totalCriteria: number;
}

export interface ListingCompletenessWidgetProps {
  propertyId: string;
  showChecklist?: boolean;
  compact?: boolean;
  className?: string;
}

// ── Colour helpers ─────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 80) return '#22c55e'; // green
  if (score >= 50) return '#f59e0b'; // amber
  return '#ef4444';                  // red
}

function scoreClass(score: number): string {
  if (score >= 80) return 'completeness-score-green';
  if (score >= 50) return 'completeness-score-amber';
  return 'completeness-score-red';
}

// ── Ring SVG ──────────────────────────────────────────────────────

const RADIUS = 36;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const ScoreRing: React.FC<{ score: number }> = ({ score }) => {
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;
  const color = scoreColor(score);
  return (
    <svg
      width="90"
      height="90"
      viewBox="0 0 90 90"
      aria-label={`Completeness score: ${score}%`}
      role="img"
      data-testid="score-ring"
    >
      <circle
        cx="45" cy="45" r={RADIUS}
        fill="none"
        stroke="#2a2a2a"
        strokeWidth="8"
      />
      <circle
        cx="45" cy="45" r={RADIUS}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 45 45)"
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
      <text
        x="45" y="45"
        textAnchor="middle"
        dominantBaseline="central"
        fill={color}
        fontSize="16"
        fontWeight="bold"
        data-testid="score-text"
      >
        {score}%
      </text>
    </svg>
  );
};

// ── Skeleton ──────────────────────────────────────────────────────

const SkeletonRing: React.FC = () => (
  <div
    data-testid="completeness-loading"
    style={{
      width: 90, height: 90,
      borderRadius: '50%',
      background: 'linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
    }}
  />
);

// ── Main Component ────────────────────────────────────────────────

export const ListingCompletenessWidget: React.FC<ListingCompletenessWidgetProps> = ({
  propertyId,
  showChecklist = true,
  compact = false,
  className,
}) => {
  const [data, setData] = useState<CompletenessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/properties/${propertyId}/completeness`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json: { data: CompletenessData }) => {
        if (!cancelled) {
          setData(json.data);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message || 'Unknown error');
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [propertyId]);

  return (
    <div
      className={`listing-completeness-widget ${className ?? ''}`}
      data-testid="listing-completeness-widget"
      style={{
        padding: compact ? 12 : 20,
        background: '#0a0a0a',
        borderRadius: 12,
        border: '1px solid #2a2a2a',
        color: '#f5f5f0',
        display: 'inline-block',
      }}
    >
      {loading && <SkeletonRing />}

      {!loading && error && (
        <p data-testid="completeness-error" style={{ color: '#ef4444', fontSize: '0.875rem' }}>
          Score unavailable
        </p>
      )}

      {!loading && !error && data && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className={scoreClass(data.score)}>
              <ScoreRing score={data.score} />
            </div>
            {!compact && (
              <div>
                <p style={{ fontSize: '0.875rem', color: '#888', margin: 0 }}>
                  Completeness
                </p>
                <p style={{ fontSize: '1rem', fontWeight: 700, color: '#c9a84c', margin: 0 }}>
                  {data.passed.length} / {data.totalCriteria} criteria met
                </p>
              </div>
            )}
          </div>

          {!compact && showChecklist && (
            <ul
              data-testid="completeness-checklist"
              style={{ listStyle: 'none', padding: 0, margin: '12px 0 0', display: 'flex', flexDirection: 'column', gap: 6 }}
            >
              {data.passed.map(label => (
                <li key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem' }}>
                  <CheckCircle2 size={14} color="#22c55e" />
                  <span>{label}</span>
                </li>
              ))}
              {data.failed.map(item => (
                <li key={item.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: '0.8125rem' }}>
                  <XCircle size={14} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>
                    <strong>{item.label}</strong>
                    {item.hint && <span style={{ color: '#888', marginLeft: 4 }}>— {item.hint}</span>}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default ListingCompletenessWidget;
