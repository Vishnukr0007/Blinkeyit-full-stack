import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { FaSquareThreads } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 text-gray-600 text-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Left Section - Legal & Company Info */}
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p>© Blink Commerce Private Limited  2025</p>
          
        </div>

        {/* Right Section - Social Icons */}
        <div className="flex items-center gap-6 text-gray-400">
          <a href="#" className="hover:text-green-600 transition-colors">
            <FaFacebook size={24}   />
          </a>
          <a href="#" className="hover:text-green-600 transition-colors">
            <FaTwitter size={24} />
          </a>
          <a href="#" className="hover:text-green-600 transition-colors">
            <FaInstagram size={24} />
          </a>
          <a href="#" className="hover:text-green-600 transition-colors">
            <FaSquareThreads size={24} />
          </a>
        </div>
        
      </div>
      <div >
            <p className="mx-auto p-7">“Blinkit” is owned & managed by "Blink Commerce Private Limited "  and is not related, linked or interconnected in whatsoever manner or nature, to “GROFFR.COM” which is a real estate services
                 business operated by “Redstone Consultancy Services Private Limited”.</p>
        </div>
    </footer>
  );
};

export default Footer;
