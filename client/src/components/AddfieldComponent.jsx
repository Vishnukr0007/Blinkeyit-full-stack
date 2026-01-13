import React from 'react'
import { IoClose } from 'react-icons/io5'

const AddfieldComponent = ({close,value,onChange,submit}) => {
  return (
    <section className=' fixed top-0 bottom-0 left-0 right-0 bg-neutral-900/70 z-50 flex justify-center items-center p-4'>
     <div className=' bg-white rounded p-4 w-full max-w-md'>
        <div className='flex items-center justify-between gap-3'>
            <h1 className=' font-semibold'>Add Fields</h1>
            <button onClick={close} className='cursor-pointer' >
                <IoClose size={25}/>
            </button>
        </div>
        <input 
        className='bg-blue-50 my-3 p-2 border outline-none focus-within:border-yellow-200 w-full rounded'
        type="text"
        placeholder='Enter your Field Name'
        value={value}
        onChange={onChange}
         
        />
        <button 
        onClick={submit}
        className='bg-yellow-400 px-4 py-2 rounded mx-auto w-fit block cursor-pointer hover:bg-yellow-300'>
            Add Feild
        </button>

     </div>
    </section>
  )
}

export default AddfieldComponent
