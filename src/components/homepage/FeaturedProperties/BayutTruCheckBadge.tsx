import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

export interface BayutTruCheckBadgeProps {
  variant?: 'variant-1' | 'variant-2';
  timestamp?: string;
  className?: string;
}

/**
 * BayutTruCheckBadge — Luxury Design Standard Token #12
 * Component Variant 2: Animated luxury verified stamp with radial micro-pulse,
 * gold-to-emerald gradient border, and statutory DLD Trakheesi cross-verification.
 */
export const BayutTruCheckBadge: React.FC<BayutTruCheckBadgeProps> = ({
  variant = 'variant-2',
  timestamp = 'Today',
  className = '',
}) => {
  if (variant === 'variant-1') {
    return (
      <span className={`fp-badge fp-badge--trucheck ${className}`} data-testid="trucheck-badge-v1">
        <CheckCircle2 size={11} className="text-emerald-400" />
        <span>TruCheck™</span>
      </span>
    );
  }

  return (
    <motion.div
      className={`trucheck-stamp-v2 ${className}`}
      data-testid="trucheck-badge-v2"
      initial={{ scale: 0.95, opacity: 0.9 }}
      animate={{ scale: [0.98, 1.02, 0.98], opacity: 1 }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      title={`Bayut TruCheck™ Verified ${timestamp} via DLD Trakheesi Gateway`}
    >
      <div className="trucheck-pulse-ring" aria-hidden="true" />
      <span className="trucheck-icon-wrap">
        <CheckCircle2 size={12} className="trucheck-icon" />
      </span>
      <span className="trucheck-text">TruCheck™</span>
      <span className="trucheck-glow-seal">
        <ShieldCheck size={10} className="trucheck-sub-icon" />
      </span>
    </motion.div>
  );
};

export default BayutTruCheckBadge;
