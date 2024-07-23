"use client"
import React, { useCallback, useState, useEffect, useRef } from 'react';
import {createRoot} from 'react-dom/client';
import { APIProvider, ControlPosition, Map } from '@vis.gl/react-google-maps';
import MapPin from './pin.js';
import { CustomMapControl } from '../pages/autoComplete/map-control.tsx';
import MapHandler from '../pages/autoComplete/map-handler.tsx';

export default function MapComponent() {
    const mapRef = useRef(null);
    const selectedPlaceRef = useRef(null);
    const apikey_weather =  process.env.NEXT_PUBLIC_YOUR_WEATHER_API_KEY;
    const [center, setCenter] = useState({ lat: 35.6851, lng: 139.7527 }); // Tokyo
    const [locations, setLocations] = useState([]);
    const [currentLocationIndex, setCurrentLocationIndex] = useState(-1);
    const [buttonPressed, setButtonPressed] = useState(false);
    const [weather, setWeather] = useState(null);
    const [selectedAutocompleteMode, setSelectedAutocompleteMode] = useState({
        id: 'classic',
        label: 'Google Autocomplete Widget'
    });
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [description, setDescription] = useState("");
    const [isMinimized, setIsMinimized] = useState(false);
    const [changeOption, setChangeOption] = useState(true);

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
 
    const ChangeOption = () => {
        setChangeOption(!changeOption);
      };
  
    const handleCenterChange = useCallback((newCenter) => {
      setCenter(newCenter);
    }, []);
    
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
                    <div className='landInf'
                        style={{
                            width: isMinimized ? '30px' : 'calc(100% - 40px)',
                            height: isMinimized ? '30px' : 'auto',
                        }}>
                        <button 
                            onClick={toggleMinimize}
                            className={`landInfButton ${isMinimized ? 'landInfButton_p' : 'landInfButton_m'}`}
                        >
                            {isMinimized ? '+' : '-'}
                        </button>
                        {!isMinimized && (
                            <>
                                <h2>Selected Location</h2>
                                    {selectedPlace.name && <div className='landInfText'>Location: {selectedPlace.name}</div>}
                                    {selectedPlace.address_components && selectedPlace.address_components.length > 1 && (
                                        <div className='landInfText'>Area: {selectedPlace.address_components[selectedPlace.address_components.length-2]?.long_name || 'Not available'}</div>
                                    )}
                                    {selectedPlace.geometry?.location && (
                                        <>
                                            <div className='landInfText'>Lat: {selectedPlace.geometry.location.lat()}</div>
                                            <div className='landInfText'>Lng: {selectedPlace.geometry.location.lng()}</div>
                                            <div className='landInfText'>Current Weather: {weather}℃</div>
                                            <div className='landInfText'>Description: {description}</div>
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
        <div className='container'>
            <button onClick={ChangeOption} className='changeOption'>
                {changeOption ? 'My Pin' : 'Search Window'}
            </button>
            <div className='showPosition'>
                <div className='text_top'>
                    Lat {center.lat.toFixed(4)}
                </div>
                <div className='text_top'>
                    Lng {center.lng.toFixed(4)}
                </div>
            </div>
            {!changeOption && (
                <div className='control-panel'>
                    <div className='buttonPlace'>
                        <button onClick={addLocation} className='buttonCtrl'>
                            <img src="/add.png" alt="Add Pin" className='button_icon'/>
                            <span className='button_text'>Add Pin</span>
                        </button>
                        <button onClick={moveToNextLocation} className='buttonCtrl'>
                            <img src="/move.png" alt="Add Pin" className='button_icon'/>
                            <span className='button_text'>Move to Next</span>
                        </button>
                    </div>
                    <div className='text_top'>
                        Saved Point: {locations.length}
                    </div>
                    <div className='text_top'>
                        {buttonPressed !== false && currentLocationIndex !== -1 && ` Current: No.${currentLocationIndex + 1} `}
                    </div>
                </div>
            )}
            <APIProvider apiKey={process.env.NEXT_PUBLIC_YOUR_API_KEY}>
                <Map
                    mapId='GOOGLE_MAP_ID'
                    style={{ width: '100vw', height: '100vh' }}
                    center={center}
                    defaultZoom={5}
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                    onLoad={handleMapLoad}
                >   
                    {changeOption && (
                        <CustomMapControl
                            controlPosition={ControlPosition.TOP}
                            selectedAutocompleteMode={selectedAutocompleteMode}
                            onPlaceSelect={(place) => {
                                handlePlaceSelect(place);
                            }}
                        />
                    )}    
                    <MapPin 
                        center={center}
                        locations={locations}
                        currentLocationIndex={currentLocationIndex}
                        onCenterChange={handleCenterChange}
                    />
                    <MapHandler place={selectedPlace} />
                </Map>
            </APIProvider>
            <LandInformation/>
        </div>
    );
};
  
let root = null;

export function renderToDom(container) {
    if (!root) {
        root = createRoot(container);
    }
    root.render(<MapComponent />);
}