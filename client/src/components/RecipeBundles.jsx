import { useState } from "react";
import { FaClock, FaFire, FaUtensils, FaPlus, FaCheck } from "react-icons/fa";
import { useGlobalContext } from "../provider/GlobalProvider";
import { useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";

const sampleRecipes = [
  {
    id: "recipe-1",
    title: "Paneer Butter Masala Kit",
    time: "15 mins",
    difficulty: "Easy",
    servings: "2-3 People",
    tag: "Trending Dinner",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80",
    description: "Rich, creamy cottage cheese curry in tomato gravy. All fresh ingredients included!",
    originalPrice: 280,
    price: 220,
    ingredientsCount: 4,
    ingredients: [
      "Fresh Amul Paneer 200g",
      "Amul Butter 100g",
      "Amul Fresh Cream 250ml",
      "Chef Special Garam Masala 50g"
    ]
  },
  {
    id: "recipe-2",
    title: "Creamy Italian White Sauce Pasta",
    time: "12 mins",
    difficulty: "Quick",
    servings: "2 People",
    tag: "Bestseller",
    image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281898?auto=format&fit=crop&w=600&q=80",
    description: "Cheesy penne pasta with garlic butter, mixed herbs, and rich mozzarella.",
    originalPrice: 240,
    price: 185,
    ingredientsCount: 4,
    ingredients: [
      "Penne Pasta 500g",
      "Processed Cheese Block 200g",
      "Amul Butter 100g",
      "Oregano & Chilli Flakes Combo"
    ]
  },
  {
    id: "recipe-3",
    title: "Instant Cafe-Style Cold Coffee",
    time: "5 mins",
    difficulty: "Super Fast",
    servings: "2 Glasses",
    tag: "Summer Refresh",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80",
    description: "Frothy thick chilled coffee topped with chocolate syrup and vanilla ice cream.",
    originalPrice: 160,
    price: 125,
    ingredientsCount: 3,
    ingredients: [
      "Full Cream Milk 1L",
      "Nescafe Classic Coffee 50g",
      "Hershey's Chocolate Syrup 200g"
    ]
  }
];

const RecipeBundles = () => {
  const { fetchCartItems } = useGlobalContext();
  const allProducts = useSelector((state) => state.product.allProduct || []);
  const [addingId, setAddingId] = useState(null);
  const [addedIds, setAddedIds] = useState([]);

  const handleAddBundleToCart = async (recipe) => {
    try {
      setAddingId(recipe.id);

      // Find matching products in store or add symbolic bundle items
      let addedCount = 0;
      for (const ingredientName of recipe.ingredients) {
        // Try to match product by name or grab available product
        const matchedProduct = allProducts.find((p) =>
          p.name.toLowerCase().includes(ingredientName.split(" ")[0].toLowerCase())
        ) || allProducts[addedCount % (allProducts.length || 1)];

        if (matchedProduct?._id) {
          await Axios({
            ...SummaryApi.addToCart,
            data: { productId: matchedProduct._id }
          });
          addedCount++;
        }
      }

      toast.success(`🎉 Added all ingredients for ${recipe.title} to cart!`);
      setAddedIds((prev) => [...prev, recipe.id]);
      fetchCartItems?.();
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <section className="my-8 container mx-auto px-4 sm:px-6 lg:px-8">
      {/* HEADER TITLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
              <FaUtensils size={10} /> 1-Click Cooking
            </span>
            <span className="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded font-semibold">
              ⚡ 10 Min Delivery
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1">
            Cook in 15 Minutes — <span className="text-green-700">Recipe Kits</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            One click adds all fresh ingredients straight into your shopping bag.
          </p>
        </div>
      </div>

      {/* RECIPE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sampleRecipes.map((recipe) => {
          const isAdded = addedIds.includes(recipe.id);
          const isAdding = addingId === recipe.id;

          return (
            <div
              key={recipe.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group relative"
            >
              {/* IMAGE HEADER */}
              <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                <span className="absolute top-3 left-3 bg-green-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                  {recipe.tag}
                </span>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <span className="flex items-center gap-1 font-medium bg-black/40 backdrop-blur-md px-2 py-1 rounded-md">
                    <FaClock className="text-amber-400" /> {recipe.time}
                  </span>
                  <span className="flex items-center gap-1 font-medium bg-black/40 backdrop-blur-md px-2 py-1 rounded-md">
                    <FaFire className="text-orange-400" /> {recipe.difficulty}
                  </span>
                </div>
              </div>

              {/* CARD BODY */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base text-gray-900 group-hover:text-green-700 transition-colors">
                    {recipe.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {recipe.description}
                  </p>

                  {/* INGREDIENTS LIST PREVIEW */}
                  <div className="mt-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Ingredients Included ({recipe.ingredientsCount})</span>
                      <span className="text-green-600 font-semibold lowercase">fresh</span>
                    </p>
                    <ul className="grid grid-cols-2 gap-1 text-[11px] text-gray-600">
                      {recipe.ingredients.map((item, idx) => (
                        <li key={idx} className="truncate flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* FOOTER & BUTTON */}
                <div className="mt-4 pt-3 border-t flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-extrabold text-gray-900">
                        {DisplayPriceInRupees(recipe.price)}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        {DisplayPriceInRupees(recipe.originalPrice)}
                      </span>
                    </div>
                    <p className="text-[10px] text-green-700 font-semibold">
                      Save {DisplayPriceInRupees(recipe.originalPrice - recipe.price)}
                    </p>
                  </div>

                  <button
                    onClick={() => handleAddBundleToCart(recipe)}
                    disabled={isAdding}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer ${
                      isAdded
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-green-700 text-white hover:bg-green-800 hover:shadow-md"
                    }`}
                  >
                    {isAdding ? (
                      <span className="animate-pulse">Adding Kit...</span>
                    ) : isAdded ? (
                      <>
                        <FaCheck size={12} /> Added to Bag
                      </>
                    ) : (
                      <>
                        <FaPlus size={10} /> Add All Items
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RecipeBundles;
