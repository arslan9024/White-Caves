/**
 * InteractiveMapDrawer.logic.ts — Hook & Logic Layer
 */

import { useState, useCallback } from 'react';
import { MAP_PINS, MapPin } from '../data/InteractiveMapDrawer.data';

export function useInteractiveMapDrawerLogic() {
  const [selectedProperty, setSelectedProperty] = useState<MapPin | null>(MAP_PINS[0]);

  const selectPin = useCallback((pin: MapPin) => {
    setSelectedProperty(pin);
  }, []);

  const closeDrawer = useCallback(() => {
    setSelectedProperty(null);
  }, []);

  return {
    pins: MAP_PINS,
    selectedProperty,
    selectPin,
    closeDrawer,
  };
}
