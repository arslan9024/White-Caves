import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updateWebVital, recordPageView } from '../../store/analyticsSlice';
import { createLogger } from '../../utils/logger';

const log = createLogger('WebVitalsTracker');

interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

const WebVitalsTracker = () => {
  const dispatch = useDispatch();
  const hasRegistered = useRef(false);

  useEffect(() => {
    // Prevent duplicate registration across re-renders
    if (hasRegistered.current) return;
    hasRegistered.current = true;

    dispatch(recordPageView());

    const reportWebVital = (metric: WebVitalMetric) => {
      dispatch(updateWebVital({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
      }));
    };

    const loadWebVitals = async () => {
      try {
        const { onCLS, onFCP, onLCP, onTTFB, onINP } = await import('web-vitals');
        
        onCLS(reportWebVital);
        onFCP(reportWebVital);
        onLCP(reportWebVital);
        onTTFB(reportWebVital);
        onINP(reportWebVital);
      } catch (error) {
        
      }
    };

    loadWebVitals();
  }, [dispatch]);

  return null;
};

export default WebVitalsTracker;
