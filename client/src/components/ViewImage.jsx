import React from 'react'
import { IoClose } from 'react-icons/io5'

const ViewImage = ({ url, close }) => {
  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 z-50 bg-neutral-800/60 flex justify-center items-center p-4'>
      <div className='w-full max-w-md max-h-[80vh] p-4 bg-white relative flex flex-col'>
        {/* Close button positioned to the right */}
        <button onClick={close} className="absolute top-2 right-2 cursor-pointer hover:bg-red-500 hover:text-white">
          <IoClose size={25} />
        </button>
        
        {/* Image container centered */}
        <div className="flex justify-center items-center h-full">
          <img
            src={url}
            alt='full screen'
            className='w-full h-full object-scale-down'
          />
        </div>
      </div>
    </div>
  )
}

export default ViewImage
