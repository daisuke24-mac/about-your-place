import React from 'react';

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

export default Pin;