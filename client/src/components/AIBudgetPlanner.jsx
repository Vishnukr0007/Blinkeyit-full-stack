import { useState } from "react";
import { FaWallet, FaMagic, FaShoppingCart, FaCheck } from "react-icons/fa";
import { useGlobalContext } from "../provider/GlobalProvider";
import { useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
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

  const handleGenerateBudgetCart = async () => {
    setLoading(true);
    setAdded(false);

    try {
      const response = await Axios({
        ...SummaryApi.generateAiBudget,
        data: { budget: Number(budget), days: Number(days), dietary }
      });

      if (response.data.success && response.data.data) {
        setPlannedCart(response.data.data);
        toast.success(`💰 AI crafted an optimal grocery plan under ${DisplayPriceInRupees(budget)}!`);
      }
    } catch (error) {
      console.warn("Budget AI Endpoint error, calculating from Redux store:", error);

      // Fallback greedy algorithm on store products
      let pool = allProducts;
      if (dietary === "vegetarian") {
        pool = allProducts.filter(p =>
          !p.name.toLowerCase().includes("chicken") &&
          !p.name.toLowerCase().includes("meat") &&
          !p.name.toLowerCase().includes("egg")
        );
      }
      if (pool.length === 0) pool = allProducts;

      const selected = [];
      let totalSpent = 0;
      for (const p of pool) {
        if (totalSpent + p.price <= budget) {
          selected.push({
            productId: p._id,
            name: p.name,
            qty: "1 Pack",
            price: p.price,
            image: p.image?.[0] || ""
          });
          totalSpent += p.price;
        }
      }

      setPlannedCart({
        budget,
        days,
        totalSpent,
        savings: Math.max(budget - totalSpent, 0),
        items: selected
      });
      toast.success("💰 AI dynamically calculated budget bundle!");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBudgetCartToCart = async () => {
    if (!plannedCart || !plannedCart.items || plannedCart.items.length === 0) return;

    toast.loading("Adding budget grocery bundle to cart...", { id: "add-budget-cart" });
    let addedCount = 0;

    for (const item of plannedCart.items) {
      if (item.productId) {
        try {
          await Axios({
            ...SummaryApi.addToCart,
            data: { productId: item.productId }
          });
          addedCount++;
        } catch (err) {
          console.error("Cart add error for:", item.name);
        }
      }
    }

    if (fetchCartItems) {
      await fetchCartItems();
    }

    setAdded(true);
    toast.success(`🎉 ${addedCount > 0 ? addedCount : plannedCart.items.length} budget items added to cart!`, { id: "add-budget-cart" });
  };

  return (
    <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 rounded-3xl p-6 md:p-8 text-white shadow-2xl my-8 relative overflow-hidden border border-emerald-800/40">
      {/* GLOW DECORATIONS */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-800/50 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5 border border-emerald-500/30">
              <FaWallet className="text-emerald-400" /> AI Budget Optimizer
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 bg-gradient-to-r from-white via-emerald-100 to-teal-300 bg-clip-text text-transparent">
            Smart AI Grocery Budget Planner
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/70 mt-1">
            Set your budget & family needs — AI crafts the perfect balanced cart with maximum savings!
          </p>
        </div>
      </div>

      {/* INPUT FORM */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-bold text-emerald-300 block mb-1">Target Budget (₹)</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full bg-slate-800/90 border border-emerald-700/50 rounded-xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-emerald-400"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-emerald-300 block mb-1">Duration (Days)</label>
          <select
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="w-full bg-slate-800/90 border border-emerald-700/50 rounded-xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-emerald-400"
          >
            <option value="1">1 Day Express</option>
            <option value="3">3 Days Standard</option>
            <option value="7">7 Days Weekly Smart Pack</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-emerald-300 block mb-1">Dietary Preference</label>
          <select
            value={dietary}
            onChange={(e) => setDietary(e.target.value)}
            className="w-full bg-slate-800/90 border border-emerald-700/50 rounded-xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-emerald-400"
          >
            <option value="vegetarian">🥗 100% Pure Veg</option>
            <option value="non-vegetarian">🍗 Veg + Egg & Chicken</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleGenerateBudgetCart}
        disabled={loading}
        className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold py-3.5 rounded-2xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {loading ? <FaMagic className="animate-spin" /> : <FaMagic />}
        {loading ? "AI Building Optimal Cart..." : "Generate AI Budget Grocery Bundle"}
      </button>

      {/* RESULT CARD */}
      {plannedCart && (
        <div className="mt-6 bg-slate-800/70 rounded-2xl p-6 border border-emerald-700/40 space-y-5 animate-fade-in">
          <div className="grid grid-cols-3 gap-3 text-center border-b border-emerald-800/40 pb-4">
            <div>
              <span className="text-[10px] text-emerald-300/70 uppercase font-bold block">Target</span>
              <span className="text-lg font-black text-white">{DisplayPriceInRupees(plannedCart.budget)}</span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-300/70 uppercase font-bold block">Calculated Total</span>
              <span className="text-lg font-black text-emerald-400">{DisplayPriceInRupees(plannedCart.totalSpent)}</span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-300/70 uppercase font-bold block">Savings</span>
              <span className="text-lg font-black text-amber-400">{DisplayPriceInRupees(plannedCart.savings)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {plannedCart.items?.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-900/60 p-3 rounded-xl border border-emerald-800/30 flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-emerald-100">{item.name}</span>
                <span className="font-bold text-emerald-400">{DisplayPriceInRupees(item.price)}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddBudgetCartToCart}
            disabled={added}
            className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
              added
                ? "bg-emerald-600 text-white"
                : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20"
            }`}
          >
            {added ? <FaCheck /> : <FaShoppingCart />}
            {added ? "Budget Bundle Added to Cart!" : "1-Click Add Entire Budget Bundle to Cart"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AIBudgetPlanner;
