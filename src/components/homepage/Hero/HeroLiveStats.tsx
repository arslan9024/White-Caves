import React, { useEffect, useRef, useState } from 'react';
import { motion, type Variants } from 'framer-motion';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export interface Stat {
  number: number;
  suffix: string;
  prefix?: string;
  label: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
}) => {
  const [count, setCount] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    let startTime: number | undefined;
    let animationFrame: number;

    const animate = (timestamp: number): void => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, hasStarted]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

interface HeroLiveStatsProps {
  stats: Stat[];
  isLoading?: boolean;
  itemVariants: Variants;
}

export const HeroLiveStats: React.FC<HeroLiveStatsProps> = ({ stats, isLoading, itemVariants }) => {
  return (
    <motion.div className="hero-stats-grid" variants={itemVariants}>
      {stats.map(stat => (
        <motion.div
          key={stat.label}
          className="hero-stat-item"
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <span className="hero-stat-number">
            {isLoading ? (
              <span className="hero-stat-skeleton" aria-hidden="true" />
            ) : (
              <AnimatedCounter
                end={stat.number}
                duration={2000}
                suffix={stat.suffix}
                prefix={stat.prefix}
              />
            )}
          </span>
          <span className="hero-stat-label">{stat.label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
};
