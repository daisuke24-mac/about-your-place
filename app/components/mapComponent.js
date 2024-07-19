"use client"
import React, { useCallback, useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
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
        return (
            <div>
                {selectedPlace && (
                    <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '20px',
                        backgroundColor: 'black',
                        padding: '10px',
                        borderRadius: '5px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                        zIndex: 1000
                    }}>
                        <h2>Selected Location</h2>
                        {selectedPlace.name && <p>Location: {selectedPlace.name}</p>}
                        {selectedPlace.address_components && <p>Area: {selectedPlace.address_components[selectedPlace.address_components.length-2].long_name}</p>}
                        {selectedPlace.geometry?.location && (
                            <>
                                <p>Lat: {selectedPlace.geometry.location.lat()}</p>
                                <p>Lng: {selectedPlace.geometry.location.lng()}</p>
                                <p>current Weather: {weather}℃</p>
                                <p>Description: {description}</p>
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

MapComponent.displayName = 'MapComponent';

export default MapComponent;