import React from 'react';

const CardLoading = () => {
  return (
    <div className='w-full min-h-[260px] md:min-h-[320px] p-4 border border-gray-100 flex flex-col gap-3 rounded-2xl animate-pulse bg-white shadow-sm'>
      
      {/* Image placeholder */}
      <div className='h-28 md:h-36 bg-gray-100 rounded-xl'></div>

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
