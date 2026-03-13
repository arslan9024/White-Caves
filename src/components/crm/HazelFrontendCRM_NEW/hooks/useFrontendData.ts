import { useState, useMemo } from 'react';
import { COMPONENT_LIBRARY, DESIGN_TOKENS, PERFORMANCE_METRICS, ACCESSIBILITY_AUDIT } from '../data/frontend';
import { FRONTEND_FEATURES } from '../data/features';

export const useFrontendData = () => {
  const [themeMode, setThemeMode] = useState<string>('dark');

  const componentStats = useMemo(() => ({
    total: COMPONENT_LIBRARY.length,
    stable: COMPONENT_LIBRARY.filter(c => c.status === 'stable').length,
    new: COMPONENT_LIBRARY.filter(c => c.status === 'new').length,
    totalUsage: COMPONENT_LIBRARY.reduce((sum, c) => sum + c.usage, 0)
  }), []);

  const accessibilityStats = useMemo(() => {
    const avgScore = Math.round(ACCESSIBILITY_AUDIT.reduce((sum, a) => sum + a.score, 0) / ACCESSIBILITY_AUDIT.length);
    const totalIssues = ACCESSIBILITY_AUDIT.reduce((sum, a) => sum + a.issues, 0);
    return { avgScore, totalIssues };
  }, []);

  return {
    componentStats,
    accessibilityStats,
    components: COMPONENT_LIBRARY,
    designTokens: DESIGN_TOKENS,
    performanceMetrics: PERFORMANCE_METRICS,
    accessibilityAudit: ACCESSIBILITY_AUDIT,
    themeMode,
    setThemeMode,
    features: FRONTEND_FEATURES
  };
};
