import { useEffect, useState } from 'react';

const PropertyMap = ({ location }) => {
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    const defaultCoords = { lat: 25.2048, lng: 55.2708 };
    
    const dubaiLocations = {
      'Palm Jumeirah': { lat: 25.1124, lng: 55.1390 },
      'Downtown Dubai': { lat: 25.1972, lng: 55.2744 },
      'Emirates Hills': { lat: 25.0657, lng: 55.1489 },
      'Dubai Marina': { lat: 25.0805, lng: 55.1403 },
      'Arabian Ranches': { lat: 25.0567, lng: 55.2617 },
      'JVC': { lat: 25.0552, lng: 55.2100 },
      'Business Bay': { lat: 25.1850, lng: 55.2642 },
      'JBR': { lat: 25.0784, lng: 55.1337 },
      'Dubai Hills Estate': { lat: 25.1200, lng: 55.2200 },
      'City Walk': { lat: 25.2048, lng: 55.2614 },
      'MBR City': { lat: 25.1700, lng: 55.3100 },
      'The Springs': { lat: 25.0484, lng: 55.1929 },
    };
    
    if (location && dubaiLocations[location]) {
      setCoordinates(dubaiLocations[location]);
    } else {
      setCoordinates(defaultCoords);
    }
  }, [location]);

  if (!coordinates) return <div className="map-loading">Loading map...</div>;

  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}&q=${coordinates.lat},${coordinates.lng}&zoom=14`;

  if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="map-placeholder" style={{
        width: '100%',
        height: '200px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '14px',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>📍</div>
          <div>{location || 'Dubai, UAE'}</div>
        </div>
      </div>
    );
  }

  return (
    <iframe
      title={`Map of ${location}`}
      src={mapUrl}
      style={{ width: '100%', height: '200px', border: 0, borderRadius: '8px' }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
};

export default PropertyMap;
