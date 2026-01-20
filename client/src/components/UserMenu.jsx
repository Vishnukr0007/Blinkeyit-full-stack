
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Divider from './Divider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { logout } from '../store/userSlice'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { FiExternalLink } from "react-icons/fi";
import isAdmin from '../utils/isAdmin'
const UserMenu = ({closeMenu}) => {
    const user=useSelector((state)=>state.user)
     
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const handleLogout= async(e)=>{
        if(e && e.preventDefault) e.preventDefault();
        try {
            const response=await Axios({
               ...SummaryApi.logout 
            })
            if(response.data.success){
            dispatch(logout())
            localStorage.clear()
            toast.success(response.data.message)
            navigate("/")

            if(typeof closeMenu === 'function'){
               closeMenu()
            }
            
            }
        } catch (error) {
            AxiosToastError(error)
            
        }
    }

    const handleClose=()=>{
      if(typeof closeMenu === 'function'){
          closeMenu()
      }
    }


  return (
    <div>
      <div className='font-bold text-gray-600 mt-4 '>My Account</div>
      <div className='text-sm mt-2 flex items-center gap-2'>
        <span className='max-w-52 text-ellipsis line-clamp-1'>{user.name || user.mobile} <span className='text-medium text-red-700'>{user.role==="ADMIN"?" (Admin)":""}</span></span> 
        <Link onClick={handleClose} to={"/dashboard/profile"} className='hover:text-yellow-300 cursor-pointer'>
        <FiExternalLink  size={15}/>
        </Link>
        </div>
      <Divider/>
      <div className='text-sm grid gap-3  '>
       {
        isAdmin(user.role)&& (
          <Link onClick={handleClose} to={"/dashboard/category"} className='hover:bg-gray-100   py-1 cursor-pointer'>Category</Link>

        )
       }

       {
        isAdmin(user.role)&& (
          <Link onClick={handleClose} to={"/dashboard/subcategory"} className='hover:bg-gray-100   py-1 cursor-pointer'>SubCategory</Link>

        )
       }
        {
        isAdmin(user.role)&& (
          
          <Link onClick={handleClose} to={"/dashboard/uploadproduct"} className='hover:bg-gray-100   py-1 cursor-pointer'>Upload Product</Link>
        )
       }

       {
        isAdmin(user.role)&& (
          <Link onClick={handleClose} to={"/dashboard/products"} className='hover:bg-gray-100  py-1 cursor-pointer'>Products</Link>
          
        )
       }
       {
        isAdmin(user.role)&& (
          <Link onClick={handleClose} to={"/dashboard/manage-gift-cards"} className='hover:bg-gray-100  py-1 cursor-pointer'>Manage Gift Cards</Link>
          
        )
       }
        {
          isAdmin(user.role) && (
            <Link onClick={handleClose} to={"/dashboard/admin-orders"} className='hover:bg-gray-100 py-1 cursor-pointer'>All Orders</Link>
          )
        }
      
        <Link onClick={handleClose} to={"/dashboard/my-orders"} className='hover:bg-gray-100  py-1 cursor-pointer'>My Orders</Link>
        <Link onClick={handleClose} to={"/dashboard/address"} className='hover:bg-gray-100   py-1 cursor-pointer'>Save Address</Link>
        {
          !isAdmin(user.role) && (
            <Link onClick={handleClose} to={"/dashboard/e-gift-cards"} className='hover:bg-gray-100   py-1 cursor-pointer'>E-Gift Cards</Link>
          )
        }
        <Link onClick={handleClose} to={"/dashboard/faqs"} className='hover:bg-gray-100   py-1 cursor-pointer'>FAQs</Link>
        <Link onClick={handleClose} to={"/dashboard/accountprivacy"} className='hover:bg-gray-100   py-1 cursor-pointer'>Account Privacy</Link>
        <button onClick={handleLogout} className='text-left  cursor-pointer hover:bg-gray-100   py-1'> Log Out</button>
      </div>
    </div>
  )
}

export default UserMenu
