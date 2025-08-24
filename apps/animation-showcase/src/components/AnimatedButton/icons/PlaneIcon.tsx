import React from 'react';

const PlaneIcon: React.FC<{ size?: number }> = ({ size = 20 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 19.56 9.93" 
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1.14,7.92c.05.19.25.67.33.86a5.81,5.81,0,0,0,.38.69l.43.51c4.31.21,3.45.16,3.76.16l9.9.46a5,5,0,0,0,2.6-.64c.89-.51,1.23-1,1.24-1.53s-.32-1-1.19-1.55A5.18,5.18,0,0,0,16,6.21H12.65L7.9,1A.51.51,0,0,0,7.43.69H5.2a.55.55,0,0,0-.54.69l2.86,4.8H4l-1.44-2A.57.57,0,0,0,2.13,4H.77a.56.56,0,0,0-.54.68Z" transform="translate(-0.22 -0.68)"/>
    </svg>
  );
};

export default PlaneIcon;