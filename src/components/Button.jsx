import React from 'react';

export const Button = ({ children, onClick, className = "" }) => {
  return (
    <button 
      onClick={onClick} 
      className={`w-full h-[55.72px] bg-[#228B22] text-white font-semibold rounded-[7.96px] 
      shadow-[0px_4px_10px_rgba(0,0,0,0.30)] active:scale-[0.98] transition-all flex items-center justify-center font-sans ${className}`}
    >
      {children}
    </button>
  );
};