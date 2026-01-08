import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateWebVital, recordPageView } from '../../store/analyticsSlice';

const WebVitalsTracker = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(recordPageView());

    const reportWebVital = (metric) => {
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
        console.log('Web vitals not available:', error.message);
      }
    };

    loadWebVitals();
  }, [dispatch]);

  return null;
};

export default WebVitalsTracker;
