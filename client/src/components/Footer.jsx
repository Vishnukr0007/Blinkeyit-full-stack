import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { valideURLConvert } from '../utils/validURLConverte'

const Footer = () => {
  const allCategory = useSelector(state => state.product.allcategory)
  const allSubCategory = useSelector(state => state.product.allsubCategory)

  const getCategoryUrl = (category) => {
    // Find the first subcategory that belongs to this category
    const subcategory = allSubCategory.find(sub => 
      sub.category.some(c => c._id === category._id)
    );
    
    if (subcategory) {
      return `/${valideURLConvert(category.name)}-${category._id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`;
    }
    
    // Fallback if no subcategory found (though normally should exist)
    return `/${valideURLConvert(category.name)}-${category._id}`;
  }

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Useful Links Section */}
          <div>
            <h3 className="font-bold text-gray-800 mb-6 text-sm underline decoration-green-500 underline-offset-8">Useful Links</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link to="/about" className="hover:text-green-600 transition-colors">About</Link></li>
              <li><Link to="/careers" className="hover:text-green-600 transition-colors">Careers</Link></li>
              <li><Link to="/blog" className="hover:text-green-600 transition-colors">Blog</Link></li>
              <li><Link to="/press" className="hover:text-green-600 transition-colors">Press</Link></li>
              <li><Link to="/lead" className="hover:text-green-600 transition-colors">Lead</Link></li>
              <li><Link to="/value" className="hover:text-green-600 transition-colors">Value</Link></li>
            </ul>
          </div>

          {/* Categories Section */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-gray-800 mb-6 text-sm underline decoration-green-500 underline-offset-8">Categories</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-8 text-sm text-gray-500">
              {
                allCategory.slice(0, 15).map((category, index) => {
                  return (
                    <Link 
                      key={category._id + "footer"} 
                      to={getCategoryUrl(category)} 
                      className="hover:text-green-600 transition-colors truncate"
                    >
                      {category.name}
                    </Link>
                  )
                })
              }
              {allCategory.length > 15 && (
                <Link to="/all-categories" className="text-green-600 font-medium hover:underline">
                  See all categories
                </Link>
              )}
            </div>
          </div>

          {/* Partner with us */}
          <div>
            <h3 className="font-bold text-gray-800 mb-6 text-sm underline decoration-green-500 underline-offset-8">Partner with us</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link to="/sell-on-blinkeyit" className="hover:text-green-600 transition-colors">Sell on Blinkeyit</Link></li>
              <li><Link to="/delivery-partner" className="hover:text-green-600 transition-colors">Become a Delivery Partner</Link></li>
              <li><Link to="/franchise" className="hover:text-green-600 transition-colors">Become a Franchisee</Link></li>
            </ul>
          </div>

          {/* Download App & Socials */}
          <div>
            <h3 className="font-bold text-gray-800 mb-6 text-sm underline decoration-green-500 underline-offset-8">Download App</h3>
            <div className="flex flex-col gap-4 mb-8">
              <a href="#" className="bg-gray-900 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-3 hover:bg-black transition-all border border-gray-800">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-6"/>
              </a>
              <a href="#" className="bg-gray-900 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-3 hover:bg-black transition-all border border-gray-800">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" className="h-6"/>
              </a>
            </div>
            
            <h3 className="font-bold text-gray-800 mb-4 text-sm">Follow us</h3>
            <div className="flex items-center gap-5 text-gray-400">
              <a href="#" className="hover:text-green-600 transition-colors"><FaFacebook size={22}/></a>
              <a href="#" className="hover:text-green-600 transition-colors"><FaTwitter size={22}/></a>
              <a href="#" className="hover:text-green-600 transition-colors"><FaInstagram size={22}/></a>
              <a href="#" className="hover:text-green-600 transition-colors"><FaLinkedin size={22}/></a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-gray-400 text-xs text-center md:text-left">
            <p className="font-medium">© Blink Commerce Private Limited 2025</p>
          </div>
          <div className="text-gray-400 text-[10px] max-w-2xl text-center md:text-right leading-relaxed font-light">
            <p>“Blinkeyit” is owned & managed by "Blink Commerce Private Limited" and is not related, linked or interconnected in whatsoever manner or nature, to “GROFFR.COM” which is a real estate services business operated by “Redstone Consultancy Services Private Limited”.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
