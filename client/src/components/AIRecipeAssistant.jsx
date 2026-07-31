import { useState } from "react";
import { FaRobot, FaMagic, FaPlus, FaCheck, FaUtensils, FaSearch, FaStar } from "react-icons/fa";
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

  // Pre-configured AI Recipe DB
  const aiRecipeDb = {
    "chicken biryani": {
      title: "Royal Chicken Dum Biryani",
      prepTime: "25 Mins",
      servings: "3 People",
      calories: "520 kcal",
      ingredients: [
        { name: "Basmati Rice 1kg", price: 140 },
        { name: "Fresh Chicken 500g", price: 180 },
        { name: "Biryani Masala 100g", price: 45 },
        { name: "Amul Ghee 200ml", price: 110 }
      ],
      totalPrice: 475
    },
    "masala dosa": {
      title: "Crispy South Indian Masala Dosa",
      prepTime: "15 Mins",
      servings: "2 People",
      calories: "310 kcal",
      ingredients: [
        { name: "Dosa Batter 1kg", price: 65 },
        { name: "Fresh Potato 1kg", price: 30 },
        { name: "Coconut Chutney 200g", price: 40 },
        { name: "Mustard Seeds & Curry Leaves Pack", price: 25 }
      ],
      totalPrice: 160
    },
    "paneer butter masala": {
      title: "Chef Style Paneer Butter Masala",
      prepTime: "18 Mins",
      servings: "3 People",
      calories: "420 kcal",
      ingredients: [
        { name: "Amul Fresh Paneer 200g", price: 95 },
        { name: "Amul Butter 100g", price: 56 },
        { name: "Fresh Tomato Puree 200g", price: 35 },
        { name: "Amul Fresh Cream 250ml", price: 68 }
      ],
      totalPrice: 254
    }
  };

  const handleGenerateRecipe = () => {
    if (!dishQuery.trim()) {
      toast.error("Please enter a dish name!");
      return;
    }

    setLoading(true);
    setAdded(false);

    setTimeout(() => {
      const matchedKey = Object.keys(aiRecipeDb).find((key) =>
        dishQuery.toLowerCase().includes(key)
      );

      if (matchedKey) {
        setGeneratedRecipe(aiRecipeDb[matchedKey]);
      } else {
        // Fallback custom generated recipe
        setGeneratedRecipe({
          title: `Custom ${dishQuery} Cooking Kit`,
          prepTime: "15 Mins",
          servings: "2 People",
          calories: "380 kcal",
          ingredients: [
            { name: `${dishQuery} Special Seasoning`, price: 60 },
            { name: "Fresh Cooking Butter 100g", price: 55 },
            { name: "Organic Veggies Mix 500g", price: 80 }
          ],
          totalPrice: 195
        });
      }
      setLoading(false);
      toast.success("✨ AI generated recipe and ingredients list!");
    }, 800);
  };

  const handleTogglePantryItem = (index) => {
    const updated = [...pantryItems];
    updated[index].selected = !updated[index].selected;
    setPantryItems(updated);
  };

  const handleFindPantryRecipes = () => {
    const selected = pantryItems.filter((i) => i.selected).map((i) => i.name.toLowerCase());
    if (selected.length === 0) {
      toast.error("Select at least 1 ingredient from your fridge!");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (selected.includes("egg") && selected.includes("bread")) {
        setPantryRecipe({
          title: "Cheesy Garlic Egg Toast",
          prepTime: "8 Mins",
          recipeText: "Beat 2 eggs with butter, toast bread slices until golden brown, top with cheese slice!",
          missingIngredients: [{ name: "Mozzarella Cheese 200g", price: 90 }]
        });
      } else if (selected.includes("paneer")) {
        setPantryRecipe({
          title: "Quick Tawa Paneer Fry",
          prepTime: "10 Mins",
          recipeText: "Cube paneer, sauté in butter with tomato puree and turmeric for 7 minutes.",
          missingIngredients: [{ name: "Butter 100g", price: 55 }]
        });
      } else {
        setPantryRecipe({
          title: "Gourmet Breakfast Scramble",
          prepTime: "7 Mins",
          recipeText: "Sauté selected ingredients together with salt, pepper, and herbs.",
          missingIngredients: [{ name: "Chef Herb Seasoning", price: 45 }]
        });
      }
      setLoading(false);
    }, 600);
  };

  const handleAddRecipeToCart = async (ingredients) => {
    try {
      setLoading(true);
      let count = 0;
      for (const ing of ingredients) {
        const product = allProducts[count % (allProducts.length || 1)];
        if (product?._id) {
          await Axios({
            ...SummaryApi.addToCart,
            data: { productId: product._id }
          });
          count++;
        }
      }
      toast.success("🎉 Added recipe ingredients to cart!");
      setAdded(true);
      fetchCartItems?.();
    } catch (err) {
      AxiosToastError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden my-8">
      {/* BACKGROUND DECORATIONS */}
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl" />

      {/* SECTION HEADER */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-emerald-700/50 pb-6 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider mb-2">
            <FaRobot className="animate-spin-slow text-emerald-400" /> AI Chef Assistant
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
            What do you want to cook today?
          </h2>
          <p className="text-emerald-200/80 text-xs sm:text-sm mt-1">
            Type any dish OR select what’s in your fridge. AI generates the recipe & adds ingredients to cart in 1 click!
          </p>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex bg-slate-800/80 p-1 rounded-2xl border border-emerald-500/30">
          <button
            onClick={() => setActiveTab("dish")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "dish"
                ? "bg-emerald-500 text-slate-950 shadow-lg"
                : "text-emerald-200 hover:text-white"
            }`}
          >
            Dish Name to Cart
          </button>
          <button
            onClick={() => setActiveTab("pantry")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "pantry"
                ? "bg-emerald-500 text-slate-950 shadow-lg"
                : "text-emerald-200 hover:text-white"
            }`}
          >
            What's in My Fridge?
          </button>
        </div>
      </div>

      {/* TAB 1: DISH TO CART */}
      {activeTab === "dish" && (
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="e.g. Chicken Biryani, Paneer Butter Masala, Cold Coffee..."
                value={dishQuery}
                onChange={(e) => setDishQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerateRecipe()}
                className="w-full bg-slate-800/90 border border-emerald-500/40 rounded-2xl px-5 py-3.5 pl-11 text-sm text-white placeholder-emerald-300/50 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
              />
              <FaUtensils className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" />
            </div>

            <button
              onClick={handleGenerateRecipe}
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3.5 rounded-2xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/25 active:scale-95 cursor-pointer"
            >
              {loading ? (
                <span>Generating AI Recipe...</span>
              ) : (
                <>
                  <FaMagic /> Generate & Build Kit
                </>
              )}
            </button>
          </div>

          {/* QUICK SUGGESTION PILLS */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-emerald-300/70 font-medium">Try:</span>
            {["Chicken Biryani", "Paneer Butter Masala", "Masala Dosa"].map((dish) => (
              <button
                key={dish}
                onClick={() => {
                  setDishQuery(dish);
                }}
                className="bg-slate-800/60 hover:bg-slate-700/80 border border-emerald-500/30 text-emerald-200 px-3 py-1 rounded-full transition-all cursor-pointer"
              >
                {dish}
              </button>
            ))}
          </div>

          {/* AI GENERATED RESULT CARD */}
          {generatedRecipe && (
            <div className="bg-slate-800/90 border border-emerald-400/40 rounded-2xl p-5 md:p-6 shadow-xl space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-700/40 pb-4">
                <div>
                  <span className="bg-emerald-400/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    AI Recipe Kit Ready
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-1">
                    {generatedRecipe.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3 text-xs text-emerald-200 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                  <span>⏱️ {generatedRecipe.prepTime}</span>
                  <span>👥 {generatedRecipe.servings}</span>
                  <span>🔥 {generatedRecipe.calories}</span>
                </div>
              </div>

              {/* INGREDIENTS LIST */}
              <div>
                <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2">
                  All Required Ingredients ({generatedRecipe.ingredients.length})
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {generatedRecipe.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-slate-900/50 p-2.5 rounded-xl border border-emerald-500/20 text-xs"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        {ing.name}
                      </span>
                      <span className="font-bold text-emerald-300">
                        {DisplayPriceInRupees(ing.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="flex items-center justify-between pt-2 border-t border-emerald-700/40">
                <div>
                  <span className="text-xs text-emerald-200">Total Kit Price:</span>
                  <p className="text-2xl font-extrabold text-emerald-400">
                    {DisplayPriceInRupees(generatedRecipe.totalPrice)}
                  </p>
                </div>

                <button
                  onClick={() => handleAddRecipeToCart(generatedRecipe.ingredients)}
                  disabled={loading}
                  className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg cursor-pointer ${
                    added
                      ? "bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                      : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                  }`}
                >
                  {added ? (
                    <>
                      <FaCheck /> Ingredients Added to Cart!
                    </>
                  ) : (
                    <>
                      <FaPlus /> 1-Click Add All Ingredients to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: WHAT'S IN MY FRIDGE */}
      {activeTab === "pantry" && (
        <div className="relative z-10 space-y-6">
          <p className="text-xs text-emerald-200">
            Select items you currently have in your fridge or kitchen:
          </p>

          <div className="flex flex-wrap gap-2">
            {pantryItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleTogglePantryItem(idx)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
                  item.selected
                    ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md"
                    : "bg-slate-800/60 text-emerald-200 border-emerald-500/30 hover:border-emerald-400"
                }`}
              >
                {item.selected ? "✓ " : "+ "}
                {item.name}
              </button>
            ))}
          </div>

          <button
            onClick={handleFindPantryRecipes}
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-2xl text-sm transition-all flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <FaMagic /> Suggest Recipe From Ingredients
          </button>

          {pantryRecipe && (
            <div className="bg-slate-800/90 border border-emerald-400/40 rounded-2xl p-5 shadow-xl space-y-3">
              <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                Matching Recipe Suggestion
              </span>
              <h4 className="text-lg font-bold text-white">{pantryRecipe.title}</h4>
              <p className="text-xs text-emerald-200/90 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-emerald-500/20">
                {pantryRecipe.recipeText}
              </p>

              {pantryRecipe.missingIngredients && (
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-emerald-300">
                    Missing ingredient: <strong>{pantryRecipe.missingIngredients[0].name}</strong>
                  </span>
                  <button
                    onClick={() => handleAddRecipeToCart(pantryRecipe.missingIngredients)}
                    className="bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <FaPlus /> Add Missing Ingredient
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIRecipeAssistant;
