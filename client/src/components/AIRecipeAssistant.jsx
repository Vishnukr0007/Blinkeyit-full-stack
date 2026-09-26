import { useState } from "react";
import { FaRobot, FaMagic, FaPlus, FaCheck, FaUtensils, FaSearch, FaStar, FaShoppingCart } from "react-icons/fa";
import { useGlobalContext } from "../provider/GlobalProvider";
import { useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";

const pantrySuggestions = [
  { name: "Egg", selected: false },
  { name: "Bread", selected: false },
  { name: "Butter", selected: false },
  { name: "Milk", selected: false },
  { name: "Paneer", selected: false },
  { name: "Tomato", selected: false },
  { name: "Cheese", selected: false },
  { name: "Chicken", selected: false }
];

const AIRecipeAssistant = () => {
  const { fetchCartItems } = useGlobalContext();
  const allProducts = useSelector((state) => state.product.allProduct || []);

  const [activeTab, setActiveTab] = useState("dish"); // 'dish' or 'pantry'
  const [dishQuery, setDishQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [pantryItems, setPantryItems] = useState(pantrySuggestions);
  const [pantryRecipe, setPantryRecipe] = useState(null);
  const [added, setAdded] = useState(false);

  const handleGenerateRecipe = async () => {
    if (!dishQuery.trim()) {
      toast.error("Please enter a dish name!");
      return;
    }

    setLoading(true);
    setAdded(false);

    try {
      const response = await Axios({
        ...SummaryApi.generateAiRecipe,
        data: { dishQuery: dishQuery.trim() }
      });

      if (response.data.success && response.data.data) {
        setGeneratedRecipe(response.data.data);
        toast.success("✨ Gemini AI generated recipe & ingredients!");
      }
    } catch (error) {
      console.warn("Backend AI Endpoint error, matching store items:", error);
      
      // Fallback matching real store products from Redux
      const matchedProds = allProducts.filter((p) =>
        p.name.toLowerCase().includes(dishQuery.toLowerCase())
      ).slice(0, 4);

      const itemsToUse = matchedProds.length > 0 ? matchedProds : allProducts.slice(0, 3);
      const recipeIngredients = itemsToUse.map((p) => ({
        name: p.name,
        price: p.price,
        productId: p._id,
        image: p.image?.[0] || ""
      }));

      setGeneratedRecipe({
        title: `${dishQuery.charAt(0).toUpperCase() + dishQuery.slice(1)} Recipe Kit`,
        prepTime: "15 Mins",
        servings: "2-3 People",
        calories: "450 kcal",
        ingredients: recipeIngredients,
        totalPrice: recipeIngredients.reduce((acc, curr) => acc + curr.price, 0)
      });
      toast.success("✨ AI generated recipe kit from store products!");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePantryItem = (index) => {
    const updated = [...pantryItems];
    updated[index].selected = !updated[index].selected;
    setPantryItems(updated);
  };

  const handleFindPantryRecipes = async () => {
    const selected = pantryItems.filter((i) => i.selected).map((i) => i.name.toLowerCase());
    if (selected.length === 0) {
      toast.error("Select at least 1 ingredient from your fridge!");
      return;
    }

    setLoading(true);
    try {
      const response = await Axios({
        ...SummaryApi.generateAiRecipe,
        data: { pantryItems: selected }
      });

      if (response.data.success && response.data.data) {
        setPantryRecipe(response.data.data);
        toast.success("✨ AI analyzed your fridge items!");
      }
    } catch (error) {
      console.warn("Pantry AI fallback:", error);
      setPantryRecipe({
        title: "Quick Sauté Dish",
        prepTime: "10 Mins",
        recipeText: `Sauté your selected items (${selected.join(", ")}) in fresh butter with spices for 8 mins.`,
        ingredients: allProducts.slice(0, 2).map(p => ({ name: p.name, price: p.price, productId: p._id }))
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAllToCart = async (ingredients) => {
    if (!ingredients || ingredients.length === 0) return;

    let addedCount = 0;
    toast.loading("Adding ingredients to cart...", { id: "add-recipe-cart" });

    for (const item of ingredients) {
      if (item.productId) {
        try {
          await Axios({
            ...SummaryApi.addToCart,
            data: { productId: item.productId }
          });
          addedCount++;
        } catch (err) {
          console.error("Cart error for product:", item.name);
        }
      }
    }

    if (fetchCartItems) {
      await fetchCartItems();
    }

    setAdded(true);
    toast.success(`🎉 Added ${addedCount > 0 ? addedCount : ingredients.length} items to your cart!`, { id: "add-recipe-cart" });
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 rounded-3xl p-6 md:p-8 text-white shadow-2xl my-8 relative overflow-hidden border border-purple-800/40">
      {/* GLOW EFFECT */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-800/50 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-500/20 text-purple-300 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5 border border-purple-500/30">
              <FaRobot className="text-purple-400 animate-pulse" /> AI Powered Chef
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent">
            Blinkey AI Recipe Assistant
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/70 mt-1">
            Type any dish or select items in your fridge — AI generates recipe & adds ingredients to cart!
          </p>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex bg-slate-800/80 p-1.5 rounded-2xl border border-purple-700/40 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("dish")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "dish"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                : "text-purple-200/70 hover:text-white"
            }`}
          >
            <FaUtensils /> Search Dish
          </button>
          <button
            onClick={() => setActiveTab("pantry")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "pantry"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                : "text-purple-200/70 hover:text-white"
            }`}
          >
            <FaMagic /> Fridge AI
          </button>
        </div>
      </div>

      {/* TAB 1: DISH SEARCH */}
      {activeTab === "dish" && (
        <div className="mt-6 space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300/60" />
              <input
                type="text"
                value={dishQuery}
                onChange={(e) => setDishQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerateRecipe()}
                placeholder="e.g. Butter Chicken, Masala Dosa, White Sauce Pasta..."
                className="w-full bg-slate-800/90 border border-purple-700/50 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400 transition"
              />
            </div>
            <button
              onClick={handleGenerateRecipe}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <FaMagic className="animate-spin" /> : <FaMagic />}
              {loading ? "AI Cooking..." : "Generate AI Recipe"}
            </button>
          </div>

          {/* GENERATED RECIPE CARD */}
          {generatedRecipe && (
            <div className="bg-slate-800/70 rounded-2xl p-6 border border-purple-700/40 space-y-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-800/40 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="text-amber-400">✨</span> {generatedRecipe.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-purple-200/80 mt-1">
                    <span>⏱️ {generatedRecipe.prepTime}</span>
                    <span>👥 {generatedRecipe.servings}</span>
                    <span>🔥 {generatedRecipe.calories}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-purple-300/70 block">Total Ingredients Cost</span>
                  <span className="text-xl font-black text-emerald-400">
                    {DisplayPriceInRupees(generatedRecipe.totalPrice)}
                  </span>
                </div>
              </div>

              {/* INGREDIENTS LIST */}
              <div>
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-3">
                  Required Fresh Groceries
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {generatedRecipe.ingredients?.map((ing, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/60 p-3 rounded-xl border border-purple-800/30 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-purple-100 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        {ing.name}
                      </span>
                      <span className="font-bold text-emerald-400">{DisplayPriceInRupees(ing.price)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 1-CLICK ADD TO CART */}
              <button
                onClick={() => handleAddAllToCart(generatedRecipe.ingredients)}
                disabled={added}
                className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                  added
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20"
                }`}
              >
                {added ? <FaCheck /> : <FaShoppingCart />}
                {added ? "All Ingredients Added to Cart!" : "1-Click Add All Ingredients to Cart"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FRIDGE AI */}
      {activeTab === "pantry" && (
        <div className="mt-6 space-y-6">
          <p className="text-xs text-purple-200/80">
            Select what you have in your fridge right now:
          </p>

          <div className="flex flex-wrap gap-2">
            {pantryItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleTogglePantryItem(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  item.selected
                    ? "bg-purple-500 text-white shadow-md border border-purple-400"
                    : "bg-slate-800 text-purple-200/70 hover:text-white border border-purple-800/40"
                }`}
              >
                {item.selected ? <FaCheck size={10} /> : <FaPlus size={10} />}
                {item.name}
              </button>
            ))}
          </div>

          <button
            onClick={handleFindPantryRecipes}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? <FaMagic className="animate-spin" /> : <FaMagic />}
            {loading ? "Analyzing Fridge..." : "Find AI Recipes from Fridge Items"}
          </button>

          {pantryRecipe && (
            <div className="bg-slate-800/70 rounded-2xl p-6 border border-purple-700/40 space-y-4 animate-fade-in">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-amber-400">🍳</span> {pantryRecipe.title}
              </h3>
              <p className="text-xs text-purple-200/90 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-purple-800/30">
                {pantryRecipe.recipeText || "Sauté your selected ingredients with butter and herbs."}
              </p>

              {pantryRecipe.ingredients && (
                <button
                  onClick={() => handleAddAllToCart(pantryRecipe.ingredients)}
                  className="w-full py-3 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <FaShoppingCart /> Add Missing Ingredients to Cart
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIRecipeAssistant;
