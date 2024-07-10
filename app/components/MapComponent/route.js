"use client"
import React, { useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import Pin from '../Pin/route.js';

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

    return (
        <div style={{ height: '100vh', margin: 0, padding: 0 }}>
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
                    <MapPin 
                        center={center}
                        locations={locations}
                        currentLocationIndex={currentLocationIndex}
                        onCenterChange={onCenterChange}
                    />
                </Map>
            </APIProvider>
        </div>
    );
});

MapComponent.displayName = 'MapComponent';

export default MapComponent;