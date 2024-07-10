"use client"
import React, { useState, useCallback, useRef } from 'react';
import MapComponent from './components/MapComponent/route.js';

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
          現在の中心を追加
        </button>
        <button onClick={moveToNextLocation} style={{ margin: '5px' }}>
          次の位置へ移動
        </button>
        <div>
          保存された位置: {locations.length}
          {currentLocationIndex !== -1 && ` (現在: ${currentLocationIndex + 1}番目)`}
        </div>
        <div>
          中心点: 緯度 {center.lat.toFixed(4)}, 経度 {center.lng.toFixed(4)}
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