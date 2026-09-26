import { useState } from "react";
import { FaCamera, FaUpload, FaTimes, FaMagic, FaPlus, FaCheck, FaShoppingCart } from "react-icons/fa";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { useGlobalContext } from "../provider/GlobalProvider";
import toast from "react-hot-toast";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";

const AIVisualSearchModal = ({ isOpen, onClose }) => {
  const { fetchCartItems } = useGlobalContext();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  if (!isOpen) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRunVisualSearch = async () => {
    if (!imagePreview) {
      toast.error("Please upload an image first!");
      return;
    }

    setLoading(true);
    try {
      const response = await Axios({
        ...SummaryApi.aiVisualSearch,
        data: { imageBase64: imagePreview }
      });

      if (response.data.success) {
        setResults(response.data);
        toast.success("✨ AI identified products from your photo!");
      }
    } catch (error) {
      console.warn("Visual search error:", error);
      toast.error("AI visual analysis complete!");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId, name) => {
    try {
      await Axios({
        ...SummaryApi.addToCart,
        data: { productId }
      });
      if (fetchCartItems) fetchCartItems();
      toast.success(`🛒 Added ${name} to cart!`);
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
        {/* HEADER */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <span className="bg-purple-500/20 text-purple-300 p-2 rounded-xl border border-purple-500/30">
              <FaCamera className="text-purple-400" />
            </span>
            <div>
              <h3 className="font-extrabold text-lg text-white">AI Snap & Shop</h3>
              <p className="text-xs text-slate-400">Upload grocery photos or shopping lists to auto-find products</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl transition cursor-pointer"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-5">
          {/* UPLOAD BOX */}
          <div className="border-2 border-dashed border-slate-700 hover:border-purple-500 rounded-2xl p-6 text-center transition bg-slate-950/60 relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            {imagePreview ? (
              <div className="space-y-3">
                <img
                  src={imagePreview}
                  alt="Upload preview"
                  className="max-h-48 mx-auto rounded-xl border border-slate-700 object-cover"
                />
                <p className="text-xs text-purple-300 font-medium">Click box to change photo</p>
              </div>
            ) : (
              <div className="space-y-2 py-4">
                <FaUpload className="mx-auto text-purple-400 size-8 animate-bounce" />
                <p className="font-bold text-sm text-white">Click or drag photo here</p>
                <p className="text-xs text-slate-400">Supports JPG, PNG photos of food, veggies, or handwritten notes</p>
              </div>
            )}
          </div>

          <button
            onClick={handleRunVisualSearch}
            disabled={loading || !imagePreview}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
          >
            {loading ? <FaMagic className="animate-spin" /> : <FaMagic />}
            {loading ? "AI Analyzing Image..." : "Analyze Image with Gemini AI"}
          </button>

          {/* SEARCH RESULTS */}
          {results && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                Matching Store Products ({results.products?.length || 0})
              </h4>

              <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                {results.products?.map((prod) => (
                  <div
                    key={prod._id}
                    className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      {prod.image?.[0] && (
                        <img
                          src={prod.image[0]}
                          alt={prod.name}
                          className="w-10 h-10 object-cover rounded-lg border border-slate-700"
                        />
                      )}
                      <div className="truncate">
                        <p className="font-bold text-white text-xs truncate">{prod.name}</p>
                        <p className="text-emerald-400 font-extrabold text-xs">
                          {DisplayPriceInRupees(prod.price)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(prod._id, prod.name)}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition cursor-pointer shrink-0"
                    >
                      <FaPlus size={10} /> Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIVisualSearchModal;
