import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { FaSquareThreads } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className=" text-gray-600 text-sm">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
        
        {/* Left Section - Legal & Company Info */}
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p>© Blink Commerce Private Limited  2025</p>
          
        </div>

        {/* Right Section - Social Icons */}
        <div className="flex space-x-8 ">
          <a href="#"   className="hover:text-green-600 transition">
            <FaFacebook size={40}   />
          </a>
          <a href="#" className="hover:text-green-600 transition">
            <FaTwitter size={40} />
          </a>
          <a href="#" className="hover:text-green-600 transition">
            <FaInstagram size={40} />
          </a>
          <a href="#" className="hover:text-green-600 transition">
            <FaSquareThreads size={40} />
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
