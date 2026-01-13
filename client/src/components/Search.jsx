import { TypeAnimation } from "react-type-animation";
import { IoClose, IoSearchOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import useMobile from "../hooks/useMobile";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMobile();
  const isSearchPage = location.pathname === "/search";

  const [searchText, setSearchText] = useState("");

  // Sync input with URL query
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    setSearchText(q);
  }, [location.search]);

  const handleOnChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    navigate(`/search?q=${value}`);
  };

  const handleClear = () => {
    setSearchText("");
    navigate("/search");
  };

  return (
    <div className="w-full h-11 rounded-lg border border-gray-200 flex items-center bg-slate-50 px-2">
      {/* LEFT ICON */}
      <button className="px-2">
        {isSearchPage && isMobile ? (
          <FaArrowLeft
            size={18}
            onClick={() => navigate(-1)}
            className="cursor-pointer"
          />
        ) : (
          <IoSearchOutline size={18} />
        )}
      </button>

      {/* INPUT / PLACEHOLDER */}
      <div className="flex-1">
        {!isSearchPage ? (
          <div
            onClick={() => navigate("/search")}
            className="text-sm text-neutral-500 cursor-text truncate"
          >
            <TypeAnimation
              sequence={[
                'Search "Milk"', 1000,
                'Search "Rice"', 1000,
                'Search "Bread"', 1000,
              ]}
              speed={50}
              repeat={Infinity}
            />
          </div>
        ) : (
          <input
            autoFocus
            value={searchText}
            onChange={handleOnChange}
            placeholder="Search for atta, dal and more..."
            className="w-full bg-transparent outline-none text-sm"
          />
        )}
      </div>

      {/* CLEAR BUTTON */}
      {isSearchPage && searchText && (
        <IoClose
          size={18}
          className="cursor-pointer text-gray-500 hover:text-black"
          onClick={handleClear}
        />
      )}
    </div>
  );
};

export default Search;
