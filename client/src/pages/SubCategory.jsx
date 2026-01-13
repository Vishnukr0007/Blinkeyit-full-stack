import React, { useEffect, useState } from 'react';
import UploadSubCategory from '../components/UploadSubCategory';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import DisplayTable from '../components/DisplayTable';
import {createColumnHelper} from '@tanstack/react-table'
import ViewImage from '../components/ViewImage';
import { FaEdit, FaTrash } from "react-icons/fa"; 
import EditSubCategory from '../components/EditSubCategory';
import ConfirmBox from '../components/ConfirmBox';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';
const SubCategory = () => {
  const [openSubCategoryModel,setOpenSubCategoryModel]=useState(false)
  const [data,seData]=useState([])
  const [loading,setLoading]=useState(false)
  const columnHelper = createColumnHelper()
  const [ImageUrl,setImageUrl]=useState("")
  const [openEdit,setOpenEdit]=useState(false)
  const [editData,setEditData]=useState({
    _id:""
  })
  const [deleteSubcategory,setDeleteSubCategory]=useState({
    _id:""
  })
  const [openDeleteConfirmBox,setOpenDeleteConfirmBox]=useState(false)

  const fetchSubCategory=async()=>{
      setLoading(true)
    try {
      const response=await Axios({
        ...SummaryApi.getSubcategory,

      })
      const{data: responseData}=response
      if(responseData.success){
        seData(responseData.data)
      }
      
    } catch (error) {
      AxiosToastError(error)
      
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchSubCategory()
  },[])

  const column=[
    columnHelper.accessor("name",{
      header:"Name"
    }),
    columnHelper.accessor("image",{
      header:"Image",
      cell:({row})=>{
        return <div className='flex justify-center items-center '>
           <img
               src={row.original.image}
               alt={row.original.name}
               className='w-10 h-10 cursor-pointer'
               onClick={()=>{
                setImageUrl(row.original.image)
               }}
             />

        </div>
      }
    }),
    columnHelper.accessor("category",{
      header:"Category",
      cell:(({row})=>{
        return(
          <>
          {
            row.original.category.map((c,index)=>{
              return(
                <p key={c._id+"table"} className='shadow-md px-1 inline-block'>{c.name}</p>
              )
            })
          }
          
          </>
        )
      })
    }),
    columnHelper.accessor("_id", {
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className="flex gap-3 items-center justify-center">
            {/* View Button */}
            <button onClick={()=>{
              setOpenEdit(true)
              setEditData(row.original)
            }
              
            }
            className=" text-green-500 hover:text-green-700 cursor-pointer">
              <FaEdit size={18} />
            </button>
    
            {/* Delete Button */}
            <button onClick={()=>{
              setOpenDeleteConfirmBox(true)
              setDeleteSubCategory(row.original)
            }} 
            
            className=" text-red-500 hover:text-red-700 cursor-pointer">
              <FaTrash size={18} />
            </button>
          </div>
        );
      },
    })

  ]
  const handleDeleteSubCategory= async()=>{
    try {
      const response=await Axios({
        ...SummaryApi.deleteSubCategory,
        data:deleteSubcategory
       })
       const {data : responseData}=response
       if(responseData.success){
        toast.success(responseData.message)
        fetchSubCategory()
        setOpenDeleteConfirmBox(false)
        setDeleteSubCategory({_id:""})
       }
      
    } catch (error) {
      AxiosToastError(error)
    }

  }

  return (
    <section>
      <div className="p-2 bg-white shadow-md flex items-center justify-between">
        <h2 className="font-semibold">SubCategory</h2>
        <button onClick={()=>setOpenSubCategoryModel(true)} 
        className="text-sm border border-yellow-200 hover:bg-yellow-200 px-3 
        py-1 rounded cursor-pointer">
          Add SubCategory
        </button>
      </div>
       <div className=' overflow-auto w-full '>
        <DisplayTable
          data={data}
          column={column}
        />

       </div>

      {
        openSubCategoryModel && (
          <UploadSubCategory 
          close={()=>setOpenSubCategoryModel(false)}
          fetchData={fetchSubCategory}
          />
        )
      }

      {
        ImageUrl&&
        <ViewImage 
        url={ImageUrl} 
        close={()=>setImageUrl("")}/>
      }
      {
        openEdit &&
        <EditSubCategory 
        data={editData} 
        close={()=>setOpenEdit(false)}
        fetchData={fetchSubCategory}
        />
      }
      {
        openDeleteConfirmBox&&(
          <ConfirmBox 
           cancel={()=>setOpenDeleteConfirmBox(false)}
           close={()=>setOpenDeleteConfirmBox(false)}
           confirm={handleDeleteSubCategory}
          />
        )

      }
      {
        loading&&(
          <Loading/>
        )
      }
 

    </section>
  );
};

export default SubCategory;
