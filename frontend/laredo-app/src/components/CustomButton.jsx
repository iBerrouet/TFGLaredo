import React from 'react';

const CustomButton = ({ children, onClick, className }) => {
  return (
    <button className={`bg-gray-800 hover:bg-transparent hover:text-cyan-400 text-white text-lg font-bold py-2 px-8 border-2 rounded ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default CustomButton
