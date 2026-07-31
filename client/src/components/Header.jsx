import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { BsCart3 } from "react-icons/bs";
import { IoCaretDownSharp, IoCaretUpSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import newlogo from "../assets/newlogo.png";
import Search from "./Search";
import UserMenu from "./UserMenu";
import useMobile from "../hooks/useMobile";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import DisplayCartItem from "./DisplayCartItem";
import toast from "react-hot-toast";

const Header = () => {
  const isMobile = useMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const isSearchPage = location.pathname === "/search";
  const user = useSelector((state) => state?.user);
  const isLoggedIn = Boolean(user?._id);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openUserCartMenu, setUserCartMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Handle click outside to close user menu
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setOpenUserMenu(false);
      }
    };

    if (openUserMenu) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [openUserMenu]);

  const { totalQty, totalPrice } = useGlobalContext();

  const handleMobileUser = () => {
    navigate(isLoggedIn ? "/user" : "/login");
  };

  const handleCartClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    setUserCartMenu(true); // both mobile & desktop
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      {/* ================= DESKTOP HEADER ================= */}
      {!isMobile && (
        <div className="container mx-auto flex items-center h-20 px-4 sm:px-6 lg:px-8 justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="cursor-pointer">
              <img src={newlogo} className="w-[150px]" alt="logo" />
            </Link>

            {/* LOCATION & 8-MIN DELIVERY BADGE */}
            <div className="hidden xl:flex flex-col text-xs border-l border-gray-200 pl-4 py-1">
              <span className="font-extrabold text-gray-900 flex items-center gap-1">
                ⚡ Delivering in <span className="text-green-700 font-black">8 Mins</span>
              </span>
              <span className="text-gray-500 truncate max-w-[140px] text-[11px]">
                Home - Sector 62, Noida 📍
              </span>
            </div>
          </div>

          <div className="flex-1 max-w-xl mx-4">
            <Search />
          </div>

          <div className="flex items-center gap-4 relative">
            {/* BLINKEY COINS BADGE */}
            <div
              onClick={() => toast("🪙 You have 250 Blinkey Coins! Use at checkout.")}
              title="Blinkey Coins Balance"
              className="hidden lg:flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-2xs cursor-pointer hover:bg-amber-100 transition"
            >
              <span>🪙</span>
              <span>250 Coins</span>
            </div>
            {/* ACCOUNT */}
            {isLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                <div
                  onClick={() => setOpenUserMenu((prev) => !prev)}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <p className="text-sm font-medium">Account</p>
                  {openUserMenu ? (
                    <IoCaretUpSharp size={13} />
                  ) : (
                    <IoCaretDownSharp size={13} />
                  )}
                </div>

                {openUserMenu && (
                  <div className="absolute top-8 right-0 z-30 bg-white rounded-md p-4 min-w-60 shadow-lg">
                    <UserMenu closeMenu={() => setOpenUserMenu(false)} />
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="text-sm hover:underline cursor-pointer"  
              >
                Login
              </button>
            )}

            {/* CART BUTTON */}
            <button
              onClick={handleCartClick}
              disabled={!isLoggedIn}
              className={`flex items-center gap-3 px-4 py-4 rounded-md transition h-[52px] group
                ${
                  isLoggedIn
                    ? "bg-green-700 text-white hover:bg-green-800 cursor-pointer"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
            >
              <BsCart3 size={20} className="animate-bounce-icon" />

              <div className="text-left text-sm leading-tight">
                {totalQty > 0 ? (
                  <>
                    <p className="font-semibold">{totalQty} Items</p>
                    <p className="text-xs opacity-90">
                      {DisplayPriceInRupees(totalPrice)}
                    </p>
                  </>
                ) : (
                  <p className="font-semibold">My Cart</p>
                )}
              </div>
            </button>

          </div>
        </div>
      )}

      {isMobile && !isSearchPage && (
        <>
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <Link to="/" className="cursor-pointer">
              <img src={newlogo} className="w-[100px]" alt="logo" />
            </Link>

            <div className="flex items-center gap-4">
              {/* USER ICON */}
              <FaUserCircle size={22} onClick={handleMobileUser} className="cursor-pointer" />
            </div>
          </div>

          <div className="px-4 pb-2">
            <Search />
          </div>
        </>
      )}

      {isMobile && isSearchPage && (
        <div className="px-4 sm:px-6 py-2">
          <Search />
        </div>
      )}

     { openUserCartMenu &&( 
      
      <DisplayCartItem close={()=>setUserCartMenu(false)}/>
      
      ) }
    </header>
  );
};

export default Header;
