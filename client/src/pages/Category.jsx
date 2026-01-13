import  { useEffect, useState } from 'react'
import UploadCategoryModel from '../components/UploadCategoryModel'
import Loading from '../components/Loading'
import NoData from '../components/NoData'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { FaEdit, FaTrash } from "react-icons/fa"; 
import EditCategory from '../components/EditCategory'
import ConfirmBox from '../components/ConfirmBox'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'


const Category = () => {

  const [openUploadCategory,setOpenUploadCategory]=useState(false)
  const [loading,setLoading]=useState(false)
  const [categoryData,setCategoryData]=useState([])
  const [openEdit,setOpenEdit]=useState(false)
  const [editData,setEditData]=useState({
    name:"",
    image:""
  })
 const [openConfirmBoxDelete,setOpenConfirmBoxDelete]=useState(false) 
 const [deleteCategory,setDeleteCategory]=useState({
  _id:""
 })

//  const allCategory=useSelector(state=>state.product.allcategory)

//    useEffect(()=>{
//      setCategoryData(allCategory)
//    },[allCategory])

  const fetchCategory=async ()=>{
    try {
        setLoading(true)
        const response=await Axios({
          ...SummaryApi.getCategory,
          
        })
       const {data: responseData}=response
       setLoading(false)
       if(responseData.success){
         setCategoryData(responseData.data)
       }

        } catch (error) {

          setLoading(false)
         return error
       }
  }
  useEffect(()=>{
    fetchCategory()
},[])
    
 

   const handleDeleteCategory=async ()=>{
    try {
      const response= await Axios({
        ...SummaryApi.deleteCategory,
        data:deleteCategory
      })
      const {data:responseData}=response
      if(responseData.success){
        toast.success(responseData.message)
        setOpenConfirmBoxDelete(false)
        fetchCategory()
      }
    } catch (error) {
      
      AxiosToastError(error)
    }

   }
  return (
    <section>
        <div className='p-2   bg-white shadow-md flex items-center justify-between '>
            <h2 className='font-semibold'>Category</h2>
            <button onClick={()=>setOpenUploadCategory(true)} className='text-sm border border-yellow-200 
            hover:bg-yellow-200 px-3 py-1 rounded cursor-pointer'>Add Category</button>
        </div>
        {
          !categoryData[0] && !loading &&(
           <NoData/>
          )
        }

<div className='p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8'>
  {categoryData.map((category, index) => (
    <div key={index} className='w-40 h-52 rounded shadow-md flex flex-col items-center  bg-white p-2'>
      
      {/* Image Wrapper */}
      <div className="w-full h-40 flex items-center justify-center">
        <img
          alt={category.name}
          src={category.image}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Buttons Wrapper */}
      <div className="flex justify-center w-full mt-2 gap-4">
        <button onClick={()=>{
          setOpenEdit(true)
          setEditData(category)
        }    
        } className="text-green-500 hover:text-green-700 cursor-pointer">
          <FaEdit size={18} />
        </button>
        <button onClick={()=>{
          setOpenConfirmBoxDelete(true)
          setDeleteCategory(category)
        }}
         className="text-red-500 hover:text-red-700 cursor-pointer">
          <FaTrash size={18} />
        </button>
      </div>

    </div>
  ))}
</div>
         

         {
          loading && (
            <Loading/>
          )
         }

        {
          openUploadCategory && (
            <UploadCategoryModel  fetchData={fetchCategory}   close={()=>setOpenUploadCategory(false)}/>
          )
        }
        {
          openEdit && (
             <EditCategory data={editData} fetchData={fetchCategory}    close={()=>setOpenEdit(false)}/>
          )
        }
        {
          openConfirmBoxDelete &&(
            <ConfirmBox close={()=>setOpenConfirmBoxDelete(false)}  cancel={()=>setOpenConfirmBoxDelete(false) }
             confirm={()=>handleDeleteCategory()} />
          )

        }




    </section>
  )
}

export default Category
