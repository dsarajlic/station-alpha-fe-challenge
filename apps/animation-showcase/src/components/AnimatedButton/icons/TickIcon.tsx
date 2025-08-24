import React from 'react';
import { FaCheck } from "react-icons/fa6";

const TickIcon: React.FC<{ size?: number }> = ({ size }) => {
  return (
    <>
      <FaCheck size={size} />
    </>
  );
};

export default TickIcon; 