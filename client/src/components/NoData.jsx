import NoDataImage from '../assets/nothing here yet.webp'

const NoData = () => {
  return (
    <div className=' flex flex-col items-center justify-center py-4 gap-2'>
      <img 
      src={NoDataImage} 
      alt=" no data"
      className='w-36' 
      />
      <p className=' text-neutral-400'> No Data</p>
    </div>
  )
}

export default NoData
