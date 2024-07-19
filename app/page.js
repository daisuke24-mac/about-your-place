"use client"
import React, { useState, useCallback, useRef } from 'react';
import MapComponent from './components/mapComponent.js';

const HomePage = () => {
  const [center, setCenter] = useState({ lat: 35.6851, lng: 139.7527 }); // 東京
  const [locations, setLocations] = useState([]);
  const [currentLocationIndex, setCurrentLocationIndex] = useState(-1);
  const mapRef = useRef(null);
  const [buttonPressed, setButtonPressed] = useState(false);

  const addLocation = useCallback(() => {
    const newLocation = {
      key: `location_${locations.length}`,
      location: { ...center }
    };
    setLocations(prevLocations => [...prevLocations, newLocation]);
    if (locations.length === 0) {
      setCurrentLocationIndex(0);
    }
  }, [center, locations.length]);

  const moveToNextLocation = useCallback(() => {
    if (locations.length === 0) return;

    const nextIndex = !buttonPressed ? 0 : (currentLocationIndex + 1) % locations.length;
    setCurrentLocationIndex(nextIndex);
    setCenter(locations[nextIndex].location);
    if (!buttonPressed) {
      setButtonPressed(true);
    }
  }, [locations, currentLocationIndex, buttonPressed]);

  const handleCenterChange = useCallback((newCenter) => {
    setCenter(newCenter);
  }, []);

  return (
    <div>
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
        <button onClick={addLocation} style={{ margin: '5px' }}>
          Add Pin
        </button>
        <button onClick={moveToNextLocation} style={{ margin: '5px' }}>
          Move to Next
        </button>
        <div>
          Saved Point: {locations.length}
          {currentLocationIndex !== -1 && ` (Current: No.${currentLocationIndex + 1})`}
        </div>
        <div>
          Center: Lat {center.lat.toFixed(4)}, Lng {center.lng.toFixed(4)}
        </div>
      </div>
      <MapComponent
        ref={mapRef}
        center={center} 
        locations={locations} 
        onCenterChange={handleCenterChange}
        currentLocationIndex={currentLocationIndex}
      />
    </div>
  );
};

export default HomePage;