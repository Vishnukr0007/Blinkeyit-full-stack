import React from 'react'
import UserMenu from '../components/UserMenu'
import { IoClose } from 'react-icons/io5'

const UerMenuMobile = () => {
  return (
    <section className='h-full w-full py-1' >
        <button onClick={()=>window.history.back()} className='text-neutral-800 block w-fit ml-auto'>
            <IoClose size={25}/>

        </button>
        <div className='container mx-auto p-3 pb-3'>
        <UserMenu/>
        </div>
      
    </section>
  )
}

export default UerMenuMobile
