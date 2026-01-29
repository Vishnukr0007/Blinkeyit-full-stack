
import banner from '../assets/banner.jpg'
import bannerMobile from "../assets/banner-mobile.jpg"
import { useSelector } from "react-redux"
import { valideURLConvert } from '../utils/validURLConverte.js'
import {  useNavigate } from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay.jsx'
const Home = () => {
  const loadingCategory= useSelector(state=>state.product.loadingCategory)
  const categoryData= useSelector(state =>state.product.allcategory)
  const subCategoryData= useSelector(state =>state.product.allsubCategory)
  const navigate=useNavigate ()

  const handleRedirectProductListPage = (id, cat) => {
    const subcategory = subCategoryData.find(sub => 
      sub.category.some(c => c._id === id)
    );
  
    if (!subcategory) {
      console.error("Subcategory not found for category id:", id);
      return;
    }
  
    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`;
    navigate(url);
  };
  
 
    
  return (
    <div>
      {/* Banner section */}
      <div className=" container mx-auto my-4 px-4 sm:px-6 lg:px-8 ">
        <div className={`w-full h-full min-h-50  bg-slate-100 rounded-2xl ${!banner && "animate-pulse"} `}>
          <img
            src={banner}
            alt="banner"
            className="w-full h-full hidden lg:block hover:cursor-pointer"
          
          />
          <img
            src={bannerMobile}
            alt="banner"
            className="w-full h-full   lg:hidden hover:cursor-pointer"
          
          />

        </div>
       

      </div>
       {/* Category display section */}
      <div className=" container mx-auto px-4 sm:px-6 lg:px-8 my-6 md:my-10 grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3 md:gap-4">
        {
          loadingCategory ? (
            new Array(12).fill(null).map((c,index)=>{
              return(
                 <div key={index+"loadingCategory"} className="bg-white rounded p-4 min-h-25 grid gap-2 shadow animate-pulse">
                  <div className="bg-blue-100 min-h-15"></div>
                  <div className="bg-blue-100 h-8"></div>
                  
                 </div>
              )
            
            })

          ):(
            categoryData.map((cat,index)=>{
              return(
                <div className='cursor-pointer' key={cat._id+index+"displayCategory"} onClick={()=>handleRedirectProductListPage(cat._id,cat.name)}>
                  <div>
                    <img 
                    className=" h-full w-full object-scale-down"
                     src={cat.image}
                     alt={cat.name} />
                     
                  </div>

                </div>
              )
            })
            
          )
            
        }
      </div>
      <div >

      
      {/* Display Category Product */}
      {
        categoryData.slice(0, 7).map((c,index)=>{
          return(
            <CategoryWiseProductDisplay key={c?._id+index+"CategorywiseProduct"} id={c?._id} name={c?.name}/>
          )
        })
       
      }
      </div>
    </div>
  )
}

export default Home
