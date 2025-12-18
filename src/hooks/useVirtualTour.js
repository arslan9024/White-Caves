import { useState, useCallback } from 'react';

export const useVirtualTour = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentProperty, setCurrentProperty] = useState(null);
  const [tourImages, setTourImages] = useState([]);

  const openTour = useCallback((property) => {
    const images = property?.virtualTourImages || property?.images || [];
    
    const formattedImages = images.map((img, index) => {
      if (typeof img === 'string') {
        return {
          url: img,
          thumbnail: img,
          name: `Room ${index + 1}`,
          hotspots: []
        };
      }
      return {
        url: img.url || img.src,
        thumbnail: img.thumbnail || img.url || img.src,
        name: img.name || img.label || `Room ${index + 1}`,
        hotspots: img.hotspots || []
      };
    });

    setTourImages(formattedImages);
    setCurrentProperty(property);
    setIsOpen(true);
  }, []);

  const closeTour = useCallback(() => {
    setIsOpen(false);
    setCurrentProperty(null);
    setTourImages([]);
  }, []);

  const hasTour = useCallback((property) => {
    const images = property?.virtualTourImages || property?.images || [];
    return images.length > 0;
  }, []);

  return {
    isOpen,
    currentProperty,
    tourImages,
    openTour,
    closeTour,
    hasTour
  };
};

export const generateDemoTourImages = (propertyType = 'apartment') => {
  const roomSets = {
    apartment: [
      { name: 'Living Room', hotspots: [{ x: 30, y: 50, label: 'Kitchen', targetRoom: 1 }] },
      { name: 'Kitchen', hotspots: [{ x: 70, y: 50, label: 'Living Room', targetRoom: 0 }, { x: 50, y: 30, label: 'Master Bedroom', targetRoom: 2 }] },
      { name: 'Master Bedroom', hotspots: [{ x: 40, y: 60, label: 'Bathroom', targetRoom: 3 }] },
      { name: 'Master Bathroom', hotspots: [] },
      { name: 'Balcony', hotspots: [{ x: 50, y: 50, label: 'City View', type: 'info' }] }
    ],
    villa: [
      { name: 'Entrance Hall', hotspots: [{ x: 50, y: 40, label: 'Grand Living', targetRoom: 1 }] },
      { name: 'Grand Living Room', hotspots: [{ x: 20, y: 50, label: 'Dining Area', targetRoom: 2 }] },
      { name: 'Dining Room', hotspots: [{ x: 80, y: 50, label: 'Kitchen', targetRoom: 3 }] },
      { name: 'Gourmet Kitchen', hotspots: [] },
      { name: 'Master Suite', hotspots: [{ x: 60, y: 40, label: 'Walk-in Closet', type: 'info' }] },
      { name: 'Pool & Garden', hotspots: [{ x: 50, y: 60, label: 'Infinity Pool', type: 'info' }] }
    ],
    penthouse: [
      { name: 'Private Elevator Lobby', hotspots: [{ x: 50, y: 50, label: 'Enter Penthouse', targetRoom: 1 }] },
      { name: 'Sky Living Room', hotspots: [{ x: 30, y: 40, label: '360° Views', type: 'info' }] },
      { name: 'Rooftop Terrace', hotspots: [{ x: 70, y: 60, label: 'Private Pool', targetRoom: 3 }] },
      { name: 'Rooftop Pool', hotspots: [] },
      { name: 'Master Wing', hotspots: [] }
    ]
  };

  const rooms = roomSets[propertyType] || roomSets.apartment;
  
  return rooms.map((room, index) => ({
    url: `https://images.unsplash.com/photo-${1600585154340 + index * 1000}-be6161a56a0c?w=1920&h=1080&fit=crop`,
    thumbnail: `https://images.unsplash.com/photo-${1600585154340 + index * 1000}-be6161a56a0c?w=160&h=100&fit=crop`,
    name: room.name,
    hotspots: room.hotspots
  }));
};

export default useVirtualTour;
