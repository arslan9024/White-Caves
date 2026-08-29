/**
 * GamifiedAnalyticsPodium.logic.ts — Live 15-Min SLA Watchdog & Podium Computations
 */

import { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { TOP_BROKERS_PODIUM, MANAGER_SPARKLINES } from '../data/GamifiedAnalyticsPodium.data';

export function useGamifiedAnalyticsPodiumLogic() {
  let isDark = false;
  try {
    const themeCtx = useTheme();
    if (themeCtx) isDark = themeCtx.isDark;
  } catch {}

  const [secondsRemaining, setSecondsRemaining] = useState(842); // 14m 02s

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining(prev => (prev > 0 ? prev - 1 : 900));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    isDark,
    podiumBrokers: TOP_BROKERS_PODIUM,
    managerSparklines: MANAGER_SPARKLINES,
    formattedSlaTime: formatTime(secondsRemaining),
  };
}
