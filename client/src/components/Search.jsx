import { TypeAnimation } from "react-type-animation";
import { IoClose, IoSearchOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaMicrophone, FaCamera } from "react-icons/fa";
import toast from "react-hot-toast";
import useMobile from "../hooks/useMobile";
import AIVisualSearchModal from "./AIVisualSearchModal";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMobile();
  const isSearchPage = location.pathname === "/search";

  const [searchText, setSearchText] = useState("");
  const [showAiModal, setShowAiModal] = useState(false);

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
    <>
      <div className="w-full h-11 rounded-lg border border-gray-200 flex items-center bg-slate-50 px-2 gap-1">
        {/* LEFT ICON */}
        <button className="px-2 cursor-pointer">
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
              className="text-sm text-neutral-500 cursor-pointer truncate"
            >
              <TypeAnimation
                sequence={[
                  'Search "Milk"', 1000,
                  'Search "Rice"', 1000,
                  'Search "Bread"', 1000,
                  '✨ AI Snap & Shop', 1000,
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

        {/* AI SNAP & SHOP BUTTON */}
        <button
          type="button"
          onClick={() => setShowAiModal(true)}
          title="AI Snap & Shop (Upload Image)"
          className="px-2 text-purple-600 hover:text-purple-800 transition cursor-pointer flex items-center gap-1 bg-purple-50 hover:bg-purple-100 py-1 rounded-md text-xs font-semibold border border-purple-200"
        >
          <FaCamera size={13} />
          <span className="hidden sm:inline">AI Snap</span>
        </button>

        {/* VOICE SEARCH BUTTON */}
        <button
          onClick={() => {
            if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
              toast.error("Voice search is not supported in this browser.");
              return;
            }
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.onstart = () => toast("🎙️ Listening... Speak now!");
            recognition.onresult = (event) => {
              const transcript = event.results[0][0].transcript;
              setSearchText(transcript);
              navigate(`/search?q=${transcript}`);
              toast.success(`Voice Recognized: "${transcript}"`);
            };
            recognition.start();
          }}
          title="Voice Search"
          className="px-2 text-gray-400 hover:text-green-700 transition cursor-pointer"
        >
          <FaMicrophone size={16} />
        </button>

        {/* CLEAR BUTTON */}
        {isSearchPage && searchText && (
          <IoClose
            size={18}
            className="cursor-pointer text-gray-500 hover:text-black"
            onClick={handleClear}
          />
        )}
      </div>

      {/* AI VISUAL SEARCH MODAL */}
      <AIVisualSearchModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
      />
    </>
  );
};

export default Search;
