"use client"
import React, { useCallback, useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import {createRoot} from 'react-dom/client';
import { APIProvider, ControlPosition, Map } from '@vis.gl/react-google-maps';
import MapPin from './pin.js';
import { CustomMapControl } from '../pages/autoComplete/map-control.tsx';
import MapHandler from '../pages/autoComplete/map-handler.tsx';

const MapComponent = forwardRef(({ center, locations, currentLocationIndex, onCenterChange }, ref) => {
    const mapRef = useRef(null);

    const selectedPlaceRef = useRef(null);
    const apikey_weather =  process.env.NEXT_PUBLIC_YOUR_WEATHER_API_KEY;
    const [weather, setWeather] = useState(null);
    const [selectedAutocompleteMode, setSelectedAutocompleteMode] = useState({
        id: 'classic',
        label: 'Google Autocomplete Widget'
    });
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [description, setDescription] = useState("");
    const [isMinimized, setIsMinimized] = useState(false);

    const getWeather = async(place) => {
        await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${place.geometry.location.lat()}&lon=${place.geometry.location.lng()}&appid=${apikey_weather}&units=metric`)
        .then(response => response.json())
        .then(data => {
            const currentWeather = data.main.temp
            setWeather(currentWeather)
        })
        .catch(error => console.error('Error:', error))
    }

    const getItem = async (place) => {
        try {
            const response = await fetch('/api/CollectDescription', {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt_post: place }),
            });
            const data = await response.json()
            setDescription(data.description)
        } catch (error) {
            console.error('Error checking connection:', error)
            setError(error.message)
        }
    }

    useImperativeHandle(ref, () => ({
        panTo: (newCenter) => {
            if (mapRef.current) {
                mapRef.current.panTo(newCenter);
            }
        }
    }));

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.panTo(center);
        }
    }, [center]);

    const handleMapLoad = (map) => {
        mapRef.current = map;
    };

    const handlePlaceSelect = useCallback((place) => {
        // If the location is the same as the last selected location, skip the process
        if (selectedPlaceRef.current === place) return;

        selectedPlaceRef.current = place;

        setSelectedPlace(place);
        getWeather(place);
        getItem(place);
    }, []);


    const LandInformation = () => {

        const toggleMinimize = () => {
            setIsMinimized(!isMinimized);
        };

        return (
            <div>
                {selectedPlace && (
                    <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '20px',
                        width: isMinimized ? '40px' : 'calc(100% - 40px)',
                        maxWidth: '400px',
                        height: isMinimized ? '40px' : 'auto',
                        maxHeight: 'calc(100vh - 40px)',
                        backgroundColor: 'black',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '5px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                        zIndex: 1000,
                        overflow: 'auto',
                        transition: 'all 0.3s ease'
                    }}>
                        <button 
                            onClick={toggleMinimize}
                            style={{
                                position: 'absolute',
                                top: '5px',
                                right: '5px',
                                width: '30px',
                                height: '30px',
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                fontSize: '30px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '0',
                                margin: '0',
                                borderRadius: '5px', // ボタンの角を少し丸める
                            }}
                        >
                            {isMinimized ? '+' : '-'}
                        </button>
                        {!isMinimized && (
                            <>
                                <h2>Selected Location</h2>
                                {selectedPlace.name && <p>Location: {selectedPlace.name}</p>}
                                {selectedPlace.address_components && selectedPlace.address_components.length > 1 && (
                                    <p>Area: {selectedPlace.address_components[selectedPlace.address_components.length-2]?.long_name || 'Not available'}</p>
                                )}
                                {selectedPlace.geometry?.location && (
                                    <>
                                        <p>Lat: {selectedPlace.geometry.location.lat()}</p>
                                        <p>Lng: {selectedPlace.geometry.location.lng()}</p>
                                        <p>Current Weather: {weather}℃</p>
                                        <p>Description: {description}</p>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        )
    }


    return (
        <div style={{ height: '100vh', margin: 0, padding: 0 }}>
            <APIProvider apiKey={process.env.NEXT_PUBLIC_YOUR_API_KEY}>
                <Map
                    mapId='GOOGLE_MAP_ID'
                    // style={{ width: '100vw', height: '100vh' }}
                    center={center}
                    defaultZoom={5}
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                    onLoad={handleMapLoad}
                >
                    <MapPin 
                        center={center}
                        locations={locations}
                        currentLocationIndex={currentLocationIndex}
                        onCenterChange={onCenterChange}
                    />
                    <CustomMapControl
                        controlPosition={ControlPosition.TOP_CENTER}
                        selectedAutocompleteMode={selectedAutocompleteMode}
                        onPlaceSelect={(place) => {
                            handlePlaceSelect(place);
                        }}
                    />
                    <MapHandler place={selectedPlace} />
                </Map>
            </APIProvider>
            <LandInformation/>
        </div>
    );
});

export default function HomePage() {
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
  }

  
let root = null;

export function renderToDom(container) {
    if (!root) {
        root = createRoot(container);
    }
    root.render(<HomePage />);
}