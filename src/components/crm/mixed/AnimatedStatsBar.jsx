import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './AnimatedStatsBar.css';

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: 'easeOut'
    }
  })
};

function AnimatedNumber({ value, duration = 1000 }) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const numericValue = typeof value === 'number' ? value : parseInt(value) || 0;
    if (numericValue === 0) {
      setDisplayValue(0);
      return;
    }
    
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(numericValue * eased));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, duration]);
  
  return <span>{displayValue.toLocaleString()}</span>;
}

export default function AnimatedStatsBar({ stats = [], className = '' }) {
  return (
    <div className={`animated-stats-bar ${className}`}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.id || index}
          className={`animated-stat-card ${stat.highlight ? 'highlight' : ''}`}
          custom={index}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.02, y: -4 }}
        >
          {stat.icon && (
            <div 
              className="stat-icon-wrapper"
              style={{ background: stat.iconBg || 'rgba(212, 175, 55, 0.1)' }}
            >
              {stat.icon}
            </div>
          )}
          
          <div className="stat-content">
            <div className="stat-value-row">
              <span className="stat-value">
                {stat.prefix}
                {typeof stat.value === 'number' ? (
                  <AnimatedNumber value={stat.value} />
                ) : (
                  stat.value
                )}
                {stat.suffix}
              </span>
              
              {stat.change !== undefined && (
                <span className={`stat-change ${stat.change >= 0 ? 'positive' : 'negative'}`}>
                  {stat.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {Math.abs(stat.change)}%
                </span>
              )}
            </div>
            
            <span className="stat-label">{stat.label}</span>
            
            {stat.subtext && (
              <span className="stat-subtext">{stat.subtext}</span>
            )}
          </div>
          
          {stat.progress !== undefined && (
            <div className="stat-progress-bar">
              <motion.div 
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${stat.progress}%` }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.6, ease: 'easeOut' }}
                style={{ background: stat.progressColor || 'var(--color-b03737, #B03737)' }}
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

export function MiniStatCard({ label, value, icon, trend, onClick }) {
  return (
    <motion.div 
      className="mini-stat-card"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {icon && <div className="mini-stat-icon">{icon}</div>}
      <div className="mini-stat-content">
        <span className="mini-stat-value">{value}</span>
        <span className="mini-stat-label">{label}</span>
      </div>
      {trend !== undefined && (
        <span className={`mini-stat-trend ${trend >= 0 ? 'up' : 'down'}`}>
          {trend >= 0 ? '+' : ''}{trend}%
        </span>
      )}
    </motion.div>
  );
}
