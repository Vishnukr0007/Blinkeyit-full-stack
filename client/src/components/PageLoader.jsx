import React from "react";

const PageLoader = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-[50vh] w-full flex flex-col items-center justify-center p-8 bg-gray-50/50">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulsing ring */}
        <div className="w-16 h-16 rounded-full border-4 border-green-200 animate-ping absolute opacity-30" />
        
        {/* Spinning spinner */}
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-green-600 animate-spin" />
        
        {/* Center dot */}
        <div className="w-3 h-3 bg-green-600 rounded-full absolute" />
      </div>

      <p className="mt-4 text-xs font-semibold tracking-wider uppercase text-gray-500 animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default PageLoader;
