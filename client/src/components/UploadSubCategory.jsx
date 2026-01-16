import React, { useState } from 'react'
import {IoClose} from "react-icons/io5"
import uploadImage from '../utils/UploadImage'
import {useSelector} from 'react-redux'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
const UploadSubCategory = ({close,fetchData}) => {
  const [subCategoryData,setSubCategoryData]=useState({
    name:"",
    image:"",
    category:[]
  })
  const [loading,setLoading]=useState(false)
    const allCategory=useSelector(state=>state.product.allcategory)
   
     const handlechange=(e)=>{
    const {name,value}=e.target

    setSubCategoryData((preve)=>{
      return{
        ...preve,
        [name]:value
      }

      
    })
     }
     const handleUploadSubcategoryImage= async(e)=>{
   const file=e.target.files[0]
   if(!file){
    return
   }

   try {
    setLoading(true)
    const response = await uploadImage(file);
    const { data: ImageResponse } = response;
    setLoading(false)
    
    if(ImageResponse.success){
        setSubCategoryData((prev) => ({
            ...prev,
            image: ImageResponse.data.url
        }));
    }
   } catch (error) {
    console.error("Image upload failed", error);
  }
     } 

     const handleRemoveCategorySelected=(categoryId)=>{
         setSubCategoryData((preve)=>{
          return {
            ...preve,
            category: preve.category.filter(el => el._id !== categoryId)
          }
         })
     }
     const handleSubmitSubCategoryData=async (e)=>{
      e.preventDefault()
      try {
      const response=await Axios({
        ...SummaryApi.createSubCategory,
        data:subCategoryData
      })

      const {data:responseData}=response
      console.log("responseData",responseData)
      if(responseData.success){
        toast.success(responseData.message)
        if(close){
          close()
          fetchData()
        }
      }
        
      } catch (error) {
        AxiosToastError(error)
        
      }
     }
  
  return (
    <section className='fixed top-0 bottom-0 right-0 left-0 z-50 bg-neutral-800/60 justify-center items-center flex '>
      <div className='w-full max-w-5xl bg-white p-4 rounded'>
        <div className=' flex justify-between gap-3 items-center'>
        <h1 className='font-semibold text-neutral-800'>Add SubCategory</h1> 
        <button 
         onClick={close} 
         className=' hover:cursor-pointer' >
          <IoClose
          
          size={22}/>
        </button>
        </div>
        <div >
        <form  className=' my-3 grid gap-3' onSubmit={handleSubmitSubCategoryData}>
            <div className='grid gap-1'>
            <label htmlFor="name">  Name</label>
            <input
             className='p-4 bg-blue-50 border border-blue-100 outline-none 
             focus-within:border-yellow-200 rounded'
             type="text"
             id='name'
             name='name'
             value={subCategoryData.name}
             onChange={handlechange}
             />

            </div>
            <div className='grid gap-1'>
              <p>Image</p>
              <div className='flex flex-col lg:flex-row items-center gap-3'>
                <div className='  border border-blue-50 h-36 w-full lg:w-36 bg-blue-50 flex items-center justify-center'>
                  {
                  !subCategoryData.image?(
                     <p className='text-sm text-neutral-300'>No Image</p>
                  ):(
                    <img 
                    alt='subcategory' 
                    src={subCategoryData.image} 
                    className='w-full h-full object-scale-down' 
                />
                  )

                   }
                </div>
                <label htmlFor="uploadSubcategoryImage">
                <div className='px-4 py-1 border border-yellow-200
                 text-neutral-800 hover:bg-yellow-400 rounded cursor-pointer'>
                   {loading ? "Loading..." : "Upload Image"}
                  </div>
                </label>
                <input 
                   type="file"
                   id='uploadSubcategoryImage'
                   className='hidden'
                   onChange={handleUploadSubcategoryImage}
                 />
               </div>
              </div>
              <div className='grid gap-1'>
                <label htmlFor="" className='text-neutral-800'>Select category</label>
                <div className=' border border-yellow-200 focus-within:border-yellow-200 rounded'>
                <div className=' flex flex-wrap gap-2'>
                {
                  subCategoryData.category.map((cat,index)=>{
                    return(
                      <p key={cat._id+"selectedValue"} className='bg-white shadow-md px-1 m-1 flex items-center gap-2'>{cat.name}
                      <div className=' cursor-pointer hover:text-red-600'
                       onClick={()=>handleRemoveCategorySelected(cat._id)}
                      
                      >
                        <IoClose size={22}/>
                      </div>
                      </p>
                    )
                  })
                 }



                </div>
                <select 
                name="" 
                id=""
                className='w-full p-2 bg-transparent rounded outline-none border '
                onChange={(e)=>{
                  const value=e.target.value
                  const categoryDetails=allCategory.find(el=>el._id==value)
                   setSubCategoryData((preve)=>{
                    return {
                      ...preve,
                      category:[...preve.category,categoryDetails]
                    }
                   })
                }}
                
                >
                  <option value={""}>Select Category</option>
                   {
                    allCategory.map((category,index)=>{
                      return(
                        <option value={category?._id} key={category._id+"subcategory"}>{category?.name}</option>
                      )
                    })
                   }
                </select>
              
              </div>
              </div>
              <button className={` px-4 py-1 border ${subCategoryData?.name && subCategoryData?.image && subCategoryData?.category[0] ?
                 "bg-yellow-400 hover:bg-yellow-300" :" bg-gray-200"}  py-2 rounded font-semibold text-neutral-800 cursor-pointer border-none  `}>
                Submit
              </button>
        </form>
        </div>
      
      </div>

    </section>
  )
}

export default UploadSubCategory
