
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
    const handleLogout= async()=>{
        try {
            const response=await Axios({
               ...SummaryApi.logout 
            })
            if(response.data.success){
            dispatch(logout())
            localStorage.clear()
            toast.success(response.data.message)
            navigate("/")

            closeMenu()
            
            }
        } catch (error) {
            AxiosToastError(error)
            
        }
    }

    const handleClose=()=>{
      if(close){
          closeMenu()
            
      }
        
      
    }


  return (
    <div>
      <div className='font-bold text-gray-600 mt-4 '>My Account</div>
      <div className='text-sm mt-2 flex items-center gap-2'>
        <span className='max-w-52 text-ellipsis line-clamp-1'>{user.name || user.mobile} <span className='text-medium text-red-700'>{user.role==="ADMIN"?" (Admin)":""}</span></span> 
        <Link onClick={handleClose} to={"/dashboard/profile"} className='hover:text-yellow-300'>
        <FiExternalLink  size={15}/>
        </Link>
        </div>
      <Divider/>
      <div className='text-sm grid gap-3  '>
       {
        isAdmin(user.role)&& (
          <Link onClick={handleClose} to={"/dashboard/category"} className='hover:bg-gray-100   py-1'>Category</Link>

        )
       }

       {
        isAdmin(user.role)&& (
          <Link onClick={handleClose} to={"/dashboard/subcategory"} className='hover:bg-gray-100   py-1'>SubCategory</Link>

        )
       }
        {
        isAdmin(user.role)&& (
          
          <Link onClick={handleClose} to={"/dashboard/uploadproduct"} className='hover:bg-gray-100   py-1'>Upload Product</Link>
        )
       }

       {
        isAdmin(user.role)&& (
          <Link onClick={handleClose} to={"/dashboard/products"} className='hover:bg-gray-100  py-1'>Products</Link>
          
        )
       }
      
        <Link onClick={handleClose} to={"/dashboard/my-orders"} className='hover:bg-gray-100  py-1'>My Orders</Link>
        <Link onClick={handleClose} to={"/dashboard/address"} className='hover:bg-gray-100   py-1'>Save Address</Link>
        <Link onClick={handleClose} to={"/dashboard/e-gift-cards"} className='hover:bg-gray-100   py-1'>E-Gift Cards</Link>
        <Link onClick={handleClose} to={"/dashboard/faqs"} className='hover:bg-gray-100   py-1'>FAQs</Link>
        <Link onClick={handleClose} to={"/dashboard/accountprivacy"} className='hover:bg-gray-100   py-1'>Account Privacy</Link>
        <button onClick={handleLogout } className='text-left  cursor-pointer hover:bg-gray-100   py-1'> Log Out</button>
      </div>
    </div>
  )
}

export default UserMenu
