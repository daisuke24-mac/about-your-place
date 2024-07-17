"use client"
// import React, { useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
// import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import Pin from '../Pin/route.js';
// 追加↓
import React, { useCallback, useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { APIProvider, ControlPosition, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { CustomMapControl } from '../../pages/autoComplete/map-control.tsx';
import MapHandler from '../../pages/autoComplete/map-handler.tsx';
// 追加↑
const MapPin = ({ center, locations, currentLocationIndex, onCenterChange }) => {
    const map = useMap();

    useEffect(() => {
        if (map) {
            const listener = map.addListener('center_changed', () => {
                const newCenter = map.getCenter();
                onCenterChange({ lat: newCenter.lat(), lng: newCenter.lng() });
            });

            return () => {
                google.maps.event.removeListener(listener);
            };
        }
    }, [map, onCenterChange]);

    return (
        <>
            {/* 中心点のマーカー */}
            <AdvancedMarker position={center}>
                <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
            </AdvancedMarker>

            {/* 保存された位置のマーカー */}
            {locations.map((location, index) => (
                <AdvancedMarker key={location.key} position={location.location}>
                    <Pin 
                        background={index === currentLocationIndex ? '#4285F4' : '#EA4335'}
                        glyphColor={'#FFF'}
                        borderColor={'#000'}
                    />
                </AdvancedMarker>
            ))}
        </>
    );
};

const MapComponent = forwardRef(({ center, locations, currentLocationIndex, onCenterChange }, ref) => {
    const mapRef = useRef(null);

    // 追加↓
    const selectedPlaceRef = useRef(null);
    const apikey_weather =  process.env.NEXT_PUBLIC_YOUR_WEATHER_API_KEY;
    const [weather, setWeather] = useState(null);
    const [selectedAutocompleteMode, setSelectedAutocompleteMode] = useState({
        id: 'classic',
        label: 'Google Autocomplete Widget'
    });
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [description, setDescription] = useState("");
    // 追加↑
    
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
        // 前回選択された場所と同じ場合は処理をスキップ
        if (selectedPlaceRef.current === place) return;

        selectedPlaceRef.current = place;

        setSelectedPlace(place);
        getWeather(place);
        itemCheck(place);
    }, []);

    const getWeather = async(place) => {
        // console.log("place:",place.address_components[place.address_components.length-3].long_name)
        // console.log("postcode:",place)
        await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${place.geometry.location.lat()}&lon=${place.geometry.location.lng()}&appid=${apikey_weather}&units=metric`)
        .then(response => response.json())
        .then(data => {
            // const currentWeather = data.weather[0].main
            const currentWeather = data.main.temp
            setWeather(currentWeather)
        })
        .catch(error => console.error('Error:', error))
    }

    const itemCheck = async (place) => {
        // console.log('itemCheck')
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
                    {/* 追加↓ */}
                    <CustomMapControl
                        controlPosition={ControlPosition.TOP_CENTER}
                        selectedAutocompleteMode={selectedAutocompleteMode}
                        onPlaceSelect={(place) => {
                            handlePlaceSelect(place);
                        }}
                    />
                    <MapHandler place={selectedPlace} />
                    {/* 追加↑ */}
                </Map>
            </APIProvider>
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
                    <h3>選択された場所:</h3>
                    {selectedPlace.name && <p>場所: {selectedPlace.name}</p>}
                    {selectedPlace.address_components && <p>地域: {selectedPlace.address_components[selectedPlace.address_components.length-2].long_name}</p>}
                    {selectedPlace.geometry?.location && (
                        <>
                            <p>緯度: {selectedPlace.geometry.location.lat()}</p>
                            <p>経度: {selectedPlace.geometry.location.lng()}</p>
                            <p>天気: {weather}℃</p>
                            <p>特徴: {description}</p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
});

MapComponent.displayName = 'MapComponent';

export default MapComponent;