
import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const PropertyMap = ({ location }) => {
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    // Default to Dubai coordinates if geocoding fails
    const defaultCoords = { lat: 25.2048, lng: 55.2708 };
    
    if (location) {
      // Use browser's geocoding API
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: `${location}, Dubai, UAE` }, (results, status) => {
        if (status === 'OK' && results[0]) {
          setCoordinates({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          });
        } else {
          setCoordinates(defaultCoords);
        }
      });
    } else {
      setCoordinates(defaultCoords);
    }
  }, [location]);

  if (!coordinates) return <div>Loading map...</div>;

  return (
    <LoadScript googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '200px' }}
        center={coordinates}
        zoom={14}
      >
        <Marker position={coordinates} />
      </GoogleMap>
    </LoadScript>
  );
};

export default PropertyMap;
