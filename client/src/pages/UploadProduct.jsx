import React, { useState } from 'react'
import { IoMdAdd, IoMdCloudUpload } from "react-icons/io";
import UploadImage from "../utils/UploadImage.js"
import Loading from "../components/Loading.jsx"
import ViewImage from '../components/ViewImage.jsx'
import { FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { IoClose } from 'react-icons/io5';
import AddfieldComponent from '../components/AddfieldComponent.jsx';
import Axios from '../utils/Axios.js';
import SummaryApi from '../common/SummaryApi.js';
import AxiosToastError from '../utils/AxiosToastError.js';
import successAlert from '../utils/SuccessAlert.js';
const UploadProduct = () => {
  const [data,setData]=useState({
    name:"",
    image:[],
    category:[],
    subcategory:[],
    unit:"",
    stock:"",
    price:"",
    discount:"",
    description:"",
    more_details:{}
    
});
 const [Imageloading,setImageLoding]=useState(false)
 const [viewImage,setViewImageUrl]=useState("")
 const allCategory=useSelector(state=>state.product.allcategory)
 const allSubCategory=useSelector(state=>state.product.allsubCategory)
 const [selectCategory,setSelectCategory]=useState("")
 const [selectSubcategory,setSelectSubCategory]=useState("")
 const [openAddField,setOpenAddField]=useState(false)
 const [fieldName,setFieldName]=useState("")
  const handleChange=(e)=>{
    const {name,value}=e.target
     setData((preve)=>{
      return{
        ...preve,
        [name]:value
      }
     })
  }

  const handleUploadImage=async(e)=>{
    const file=e.target.files[0]
    if(!file){
      return
    }
    setImageLoding(true)
   const response=await UploadImage(file) 
   const {data:ImageResponse}=response
   
   if(ImageResponse.success){
       const imageUrl=ImageResponse.data.url 
       setData((preve)=>{
        return{
          ...preve,
          image:[...preve.image,imageUrl]
        }
       })
   } else {
       // Assuming toast is imported or available via AxiosToastError, 
       // but AxiosToastError takes an error object. 
       // Let's check imports. toast is NOT imported in this file?
       // It imports AxiosToastError.
       // The original code didn't handle errors here.
       // I'll leave error handling simple for now to just stop the crash.
       console.error("Upload failed", ImageResponse);
   }
   
   setImageLoding(false)

  }
  const handleDeleteImage=async(index)=>{
    setData((preve)=>{
      return{
        ...preve,
        image: preve.image.filter((_, i) => i !== index)
      }
    })
  }

  const handleRemoveCategory=async(index)=>{
    setData((preve)=>{
      return{
        ...preve,
        category: preve.category.filter((_, i) => i !== index)
      }
    })
  }
  const handleRemoveSubCategory=async(index)=>{
    setData((preve)=>{
      return{
        ...preve,
        subcategory: preve.subcategory.filter((_, i) => i !== index)
      }
    })
  }
  const handleAddField=()=>{
    setData((preve)=>{
      return{
        ...preve,
        more_details :{
          ...preve.more_details,
          [fieldName] :""
        }
      }
    })
    setFieldName("")
    setOpenAddField(false)

  }

  const handleSubmit=async(e)=>{
    e.preventDefault()
   try {
    const response=await Axios({
        ...SummaryApi.createProduct,
        data:data
    })
    const {data:responseData}=response
    if(responseData.success){
      successAlert(responseData.message)
      setData({
        name:"",
        image:[],
        category:[],
        subcategory:[],
        unit:"",
        stock:"",
        price:"",
        discount:"",
        description:"",
        more_details:{}
      })
    }
    
   } catch (error) {
    AxiosToastError(error)
   }

  }


  return (
    <section>
      <div className='p-2 bg-white shadow-md flex items-center justify-between'>
        <h2 className='font-semibold'>Upload Product</h2>
      </div>
      <div className='grid p-3'>
        <form  className=' grid gap-3' onSubmit={handleSubmit}>
        {/* upload Product Name */}
          <div className='grid gap-2'>
            <label htmlFor="name" className='font-medium'>Name</label>
            <input
             id='name'
             type="text"
             placeholder='Enter the Name'
             name='name'
             value={data.name}
             onChange={handleChange}
             className="bg-blue-50 p-2 outline-none border focus:border-yellow-200 rounded"

             />
          </div>
           {/* upload Product Description field */}
          <div className='grid gap-2'>
            <label htmlFor="description" className='font-medium'>Description</label>
            <textarea
             id='description'
             type="text"
             placeholder='Enter Product Description'
             name='description'
             value={data.description}
             onChange={handleChange}
             required
             multiple
             rows={3}
             className="bg-blue-50 p-2 outline-none border focus:border-yellow-200 rounded resize-none "


             />
          </div>
            {/* upload Image field */}
         
          <div className=' grid gap-2'>
           <p  className='font-medium'>Image</p>
            <label htmlFor='productImage' className='bg-blue-50 h-24 border rounded flex justify-center  cursor-pointer '>
              <div className='text-center flex justify-center items-center flex-col'>
                {
                  Imageloading ?  <Loading/>:(
                    <>
                     <IoMdCloudUpload
                     color='black'
                     size={35} />

                    <p>Upload Image</p>
                    </>
                   
                  )

                }
              
              </div>
              <input type="file"
              id='productImage'
              className='hidden'
              accept='image/*'
              onChange={handleUploadImage}
               />
            </label>
            {/* Display upload Image */}
            <div className=' flex flex-wrap gap-4'>
              {
                data.image.map((img,index)=>{
                  return(
                    <div key={img + index} className="relative mt-1 h-20 w-20 bg-blue-50 border group">
                   <img
                   src={img}
                   alt={img}
                   className="w-full h-full object-scale-down cursor-pointer"
                   onClick={() => setViewImageUrl(img)}
                     />
  
              {/* Delete Icon - Only visible on hover */}
         <div
       className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 
       group-hover:opacity-100 transition duration-200 cursor-pointer"
       onClick={() => handleDeleteImage(index)}
          >
          <FaTrash size={10} />
          </div>
         </div>
                  )
                })
              }

            </div>
          </div>
          <div className=' grid gap-1'>
            <label htmlFor="category" className='font-medium'>Category</label>
            <div>
              <select name="category" id="category" className='bg-blue-50 border w-full p-2 rounded'
                value={selectCategory}
                onChange={(e)=>{
                  const value=e.target.value
                  const category=allCategory.find(el=>el._id===value)
                  
                  setData((preve)=>{
                   return{
                    ...preve,
                    category:[...preve.category,category]
                   }
                  })
                  setSelectCategory("")
                }}
              >
                <option value={""}>Select Category</option>
                {
                  allCategory.map((c,index)=>{
                    return(
                      <option key={index+"category"} value={c?._id}>{c.name}</option>
                    )
                  })
                }
              </select>
              <div className='flex flex-wrap gap-3'>
              {
                data.category.map((c,index)=>{
                  return(
                    <div key={c._id+index+"productSection"} className='text-sm flex items-center gap-1 shadow-md mt-3 p-1 '>
                      <p>{c.name}</p>
                      <div className='cursor-pointer' onClick={()=>handleRemoveCategory()}>
                        <IoClose size={20}/>
                      </div>
                    </div>
                  )
                })
              }

              </div>
             
            </div>
          </div>
          <div className=' grid gap-1'>
            <label htmlFor="subcategory" className='font-medium'> Sub Category</label>
            <div>
              <select  className='bg-blue-50 border w-full p-2 rounded'
                value={selectSubcategory}
                onChange={(e)=>{
                  const value=e.target.value
                  const subcategory=allSubCategory.find(el=>el._id===value)
                  
                  setData((preve)=>{
                   return{
                    ...preve,
                    subcategory:[...preve.subcategory,subcategory]
                   }
                  })
                  setSelectSubCategory("")
                }}
              >
                <option value={""}>Select SubCategory</option>
                {
                 allSubCategory.map((c,index)=>{
                    return(
                      <option key={c._id+index+"subcategory"} value={c?._id}>{c.name}</option>
                    )
                  })
                }
              </select>
              <div className='flex flex-wrap gap-3'>
              {
                data.subcategory.map((c,index)=>{
                  return(
                    <div key={c._id+index+"productsubsection"} className='text-sm flex items-center gap-1 shadow-md mt-3 p-1'>
                      <p>{c.name}</p>
                      <div className=' cursor-pointer' onClick={()=>handleRemoveSubCategory()}>
                        <IoClose size={20}/>
                      </div>
                    </div>
                  )
                })
              }

              </div>
             
            </div>
          </div>
          <div className='grid gap-2'>
            <label htmlFor="unit" className='font-medium'>Unit</label>
            <input
             id='unit'
             type="text"
             placeholder='Enter the unit'
             name='unit'
             value={data.unit}
             onChange={handleChange}
             className="bg-blue-50 p-2 outline-none border focus:border-yellow-200 rounded"

             />
          </div>
          <div className='grid gap-2'>
            <label htmlFor="stock" className='font-medium'> Number of Stock</label>
            <input
             id='stock'
             type="number"
             placeholder='Enter the Stock'
             name='stock'
             value={data.stock}
             onChange={handleChange}
             className="bg-blue-50 p-2 outline-none border focus:border-yellow-200 rounded"

             />
          </div>
          <div className='grid gap-2' >
            <label htmlFor="price" className='font-medium'> Price</label>
            <input
             id='price'
             type="number"
             placeholder='Enter the Price'
             name='price'
             value={data.price}
             onChange={handleChange}
             className="bg-blue-50 p-2 outline-none border focus:border-yellow-200 rounded"

             />
          </div>
          <div className='grid gap-2'>
            <label htmlFor="discount" className='font-medium'> Discount</label>
            <input
             id='discount'
             type="number"
             placeholder='Enter the Discount'
             name='discount'
             value={data.discount}
             onChange={handleChange}
             className="bg-blue-50 p-2 outline-none border focus:border-yellow-200 rounded"

             />
          </div>
          {/* Add More Field Name */}
          <div>
   {Object.keys(data?.more_details || {}).map((k, index) => (
    <div className='grid gap-2' key={k + index}>  
      <label htmlFor={k} className='font-medium'>{k}</label>
      <input
        id={k}
        type="text"
        value={data?.more_details[k]}
        onChange={(e) => {
          const value = e.target.value;
          setData((prev) => ({
            ...prev,
            more_details: {
              ...prev.more_details,
              [k]: value
            }
          }));
        }}
        className="bg-blue-50 p-2 outline-none border focus:border-yellow-200 rounded"
      />
    </div>
  ))}
</div>

          <div onClick={()=>setOpenAddField(true)} 
           className="hover:bg-yellow-400 hover:text-white font-semibold px-2 py-2 rounded-lg shadow-md 
             bg-white text-black cursor-pointer w-35 transition duration-200 flex items-center gap-2"
            >
            <IoMdAdd size={20} />
            <p>Add Fields</p>
           </div>
          <button className='bg-yellow-400 hover:bg-yellow-300 font-semibold py-2 rounded cursor-pointer'>
            Submit
          </button>
          
        </form>
      </div>
      {
            openAddField &&(
              <AddfieldComponent 
              value={fieldName}
              onChange={(e)=>setFieldName(e.target.value)}
              submit={handleAddField}
              close={()=>setOpenAddField(false)}/>
            )
           }
      {
        viewImage && (
          <ViewImage url={viewImage} close={()=>setViewImageUrl("")}/>
        )
      }
    </section>
  )
}

export default UploadProduct
