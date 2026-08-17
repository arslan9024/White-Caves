import { useCallback } from 'react';

/**
 * useHaptics
 * Standardizes navigator.vibrate across the app to provide tactile feedback
 * Gracefully ignores on unsupported devices (e.g., Desktop Safari/iOS without flags)
 */
export const useHaptics = () => {
  const vibrate = useCallback((pattern: number | number[]) => {
    if (typeof window !== 'undefined' && navigator && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Ignore errors on devices that restrict vibration without explicit user interaction
      }
    }
  }, []);

  return {
    light: () => vibrate(10), // Subtle tap
    medium: () => vibrate(30), // Standard tap
    heavy: () => vibrate(50), // Emphasized tap
    success: () => vibrate([20, 50, 20]), // Double pulse
    error: () => vibrate([50, 100, 50, 100, 50]), // Stutter pulse
  };
};

export default useHaptics;
