import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import {Toaster} from 'react-hot-toast'
import { useEffect } from 'react'
import fetchUserDetails from './utils/fetchUserDetails'
import { setUserDetails } from './store/userSlice'
import { useDispatch } from 'react-redux'
import Axios from './utils/Axios'
import SummaryApi from './common/SummaryApi'
import { setAllCategory, setAllsubCategory,setLoadingCategory } from './store/productSlice'
import ScrollToTop from './components/ScrollToTop'
import GlobalProvider from './provider/GlobalProvider'
import CartMobileLink from './components/CartMobileLink'


function App() {

  const dispatch=useDispatch()
  const location=useLocation()
  
  const fetchUser= async()=>{
    const userData=await fetchUserDetails()
      dispatch(setUserDetails(userData.data))
  }
  const fetchCategory=async ()=>{
    try {
        dispatch(setLoadingCategory(true))
        const response=await Axios({
          ...SummaryApi.getCategory,
          
        })
       const {data: responseData}=response

       if(responseData.success){
        dispatch(setAllCategory(responseData.data))
        
       }

        } catch (error) {

         return error
       }finally{
        dispatch(setLoadingCategory(false))
       }
  }

  const fetchSubCategory=async ()=>{
    try {
        dispatch(setLoadingCategory(true))
        const response=await Axios({
          ...SummaryApi.getSubcategory,
          
        })
       const {data: responseData}=response

       if(responseData.success){
        dispatch(setAllsubCategory(responseData.data))
        
       }

        } catch (error) {

         return error
       }finally{
        dispatch(setLoadingCategory(false))
       }
  }

  
  
 
    useEffect(()=>{
        fetchUser()
        fetchCategory()
        fetchSubCategory() 
        // fetchCartItems()
         },[])

  return (
    <GlobalProvider>
    <ScrollToTop/>
    <Header/>
    
     <main className='min-h-[50vh]'>
      <Outlet/>
     </main>

     <Footer/>
     <Toaster/>
     {location.pathname !== "/checkout" &&
 location.pathname !== "/cart" && location.pathname !== "/dashboard/address" && (
   <CartMobileLink />
 )}
    </ GlobalProvider>
  )
}

export default App
