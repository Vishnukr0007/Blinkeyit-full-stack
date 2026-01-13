import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaCircleUser } from "react-icons/fa6";
import {  FaEdit } from "react-icons/fa";
import UserProfileAvatarEdit from '../components/UserProfileAvatarEdit';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import { setUserDetails } from '../store/userSlice';
import fetchUserDetails from '../utils/fetchUserDetails';
const Profile = () => {
    const user= useSelector(state=>state.user)
    const [openProfileAvatarEdit,setProfileAvatarEdit]=useState(false)
    const [userData,setUserData]=useState({
           name:user.name,
           email:user.email,
           mobile:user.mobile,

       })

    const[loading,setLoading]=useState(false)
    const dispatch=useDispatch()

       
       useEffect(()=>{
        setUserData({
          name:user.name,
           email:user.email,
           mobile:user.mobile,

        })

       },[user])
       
    const handleOnChange=(e)=>{
      const{name,value}=e.target  
      setUserData((preve)=>{
        return {
          ...preve,
          [name]:value
        }
      })
    }

    const handleSubmit=async(e)=>{
      e.preventDefault()
      try {
        setLoading(true)
        const response= await Axios({

        ...SummaryApi.updateUserDetails,
          data : userData
        })
      const {data: responseData}=response

      if(responseData.success){
        toast.success(responseData.message)
        const userData=await fetchUserDetails()
        dispatch(setUserDetails(userData.data))
      }
      

      } catch (error) {
        AxiosToastError(error)
        
      }finally{
        setLoading(false)
      }



    }
  return (
    <div>
      {/* Profile upload and Display image */}
      <div className='w-20 h-20  felx items-center justify-center
         rounded-full overflow-hidden drop-shadow-sm ml-5 mt-5'>
          {
            user.avatar?(
             <img src={user.avatar} 
                  alt={user.name} 
                  
                  />
                
            ):(
           <FaCircleUser size={20}/>
            )
          }

      </div>
      <button onClick={()=>setProfileAvatarEdit(true)}
        className="flex items-center gap-2  text-black
        px-4 py-2 mt-3 ml-5 rounded-lg shadow-md cursor-pointer 
        transition duration-300"
      >
        <FaEdit size={16} />
        Edit
      </button>
      {
        openProfileAvatarEdit&&(
          <UserProfileAvatarEdit close={()=>setProfileAvatarEdit(false)}/>
        )
      }
      {/* name,mobile,email,change password */}
      <form onSubmit={handleSubmit}  className='my-4 grid gap-4'>
        <div className='grid'>
          <label htmlFor="name">Name</label>
          <input 
              type="text"
              id='name'
              placeholder='Enter your name'
              className='p-2 bg-blue-50 outline-none border border-yellow-100  
              focus-within:border-yellow-300 rounded'
              value={userData.name}
              name='name'
              onChange={handleOnChange}
              required
          
          />
        </div>
        <div className='grid'>
          <label htmlFor="email">Email</label>
          <input 
              type="email"
              id='email'
              placeholder='Enter your email'
              className='p-2 bg-blue-50 outline-none border border-yellow-100  
              focus-within:border-yellow-300 rounded'
              value={userData.email}
              name='email'
              onChange={handleOnChange}
              required
          
          />
        </div>
        <div className='grid'>
          <label htmlFor="mobile">Mobile</label>
          <input 
              type="text"
              id='mobile'
              placeholder='Enter your mobile'
              className='p-2 bg-blue-50 outline-none border border-yellow-100  
              focus-within:border-yellow-300 rounded'
              value={userData.mobile}
              name='mobile'
              onChange={handleOnChange}
              required
          
          />
        </div>
        <button className='border px-4 py-2 font-semibold hover:bg-yellow-300 cursor-pointer
         border-yellow-200 rounded hover:text-black'>
         {
          loading? "Loading...":"Submit"
         }
         </button>
      </form>
      
    </div>
  ) 
}

export default Profile
