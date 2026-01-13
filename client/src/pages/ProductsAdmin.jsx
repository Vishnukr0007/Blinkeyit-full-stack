import  { useEffect, useState } from 'react'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import Loading from '../components/Loading';
import ProductCardAdmin from '../components/ProductCardAdmin';
import { IoSearch } from "react-icons/io5";

const ProductsAdmin = () => {
  const [productData,setProductData]=useState([])
  const [page,setPage]=useState(1)
  const [loading,setLoading]=useState(false)
  const [totalPageCount,setTotalPageCount]=useState(1)
  const [search,setSearch]=useState("")

  const fetchProductData= async()=>{
    try {
      setLoading(true)
      const response=await Axios({
        ...SummaryApi.getProduct,
        data:{
          page:page,
          limit:12,
          search:search
        }

      })
      const {data:responseData}=response
      if(responseData.success){
        setTotalPageCount(responseData.totalNopage)
        setProductData(responseData.data)
      }

      
    } catch (error) {
      AxiosToastError(error)
      
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductData();
  }, [page]);

  const handleNext=()=>{
    if(page!==totalPageCount){
      setPage(preve=>preve+1)
    }
    
  }
  const handlePrevious=()=>{
    if(page>1){
      setPage(preve=>preve-1)
    }
    
  }

  const handleOnchange=(e)=>{
    const {value}=e.target
    setPage(1)
    setSearch(value)
  }

  
 useEffect(()=>{
  let flag=true
  const interval=setTimeout(()=>{
    if(flag){
      fetchProductData()
      flag=false
    }
  },300);

  return ()=>{
    clearTimeout(interval)
  }
 },[search])
  return (
    <section>
     <div className="p-2 bg-white shadow-md flex items-center justify-between gap-4">
        
         <h2 className="font-semibold">Products</h2>
         <div  className='h-full min-w-24 bg-gray-50 px-4 ml-auto  flex items-center gap-3 py-2  rounded border focus-within:border-yellow-200 ' >
          <IoSearch size={25}/>
          <input
           type="text" 
           placeholder='Search product here....'
           className='h-full  outline-none  '
           value={search}
           onChange={handleOnchange}
          />
         </div>
    </div>
      
       {
        loading && (
          <Loading/>
        )
      }
        <div className='p-2 bg-gray-50'>
        <div className='min-h-[55vh]'>
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 '>
        {
        productData.map((p, index) => {
        return (
          <ProductCardAdmin key={p.id || index} data={p} fetchProductData={fetchProductData} />
         );
       })
        }
     </div>

        </div>
     
      <div className='flex justify-between my-4'>
        <button onClick={ handlePrevious} className='border border-yellow-200 px-4 hover:bg-yellow-400 py-1 cursor-pointer '>Previous</button>
        <button className='w-full bg-slate-50'>{page}/{totalPageCount}</button>
        <button onClick={handleNext} className='border border-yellow-200 px-4 hover:bg-yellow-400 py-1 cursor-pointer '>Next</button>
      </div>
      </div>

     
    </section>
  )
}

export default ProductsAdmin
