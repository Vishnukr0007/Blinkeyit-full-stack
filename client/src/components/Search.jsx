import { TypeAnimation } from "react-type-animation";
import { IoClose, IoSearchOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaMicrophone, FaCamera } from "react-icons/fa";
import toast from "react-hot-toast";
import useMobile from "../hooks/useMobile";
import useDebounce from "../hooks/useDebounce";
import AIVisualSearchModal from "./AIVisualSearchModal";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMobile();
  const isSearchPage = location.pathname === "/search";

  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get("q") || "";

  const [searchText, setSearchText] = useState(initialQuery);
  const [showAiModal, setShowAiModal] = useState(false);

  // Debounce search query by 300ms to avoid spamming navigation and API calls
  const debouncedQuery = useDebounce(searchText, 300);

  // Sync state if URL query param changes externally
  useEffect(() => {
    const q = new URLSearchParams(location.search).get("q") || "";
    if (q !== searchText && isSearchPage) {
      setSearchText(q);
    }
  }, [location.search, isSearchPage]);

  // Navigate when debounced query updates
  useEffect(() => {
    if (isSearchPage) {
      const currentParam = new URLSearchParams(location.search).get("q") || "";
      if (debouncedQuery !== currentParam) {
        if (debouncedQuery.trim()) {
          navigate(`/search?q=${encodeURIComponent(debouncedQuery.trim())}`, {
            replace: true,
          });
        } else {
          navigate("/search", { replace: true });
        }
      }
    }
  }, [debouncedQuery, isSearchPage, navigate, location.search]);

  const handleOnChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    // If not already on the search page, immediately navigate to /search with the typed letter
    if (!isSearchPage) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
    }
  };

  const handleClear = () => {
    setSearchText("");
    navigate("/search", { replace: true });
  };

  return (
    <>
      <div className="w-full h-11 rounded-xl border border-gray-200 flex items-center bg-slate-50 hover:bg-white focus-within:bg-white focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-100 px-3 gap-2 transition-all shadow-2xs">
        {/* LEFT ICON */}
        <div className="text-gray-400 shrink-0">
          {isSearchPage && isMobile ? (
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-black transition cursor-pointer"
            >
              <FaArrowLeft size={16} />
            </button>
          ) : (
            <IoSearchOutline size={18} />
          )}
        </div>

        {/* INPUT / ANIMATED PLACEHOLDER */}
        <div className="flex-1 min-w-0">
          {!isSearchPage ? (
            <div
              onClick={() => navigate("/search")}
              className="text-sm text-neutral-500 cursor-pointer truncate select-none"
            >
              <TypeAnimation
                sequence={[
                  'Search "Milk & Dairy"', 1200,
                  'Search "Fresh Apples & Fruits"', 1200,
                  'Search "Atta, Rice & Dal"', 1200,
                  '✨ AI Snap & Shop', 1200,
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
              placeholder="Search for atta, dal, chips and more..."
              className="w-full bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400"
            />
          )}
        </div>

        {/* AI SNAP & SHOP */}
        <button
          type="button"
          onClick={() => setShowAiModal(true)}
          title="AI Snap & Shop (Search by Image)"
          className="shrink-0 text-purple-600 hover:text-purple-800 transition cursor-pointer flex items-center gap-1 bg-purple-50 hover:bg-purple-100 py-1 px-2 rounded-md text-xs font-semibold border border-purple-200"
        >
          <FaCamera size={12} />
          <span className="hidden sm:inline">AI Snap</span>
        </button>

        {/* VOICE SEARCH */}
        <button
          type="button"
          onClick={() => {
            if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
              toast.error("Voice search is not supported in this browser.");
              return;
            }
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.onstart = () => toast("🎙️ Listening... Speak your search!", { icon: "🎙️" });
            recognition.onresult = (event) => {
              const transcript = event.results[0][0].transcript;
              setSearchText(transcript);
              navigate(`/search?q=${encodeURIComponent(transcript)}`);
              toast.success(`Voice Recognized: "${transcript}"`);
            };
            recognition.start();
          }}
          title="Voice Search"
          className="shrink-0 text-gray-400 hover:text-green-700 transition cursor-pointer p-1"
        >
          <FaMicrophone size={15} />
        </button>

        {/* CLEAR BUTTON */}
        {isSearchPage && searchText && (
          <button
            onClick={handleClear}
            title="Clear search"
            className="shrink-0 text-gray-400 hover:text-black transition cursor-pointer p-0.5"
          >
            <IoClose size={18} />
          </button>
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
