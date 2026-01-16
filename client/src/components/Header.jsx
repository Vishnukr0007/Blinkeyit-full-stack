import { useState } from "react";
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

const Header = () => {
  const isMobile = useMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const isSearchPage = location.pathname === "/search";
  const user = useSelector((state) => state?.user);
  const isLoggedIn = Boolean(user?._id);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openUserCartMenu, setUserCartMenu] = useState(false);

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
        <div className="container mx-auto flex items-center h-20 px-4 sm:px-6 lg:px-8">
          <Link to="/">
            <img src={newlogo} className="w-[160px]" alt="logo" />
          </Link>

          <div className="flex-1 mx-10">
            <Search />
          </div>

          <div className="flex items-center gap-6 relative">
            {/* ACCOUNT */}
            {isLoggedIn ? (
              <div className="relative">
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
                className="text-sm hover:underline"
              >
                Login
              </button>
            )}

            {/* CART BUTTON */}
            <button
              onClick={handleCartClick}
              disabled={!isLoggedIn}
              className={`flex items-center gap-3 px-4 py-4 rounded-md transition   h-[52px] 
                ${
                  isLoggedIn
                    ? "bg-green-700 text-white hover:bg-green-800 cursor-pointer"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
            >
              <BsCart3 size={20} />

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
            <Link to="/">
              <img src={newlogo} className="w-[100px]" alt="logo" />
            </Link>

            <div className="flex items-center gap-4">
              {/* USER ICON */}
              <FaUserCircle size={22} onClick={handleMobileUser} />
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
