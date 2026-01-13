
import { FaEdit, FaExclamationTriangle, FaTrash } from 'react-icons/fa'
import EditProductAdmin from './EditProductAdmin'
import { useState } from 'react'
import AxiosToastError from '../utils/AxiosToastError'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { IoClose } from 'react-icons/io5'
import Axios from '../utils/Axios'
import ConfirmBox from './ConfirmBox'


const ProductCardAdmin = ({ data ,fetchProductData }) => {

  const [editOpen,setEditOpen]=useState(false)
  const [openDelete,setOpenDelete]=useState(false);

 const handleDelete = async () => {
  try {
    const response = await Axios({
      ...SummaryApi.deleteProduct,
      data: {
        _id: data._id,
      },
    });

    const { data: responseData } = response;

    if (responseData.success) {
      toast.success(responseData.message);
      setOpenDelete(false);
      fetchProductData?.();
    }
  } catch (error) {
    AxiosToastError(error);
  }
};

  
  return (
   <section>
  <div className="w-36 h-[230px] p-4 bg-white rounded flex flex-col">

    {/* IMAGE */}
    <img
      src={data?.image[0]}
      alt={data?.name}
      className="w-full h-24 object-contain"
    />

    {/* PRODUCT INFO */}
    <div className="mt-2">
      <p className="text-sm font-medium line-clamp-2">
        {data?.name}
      </p>
      <p className="text-xs text-slate-400 mt-1">
        {data?.unit}
      </p>
    </div>

    {/* BUTTONS — ALWAYS BOTTOM */}
    <div className="flex justify-center gap-4 mt-auto pt-3 ">
      <button onClick={()=>setEditOpen(true)} className="text-green-500 hover:text-green-700 cursor-pointer">
        <FaEdit size={18} />
      </button>
      <button onClick={()=>setOpenDelete(true)} className="text-red-500 hover:text-red-700 cursor-pointer">
        <FaTrash size={18} />
      </button>
    </div>

    {
      editOpen &&(

        <EditProductAdmin data={data} close={()=>setEditOpen(false)} fetchProductData={fetchProductData}/>
      )
    }

    {
      openDelete && (
           
         <ConfirmBox close={()=>setOpenDelete(false)} cancel={()=>setOpenDelete(false)} confirm={handleDelete} />   
      )
    }

  </div>
</section>

  )
}

export default ProductCardAdmin
