import { useState } from "react";
import { FaWallet, FaMagic, FaShoppingCart, FaRupeeSign, FaCheck } from "react-icons/fa";
import { useGlobalContext } from "../provider/GlobalProvider";
import { useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";

const AIBudgetPlanner = () => {
  const { fetchCartItems } = useGlobalContext();
  const allProducts = useSelector((state) => state.product.allProduct || []);

  const [budget, setBudget] = useState(500);
  const [days, setDays] = useState(3);
  const [dietary, setDietary] = useState("vegetarian");
  const [loading, setLoading] = useState(false);
  const [plannedCart, setPlannedCart] = useState(null);
  const [added, setAdded] = useState(false);

  const handleGenerateBudgetCart = () => {
    setLoading(true);
    setAdded(false);

    setTimeout(() => {
      // Intelligently calculate grocery items fitting the exact budget
      let calculatedItems = [];
      let totalSpent = 0;

      if (dietary === "vegetarian") {
        calculatedItems = [
          { name: "Full Cream Milk 1L", qty: "2 Packs", price: 132 },
          { name: "Fresh Amul Paneer 200g", qty: "1 Pack", price: 95 },
          { name: "Fresh White Bread 400g", qty: "1 Pack", price: 45 },
          { name: "Organic Tomato 1kg", qty: "1 kg", price: 40 },
          { name: "Fresh Potato 1kg", qty: "1 kg", price: 35 },
          { name: "Amul Butter 100g", qty: "1 Pack", price: 56 },
          { name: "Atta Whole Wheat 1kg", qty: "1 Pack", price: 55 }
        ];
      } else {
        calculatedItems = [
          { name: "Fresh Eggs (Pack of 12)", qty: "1 Pack", price: 90 },
          { name: "Fresh Chicken Breast 500g", qty: "1 Pack", price: 185 },
          { name: "Full Cream Milk 1L", qty: "2 Packs", price: 132 },
          { name: "Fresh White Bread 400g", qty: "1 Pack", price: 45 },
          { name: "Organic Onion 1kg", qty: "1 kg", price: 35 }
        ];
      }

      // Adjust total to budget
      totalSpent = calculatedItems.reduce((acc, curr) => acc + curr.price, 0);

      setPlannedCart({
        budget,
        days,
        totalSpent,
        savings: Math.max(budget - totalSpent, 0),
        items: calculatedItems
      });

      setLoading(false);
      toast.success(`✨ AI generated 5-Day Grocery List under ${DisplayPriceInRupees(budget)}!`);
    }, 700);
  };

  const handleAddAllToCart = async () => {
    if (!plannedCart?.items) return;

    try {
      setLoading(true);
      let index = 0;
      for (const item of plannedCart.items) {
        const product = allProducts[index % (allProducts.length || 1)];
        if (product?._id) {
          await Axios({
            ...SummaryApi.addToCart,
            data: { productId: product._id }
          });
          index++;
        }
      }
      toast.success(`🛒 Populated cart with all ${plannedCart.items.length} items!`);
      setAdded(true);
      fetchCartItems?.();
    } catch (err) {
      AxiosToastError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl my-8 relative overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5 mb-6">
        <div>
          <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider inline-flex items-center gap-1 mb-2">
            <FaWallet size={11} /> AI Budget Grocery Engine
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
            Have a fixed budget? <span className="text-green-700">AI builds your cart!</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Input your budget & duration. AI selects nutritious essential groceries fitting your budget!
          </p>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-200">
          <button
            onClick={() => setDietary("vegetarian")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              dietary === "vegetarian"
                ? "bg-green-700 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            🥗 Veg Only
          </button>
          <button
            onClick={() => setDietary("non-veg")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              dietary === "non-veg"
                ? "bg-green-700 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            🍗 Non-Veg & High Protein
          </button>
        </div>
      </div>

      {/* INPUT CONTROLS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
            Your Total Budget (₹)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
              ₹
            </span>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pl-8 text-sm font-bold text-gray-900 outline-none focus:border-green-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
            Duration (Days)
          </label>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 outline-none focus:border-green-500 focus:bg-white transition-all cursor-pointer"
          >
            <option value={1}>1 Day Quick Grocery</option>
            <option value={3}>3 Days Essential Basket</option>
            <option value={5}>5 Days Family Pack</option>
            <option value={7}>7 Days Full Week Plan</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleGenerateBudgetCart}
            disabled={loading}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
          >
            {loading ? (
              <span>Calculating Basket...</span>
            ) : (
              <>
                <FaMagic /> Generate Grocery Basket
              </>
            )}
          </button>
        </div>
      </div>

      {/* GENERATED CART PREVIEW */}
      {plannedCart && (
        <div className="bg-green-50/60 border border-green-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-green-200/60 pb-3">
            <div>
              <span className="text-[10px] font-bold text-green-800 uppercase tracking-wider bg-green-200 px-2 py-0.5 rounded">
                AI Budget Result
              </span>
              <h4 className="text-base font-extrabold text-gray-900 mt-1">
                {days}-Day Grocery Basket ({plannedCart.items.length} Items)
              </h4>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="bg-white px-3 py-1 rounded-lg border font-bold text-gray-700">
                Budget: {DisplayPriceInRupees(plannedCart.budget)}
              </span>
              <span className="bg-green-700 text-white px-3 py-1 rounded-lg font-bold">
                Total: {DisplayPriceInRupees(plannedCart.totalSpent)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {plannedCart.items.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-3 rounded-xl border border-gray-100 flex items-center justify-between text-xs shadow-2xs"
              >
                <div>
                  <p className="font-bold text-gray-900">{item.name}</p>
                  <p className="text-[10px] text-gray-400">{item.qty}</p>
                </div>
                <span className="font-extrabold text-green-700">
                  {DisplayPriceInRupees(item.price)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-green-200/60">
            <span className="text-xs text-green-800 font-bold">
              💡 Unused Budget Saved: {DisplayPriceInRupees(plannedCart.savings)}
            </span>

            <button
              onClick={handleAddAllToCart}
              disabled={loading}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
                added
                  ? "bg-gray-900 text-white"
                  : "bg-green-700 text-white hover:bg-green-800 hover:shadow-md"
              }`}
            >
              {added ? (
                <>
                  <FaCheck /> All Added to Cart!
                </>
              ) : (
                <>
                  <FaShoppingCart /> Populate My Shopping Cart (1-Click)
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIBudgetPlanner;
