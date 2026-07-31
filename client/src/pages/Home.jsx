
import banner from '../assets/banner.jpg'
import bannerMobile from "../assets/banner-mobile.jpg"
import { useSelector } from "react-redux"
import { valideURLConvert } from '../utils/validURLConverte.js'
import { useNavigate, Link } from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay.jsx'
import RecipeBundles from '../components/RecipeBundles.jsx'
import AIRecipeAssistant from '../components/AIRecipeAssistant.jsx'
import AIBudgetPlanner from '../components/AIBudgetPlanner.jsx'
import GamificationHub from '../components/GamificationHub.jsx'

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allcategory)
  const subCategoryData = useSelector(state => state.product.allsubCategory)
  const user = useSelector(state => state.user)
  const navigate = useNavigate()

  const handleRedirectProductListPage = (id, cat) => {
    const subcategory = subCategoryData.find(sub =>
      Array.isArray(sub.category) && sub.category.some(c => (c?._id || c) === id)
    );

    if (subcategory) {
      const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`;
      navigate(url);
    } else {
      const url = `/${valideURLConvert(cat)}-${id}`;
      navigate(url);
    }
  };



  return (
    <div>
      {/* PERSONALIZED GREETING & FLASH SALE TICKER */}
      <div className="bg-gradient-to-r from-green-700 via-emerald-600 to-teal-700 text-white text-xs sm:text-sm py-2 px-4 shadow-md">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="font-bold flex items-center gap-1.5">
            <span>👋 Good Morning, {user?.name || "Shopper"}!</span>
            <span className="hidden md:inline font-normal opacity-90">
              Based on your habits, you may need <strong>Milk, Eggs & Bread</strong> today.
            </span>
          </div>

          <div className="flex items-center gap-2 font-extrabold bg-black/20 px-3 py-1 rounded-full border border-white/20">
            <span className="animate-pulse text-amber-300">⚡ FLASH SALE</span>
            <span>Ends in 04:32:15</span>
          </div>
        </div>
      </div>

      {/* Banner section */}
      <div className=" container mx-auto my-4 px-4 sm:px-6 lg:px-8 ">
        <div className={`w-full h-full min-h-50  bg-slate-100 rounded-2xl ${!banner && "animate-pulse"} `}>
          <img
            src={banner}
            alt="banner"
            className="w-full h-full hidden lg:block hover:cursor-pointer rounded-2xl shadow-sm"

          />
          <img
            src={bannerMobile}
            alt="banner"
            className="w-full h-full   lg:hidden hover:cursor-pointer rounded-2xl shadow-sm"

          />

        </div>


      </div>
      
      {/* Category display section */}
      <div className=" container mx-auto px-4 sm:px-6 lg:px-8 my-4 md:my-6 grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3 md:gap-4">
        {
          loadingCategory ? (
            new Array(12).fill(null).map((c, index) => {
              return (
                <div key={index + "loadingCategory"} className="bg-white rounded p-4 min-h-25 grid gap-2 shadow animate-pulse">
                  <div className="bg-blue-100 min-h-15"></div>
                  <div className="bg-blue-100 h-8"></div>

                </div>
              )

            })

          ) : (
            categoryData.map((cat, index) => {
              return (
                <div className='cursor-pointer' key={cat._id + index + "displayCategory"} onClick={() => handleRedirectProductListPage(cat._id, cat.name)}>
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

      {/* 🍲 1-CLICK RECIPE BUNDLES */}
      <RecipeBundles />

      {/* 🤖 AI RECIPE CHEF ASSISTANT */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AIRecipeAssistant />
      </div>

      {/* 💰 AI BUDGET GROCERY PLANNER */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AIBudgetPlanner />
      </div>

      {/* 🎮 GAMIFICATION & REWARDS SPIN WHEEL */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <GamificationHub />
      </div>

      <div>
        {/* Display Category Product */}
        {
          categoryData.slice(0, 7).map((c, index) => {
            return (
              <CategoryWiseProductDisplay key={c?._id + index + "CategorywiseProduct"} id={c?._id} name={c?.name} />
            )
          })
        }
      </div>
    </div>
  )
}

export default Home
