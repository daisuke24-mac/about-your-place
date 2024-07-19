import React, { useEffect } from 'react';
import { useMap, AdvancedMarker } from '@vis.gl/react-google-maps';

const Pin = ({ background, glyphColor, borderColor }) => {
    return (
        <div 
            style={{
                width: '30px',
                height: '30px',
                borderRadius: '50% 50% 50% 0',
                background: background,
                border: `2px solid ${borderColor}`,
                transform: 'rotate(-45deg)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                top: '-15px',
                left: '-15px'
            }}
        >
            <div
                style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: glyphColor,
                    transform: 'rotate(45deg)'
                }}
            />
        </div>
    );
};

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
            {/* Center point marker */}
            <AdvancedMarker position={center}>
                <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
            </AdvancedMarker>

            {/* Saved point markers */}
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

export default MapPin;