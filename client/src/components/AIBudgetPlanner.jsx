import { useState, useEffect } from "react";
import {
  FaWallet,
  FaMagic,
  FaShoppingCart,
  FaCheck,
  FaBookmark,
  FaStar,
  FaUtensils,
  FaLightbulb,
  FaUsers,
  FaFire,
} from "react-icons/fa";
import { useGlobalContext } from "../provider/GlobalProvider";
import { useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import AxiosToastError from "../utils/AxiosToastError";
import { Link } from "react-router-dom";

const AIBudgetPlanner = () => {
  const { fetchCartItems } = useGlobalContext();
  const user = useSelector((state) => state.user);
  const allProducts = useSelector((state) => state.product.allProduct || []);

  const [mode, setMode] = useState("generator"); // 'generator' | 'curated'
  const [budget, setBudget] = useState(600);
  const [days, setDays] = useState(3);
  const [dietary, setDietary] = useState("vegetarian");
  const [familyMembers, setFamilyMembers] = useState(2);
  const [goal, setGoal] = useState("Balanced Diet");
  const [customPreferences, setCustomPreferences] = useState("");

  const [loading, setLoading] = useState(false);
  const [plannedCart, setPlannedCart] = useState(null);
  const [added, setAdded] = useState(false);
  const [saved, setSaved] = useState(false);

  // Curated templates from Admin
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  // Fetch admin curated templates
  const fetchCuratedTemplates = async () => {
    try {
      setLoadingTemplates(true);
      const response = await Axios({
        ...SummaryApi.getGroceryTemplates,
      });
      if (response.data.success) {
        setTemplates(response.data.data || []);
      }
    } catch (err) {
      console.warn("Could not fetch curated templates:", err);
    } finally {
      setLoadingTemplates(false);
    }
  };

  useEffect(() => {
    fetchCuratedTemplates();
  }, []);

  // AI Plan Generation
  const handleGenerateBudgetCart = async () => {
    setLoading(true);
    setAdded(false);
    setSaved(false);

    try {
      const response = await Axios({
        ...SummaryApi.generateAiGroceryPlan,
        data: {
          budget: Number(budget),
          days: Number(days),
          dietary,
          familyMembers: Number(familyMembers),
          goal,
          preferences: customPreferences,
        },
      });

      if (response.data.success && response.data.data) {
        setPlannedCart(response.data.data);
        toast.success(
          `✨ Smart AI created "${response.data.data.title}" under ${DisplayPriceInRupees(budget)}!`
        );
      }
    } catch (error) {
      console.warn("Backend AI error, assembling client fallback:", error);

      // Client fallback assembly
      let pool = allProducts;
      if (dietary === "vegetarian" || dietary === "vegan") {
        pool = allProducts.filter(
          (p) =>
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
            quantity: 1,
            unit: p.unit || "1 Pack",
            price: p.price,
            image: p.image?.[0] || "",
          });
          totalSpent += p.price;
        }
        if (totalSpent >= budget * 0.9) break;
      }

      setPlannedCart({
        title: `${goal} ${days}-Day Smart Pack`,
        description: `Balanced grocery basket for ${familyMembers} person(s) optimized for ${goal.toLowerCase()}.`,
        budget: Number(budget),
        totalPrice: totalSpent,
        savings: Math.max(budget - totalSpent, 0),
        days: Number(days),
        dietary,
        familyMembers: Number(familyMembers),
        goal,
        items: selected,
        mealsBreakdown: [
          {
            mealType: "Breakfast",
            suggestions: ["Wholesome cereal/oats or warm butter toast with milk"],
          },
          {
            mealType: "Lunch & Dinner",
            suggestions: ["Fresh vegetable curry with warm rotis or rice"],
          },
        ],
        tips: [
          `Save ${DisplayPriceInRupees(Math.max(budget - totalSpent, 0))} with this optimized cart bundle!`,
        ],
      });
      toast.success("✨ AI dynamically calculated your smart budget pack!");
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Add Plan to Cart
  const handleAddBudgetCartToCart = async (cartToUse = plannedCart) => {
    if (!cartToUse || !cartToUse.items || cartToUse.items.length === 0) return;

    toast.loading("Adding grocery bundle to your cart...", { id: "add-budget-cart" });
    let addedCount = 0;

    for (const item of cartToUse.items) {
      const prodId = item.productId?._id || item.productId;
      if (prodId) {
        try {
          await Axios({
            ...SummaryApi.addToCart,
            data: { productId: prodId },
          });
          addedCount++;
        } catch (err) {
          console.error("Cart add error for:", item.name);
        }
      }
    }

    // Record conversion metric on backend if plan has _id
    if (cartToUse._id) {
      try {
        await Axios({
          url: `${SummaryApi.useGroceryPlan.url}/${cartToUse._id}`,
          method: SummaryApi.useGroceryPlan.method,
        });
      } catch (e) {
        // Non-blocking
      }
    }

    if (fetchCartItems) {
      await fetchCartItems();
    }

    setAdded(true);
    toast.success(
      `🎉 ${addedCount > 0 ? addedCount : cartToUse.items.length} items added to your cart for 10-minute delivery!`,
      { id: "add-budget-cart" }
    );
  };

  // Save Plan to User's Account
  const handleSavePlan = async () => {
    if (!user?._id) {
      toast.error("Please login to save your grocery plans!");
      return;
    }
    if (!plannedCart) return;

    try {
      const response = await Axios({
        ...SummaryApi.saveGroceryPlan,
        data: {
          ...plannedCart,
          budget: Number(plannedCart.budget),
          totalPrice: Number(plannedCart.totalPrice),
        },
      });

      if (response.data.success) {
        setSaved(true);
        toast.success("💾 Plan saved to your account! View it in 'My Saved Plans'.");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 rounded-3xl p-6 md:p-8 text-white shadow-2xl my-8 relative overflow-hidden border border-emerald-800/40">
      {/* GLOW DECORATIONS */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER WITH MODE SWITCH */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-800/50 pb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5 border border-emerald-500/30">
              <FaMagic className="text-emerald-400" /> Smart AI Grocery Planner
            </span>
            {user?._id && (
              <Link
                to="/dashboard/my-grocery-plans"
                className="text-xs text-emerald-300 hover:text-white underline font-semibold ml-2"
              >
                View Saved Plans →
              </Link>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 bg-gradient-to-r from-white via-emerald-100 to-teal-300 bg-clip-text text-transparent">
            AI-Powered Grocery & Meal Planner
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/70 mt-1">
            Personalized meal plans & balanced grocery baskets optimized for your family budget.
          </p>
        </div>

        {/* TAB TOGGLE: GENERATOR VS CURATED */}
        <div className="flex bg-slate-800/90 p-1 rounded-2xl border border-emerald-700/50 self-start md:self-auto">
          <button
            onClick={() => setMode("generator")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              mode === "generator"
                ? "bg-emerald-500 text-slate-950 shadow-md font-extrabold"
                : "text-emerald-200/80 hover:text-white"
            }`}
          >
            <FaMagic size={11} /> AI Generator
          </button>
          <button
            onClick={() => setMode("curated")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              mode === "curated"
                ? "bg-emerald-500 text-slate-950 shadow-md font-extrabold"
                : "text-emerald-200/80 hover:text-white"
            }`}
          >
            <FaStar size={11} /> Curated Smart Packs ({templates.length})
          </button>
        </div>
      </div>

      {/* =========================================================================
          MODE 1: AI GENERATOR
          ========================================================================= */}
      {mode === "generator" && (
        <div className="relative z-10">
          {/* INPUT FORM GRID */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            <div>
              <label className="text-xs font-bold text-emerald-300 block mb-1">
                Target Budget (₹)
              </label>
              <input
                type="number"
                min={100}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-slate-800/90 border border-emerald-700/50 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-emerald-300 block mb-1">
                Duration (Days)
              </label>
              <select
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-full bg-slate-800/90 border border-emerald-700/50 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-emerald-400"
              >
                <option value="1">1 Day Express</option>
                <option value="3">3 Days Standard</option>
                <option value="5">5 Days Workweek</option>
                <option value="7">7 Days Weekly Pack</option>
                <option value="14">14 Days Fortnight</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-emerald-300 block mb-1">
                Dietary Preference
              </label>
              <select
                value={dietary}
                onChange={(e) => setDietary(e.target.value)}
                className="w-full bg-slate-800/90 border border-emerald-700/50 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-emerald-400"
              >
                <option value="vegetarian">🥗 100% Pure Veg</option>
                <option value="non-vegetarian">🍗 Veg + Chicken/Egg</option>
                <option value="vegan">🌱 Vegan</option>
                <option value="keto">🥑 Keto High-Fat</option>
                <option value="jain">🙏 Jain Friendly</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-emerald-300 block mb-1">
                Family Size
              </label>
              <select
                value={familyMembers}
                onChange={(e) => setFamilyMembers(e.target.value)}
                className="w-full bg-slate-800/90 border border-emerald-700/50 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-emerald-400"
              >
                <option value="1">👤 1 Person (Solo)</option>
                <option value="2">👥 2 People (Couple)</option>
                <option value="4">👨‍👩‍👧‍👦 4 People (Family)</option>
                <option value="6">🏡 6+ People (Large Family)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-emerald-300 block mb-1">
                Health & Budget Goal
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full bg-slate-800/90 border border-emerald-700/50 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-emerald-400"
              >
                <option value="Balanced Diet">Balanced Diet</option>
                <option value="Max Savings">Max Savings</option>
                <option value="High Protein">High Protein</option>
                <option value="Quick & Easy">Quick & Easy (10-min)</option>
                <option value="Family Pack">Family Essentials</option>
              </select>
            </div>
          </div>

          {/* CUSTOM PREFERENCE / NOTES */}
          <div className="mt-3">
            <input
              type="text"
              placeholder="Optional: Mention preferences (e.g. 'extra dairy, no spicy, low sugar, snacks for kids')..."
              value={customPreferences}
              onChange={(e) => setCustomPreferences(e.target.value)}
              className="w-full bg-slate-800/70 border border-emerald-800/40 rounded-xl px-4 py-2 text-xs text-emerald-100 placeholder-emerald-400/40 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <button
            onClick={handleGenerateBudgetCart}
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black py-3.5 rounded-2xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? <FaMagic className="animate-spin" /> : <FaMagic />}
            {loading ? "AI Crafting Optimized Basket..." : "Generate AI Grocery Plan"}
          </button>

          {/* GENERATED RESULT CARD */}
          {plannedCart && (
            <div className="mt-6 bg-slate-800/75 rounded-3xl p-6 border border-emerald-700/40 space-y-6 animate-fade-in shadow-xl">
              {/* PLAN HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/40 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border border-emerald-500/30">
                      {plannedCart.goal || goal}
                    </span>
                    <span className="text-[11px] text-emerald-200/70 font-semibold">
                      {plannedCart.days || days} Days • {plannedCart.familyMembers || familyMembers} Members
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white">
                    {plannedCart.title}
                  </h3>
                  <p className="text-xs text-emerald-200/70 mt-0.5">
                    {plannedCart.description}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-900/80 p-3 rounded-2xl border border-emerald-800/30 text-center">
                  <div>
                    <span className="text-[9px] text-emerald-300/70 uppercase font-bold block">
                      Budget
                    </span>
                    <span className="text-sm font-black text-white">
                      {DisplayPriceInRupees(plannedCart.budget)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-emerald-300/70 uppercase font-bold block">
                      Total
                    </span>
                    <span className="text-sm font-black text-emerald-400">
                      {DisplayPriceInRupees(plannedCart.totalPrice)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-emerald-300/70 uppercase font-bold block">
                      Saved
                    </span>
                    <span className="text-sm font-black text-amber-400">
                      {DisplayPriceInRupees(plannedCart.savings)}
                    </span>
                  </div>
                </div>
              </div>

              {/* ITEMS INCLUDED */}
              <div>
                <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FaShoppingCart /> Selected Grocery Items ({plannedCart.items?.length || 0})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
                  {plannedCart.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/70 p-2.5 rounded-xl border border-emerald-800/30 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-8 h-8 rounded object-cover"
                          />
                        )}
                        <div className="truncate">
                          <p className="font-semibold text-emerald-100 truncate">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-emerald-300/50">
                            Qty: {item.quantity || 1} {item.unit && `• ${item.unit}`}
                          </p>
                        </div>
                      </div>
                      <span className="font-extrabold text-emerald-400 ml-2">
                        {DisplayPriceInRupees((item.price || 0) * (item.quantity || 1))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* MEAL BREAKDOWN & TIPS */}
              {plannedCart.mealsBreakdown && plannedCart.mealsBreakdown.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FaUtensils /> AI Meal Prep Recommendations
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {plannedCart.mealsBreakdown.map((meal, mIdx) => (
                      <div
                        key={mIdx}
                        className="bg-slate-900/50 p-3 rounded-xl border border-amber-900/30"
                      >
                        <span className="text-[10px] font-bold text-amber-400 uppercase">
                          {meal.mealType}
                        </span>
                        <ul className="text-xs text-slate-300 mt-1 space-y-1 list-disc list-inside">
                          {meal.suggestions?.map((s, sIdx) => (
                            <li key={sIdx}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => handleAddBudgetCartToCart(plannedCart)}
                  disabled={added}
                  className={`flex-1 py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                    added
                      ? "bg-emerald-600 text-white"
                      : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20"
                  }`}
                >
                  {added ? <FaCheck /> : <FaShoppingCart />}
                  {added ? "Bundle Added to Cart!" : "1-Click Add Entire Basket to Cart"}
                </button>

                <button
                  onClick={handleSavePlan}
                  disabled={saved}
                  className={`sm:w-56 py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer border ${
                    saved
                      ? "bg-emerald-900/60 border-emerald-600 text-emerald-200"
                      : "bg-slate-800 hover:bg-slate-700 border-emerald-700/60 text-emerald-300"
                  }`}
                >
                  {saved ? <FaCheck /> : <FaBookmark />}
                  {saved ? "Plan Saved" : "Save Plan to Profile"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          MODE 2: ADMIN CURATED SMART PACKS
          ========================================================================= */}
      {mode === "curated" && (
        <div className="mt-6 relative z-10">
          {loadingTemplates ? (
            <div className="py-12 text-center text-emerald-300">
              Loading curated grocery templates...
            </div>
          ) : templates.length === 0 ? (
            <div className="py-12 text-center bg-slate-900/50 rounded-2xl border border-emerald-800/30">
              <p className="text-sm text-emerald-300 font-bold">
                No curated templates published yet.
              </p>
              <p className="text-xs text-emerald-200/50 mt-1">
                You can create templates anytime from the Admin Dashboard!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((tpl) => (
                <div
                  key={tpl._id}
                  className="bg-slate-900/70 border border-emerald-800/40 rounded-2xl p-5 hover:border-emerald-500/50 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border border-emerald-500/30">
                        {tpl.dietary}
                      </span>
                      {tpl.isFeatured && (
                        <span className="text-amber-400 flex items-center gap-1 text-[10px] font-bold">
                          <FaStar size={10} /> Featured Pack
                        </span>
                      )}
                    </div>

                    <h4 className="text-lg font-extrabold text-white">
                      {tpl.title}
                    </h4>
                    <p className="text-xs text-emerald-200/60 mt-1 line-clamp-2">
                      {tpl.description || "Curated balanced grocery essentials pack"}
                    </p>

                    <div className="mt-3 flex items-center gap-2 text-[11px] text-emerald-300/80">
                      <span>⏱️ {tpl.days} Days</span>
                      <span>•</span>
                      <span>👨‍👩‍👧 {tpl.familyMembers} Persons</span>
                      <span>•</span>
                      <span>📦 {tpl.items?.length || 0} Items</span>
                    </div>

                    <div className="my-3 bg-slate-950/60 p-2.5 rounded-xl border border-emerald-900/40 flex items-center justify-between">
                      <span className="text-xs text-emerald-300 font-bold">Total Cost:</span>
                      <span className="text-base font-black text-emerald-400">
                        {DisplayPriceInRupees(tpl.totalPrice)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddBudgetCartToCart(tpl)}
                    className="w-full mt-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
                  >
                    <FaShoppingCart size={12} /> 1-Click Add Pack to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIBudgetPlanner;
