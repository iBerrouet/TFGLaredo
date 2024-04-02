import React from 'react';

const CustomButton = ({ children, onClick, className }) => {
  return (
    <button className={`bg-gray-900 hover:bg-transparent hover:text-cyan-400 text-white text-[16px] py-2 px-4 border-2 rounded ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default CustomButton
