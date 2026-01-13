import React from 'react';

const CardLoading = () => {
  return (
    <div className='w-full sm:max-w-[180px] md:max-w-[220px] lg:min-w-44 h-[250px] md:h-[260px] lg:h-[280px] p-2 border grid md:gap-3 rounded animate-pulse bg-white shadow-sm'>
      
      {/* Image placeholder */}
      <div className='h-24 sm:h-28 bg-blue-50 rounded'></div>

      {/* Timer placeholder */}
      <div className='h-4 bg-blue-50 rounded w-20'></div>

      {/* Title placeholder */}
      <div className='h-4 bg-blue-50 rounded'></div>

      {/* Unit placeholder */}
      <div className='h-4 bg-blue-50 rounded w-14'></div>

      {/* Price & Button placeholders */}
      <div className='flex items-center justify-between gap-2 mt-auto'>
        <div className='h-4 bg-blue-50 rounded w-20'></div>
        <div className='h-4 bg-blue-50 rounded w-16'></div>
      </div>
    </div>
  );
};

export default CardLoading;
