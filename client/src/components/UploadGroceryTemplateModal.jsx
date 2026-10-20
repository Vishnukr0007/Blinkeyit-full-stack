import { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaTrash, FaMagic, FaCheck } from "react-icons/fa";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { useSelector } from "react-redux";

const UploadGroceryTemplateModal = ({ close, fetchData }) => {
  const allProducts = useSelector((state) => state.product.allProduct || []);

  const [data, setData] = useState({
    title: "",
    description: "",
    budget: 599,
    days: 3,
    dietary: "vegetarian",
    familyMembers: 2,
    goal: "Balanced Diet",
    isFeatured: true,
    publish: true,
    items: [],
    mealsBreakdown: [
      {
        mealType: "Breakfast",
        suggestions: ["Warm oats or multi-grain toast with butter"],
      },
      {
        mealType: "Lunch & Dinner",
        suggestions: ["Fresh seasonal sabzi with roti and dal"],
      },
      {
        mealType: "Healthy Snacks",
        suggestions: ["Roasted dry fruits or fruit salad"],
      },
    ],
    tips: [
      "Blinkeyit delivers fresh in 10 minutes - order produce in right quantities.",
    ],
    tags: ["Chef Curated", "Best Value"],
  });

  const [tagInput, setTagInput] = useState("");
  const [tipInput, setTipInput] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Search filtered products
  const filteredProducts = allProducts.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  ).slice(0, 8);

  const handleAddItemFromStore = (product) => {
    // Check if already in items
    if (data.items.some((i) => i.productId === product._id)) {
      toast.error("Item already added to this template");
      return;
    }

    const newItem = {
      productId: product._id,
      name: product.name,
      category: product.category?.[0]?.name || "Groceries",
      quantity: 1,
      unit: product.unit || "1 Pack",
      price: product.price,
      image: product.image?.[0] || "",
    };

    setData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const handleRemoveItem = (index) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== index),
    }));
  };

  const handleQuantityChange = (index, delta) => {
    setData((prev) => {
      const updated = [...prev.items];
      const newQty = Math.max(1, (updated[index].quantity || 1) + delta);
      updated[index] = { ...updated[index], quantity: newQty };
      return { ...prev, items: updated };
    });
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (!data.tags.includes(tagInput.trim())) {
      setData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove) => {
    setData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  const handleAddTip = () => {
    if (!tipInput.trim()) return;
    setData((prev) => ({
      ...prev,
      tips: [...prev.tips, tipInput.trim()],
    }));
    setTipInput("");
  };

  const handleRemoveTip = (index) => {
    setData((prev) => ({
      ...prev,
      tips: prev.tips.filter((_, idx) => idx !== index),
    }));
  };

  const calculatedTotal = data.items.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.title.trim()) {
      toast.error("Please provide a template title");
      return;
    }
    if (data.items.length === 0) {
      toast.error("Please add at least 1 grocery item");
      return;
    }

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.adminCreateGroceryTemplate,
        data: {
          ...data,
          budget: Number(data.budget),
          days: Number(data.days),
          familyMembers: Number(data.familyMembers),
        },
      });

      if (response.data.success) {
        toast.success(response.data.message || "Template created successfully!");
        if (fetchData) fetchData();
        close();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-auto border border-gray-100 flex flex-col max-h-[92vh]">
        {/* HEADER */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-500/20">
              <FaMagic size={16} />
            </span>
            <div>
              <h2 className="font-extrabold text-lg sm:text-xl text-gray-900">
                Create Smart Grocery Plan Template
              </h2>
              <p className="text-xs text-gray-500">
                Curate a pre-built smart grocery pack for all Blinkeyit users
              </p>
            </div>
          </div>
          <button
            onClick={close}
            className="text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* FORM BODY */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* TITLE & DESCRIPTION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Template Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 7-Day High Protein Muscle Pack or Weekly Veg Family Saver"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Description
              </label>
              <textarea
                rows={2}
                placeholder="Brief summary of why this grocery pack is great for users..."
                value={data.description}
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          {/* PARAMETERS: BUDGET, DAYS, DIETARY, GOAL */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                Target Budget (₹) *
              </label>
              <input
                type="number"
                required
                min={100}
                value={data.budget}
                onChange={(e) => setData({ ...data, budget: e.target.value })}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-gray-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                Duration (Days)
              </label>
              <select
                value={data.days}
                onChange={(e) => setData({ ...data, days: e.target.value })}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-gray-800"
              >
                <option value={1}>1 Day (Express)</option>
                <option value={3}>3 Days</option>
                <option value={5}>5 Days (Workweek)</option>
                <option value={7}>7 Days (Weekly)</option>
                <option value={14}>14 Days (Fortnight)</option>
                <option value={30}>30 Days (Monthly)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                Dietary Type
              </label>
              <select
                value={data.dietary}
                onChange={(e) => setData({ ...data, dietary: e.target.value })}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-gray-800"
              >
                <option value="vegetarian">🥗 Vegetarian</option>
                <option value="non-vegetarian">🍗 Non-Vegetarian</option>
                <option value="vegan">🌱 Vegan</option>
                <option value="keto">🥑 Keto</option>
                <option value="jain">🙏 Jain Friendly</option>
                <option value="all">🍱 All Inclusive</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                Goal / Theme
              </label>
              <select
                value={data.goal}
                onChange={(e) => setData({ ...data, goal: e.target.value })}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-gray-800"
              >
                <option value="Balanced Diet">Balanced Diet</option>
                <option value="Max Savings">Max Savings</option>
                <option value="High Protein">High Protein</option>
                <option value="Quick & Easy">Quick & Easy</option>
                <option value="Family Pack">Family Pack</option>
                <option value="Immunity Boost">Immunity Boost</option>
              </select>
            </div>
          </div>

          {/* STORE PRODUCTS SELECTOR */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-gray-700 uppercase">
                Add Items from Store Inventory
              </label>
              <span className="text-xs font-extrabold text-emerald-700">
                {data.items.length} items added (Sum: ₹{calculatedTotal})
              </span>
            </div>

            <input
              type="text"
              placeholder="Search store inventory to add products (e.g. Milk, Rice, Bread, Eggs)..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 mb-2 focus:bg-white focus:border-emerald-500"
            />

            {/* PRODUCT SUGGESTION CHIPS */}
            {filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 max-h-40 overflow-y-auto p-1 bg-gray-50/60 rounded-xl border border-gray-100">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod._id}
                    className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200 shadow-xs"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {prod.image?.[0] ? (
                        <img
                          src={prod.image[0]}
                          alt={prod.name}
                          className="w-8 h-8 rounded object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-100 rounded" />
                      )}
                      <div className="text-left">
                        <p className="text-xs font-bold text-gray-800 truncate max-w-[150px]">
                          {prod.name}
                        </p>
                        <p className="text-[10px] text-gray-500 font-semibold">
                          ₹{prod.price} {prod.unit && `• ${prod.unit}`}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddItemFromStore(prod)}
                      className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-md font-bold transition cursor-pointer flex items-center gap-1"
                    >
                      <FaPlus size={9} /> Add
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* ADDED ITEMS LIST */}
            {data.items.length === 0 ? (
              <p className="text-xs text-gray-400 italic text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                No items added yet. Search above to assemble this curated grocery pack.
              </p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {data.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-7 h-7 rounded object-cover"
                        />
                      )}
                      <div>
                        <span className="font-bold text-gray-800">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-gray-500 ml-2">
                          (₹{item.price} each)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2 py-0.5">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(idx, -1)}
                          className="font-bold text-gray-600 hover:text-black cursor-pointer px-1"
                        >
                          -
                        </button>
                        <span className="font-bold text-emerald-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(idx, 1)}
                          className="font-bold text-gray-600 hover:text-black cursor-pointer px-1"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-extrabold text-emerald-700 w-14 text-right">
                        ₹{item.price * item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TAGS & TIPS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Badges & Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="e.g. Budget Saver, Top Choice"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-gray-800 text-white px-3 py-1 rounded-lg text-xs font-bold cursor-pointer"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {data.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-600 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Money Saving & Freshness Tips
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Add a pro grocery tip..."
                  value={tipInput}
                  onChange={(e) => setTipInput(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddTip}
                  className="bg-gray-800 text-white px-3 py-1 rounded-lg text-xs font-bold cursor-pointer"
                >
                  Add
                </button>
              </div>
              <div className="space-y-1">
                {data.tips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-[11px] text-gray-600 bg-gray-50 p-1.5 rounded"
                  >
                    <span className="truncate">{tip}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTip(idx)}
                      className="text-red-500 hover:text-red-700 ml-2 cursor-pointer font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TOGGLES: FEATURED & PUBLISH */}
          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
              <input
                type="checkbox"
                checked={data.isFeatured}
                onChange={(e) =>
                  setData({ ...data, isFeatured: e.target.checked })
                }
                className="w-4 h-4 text-emerald-600 rounded"
              />
              ⭐ Mark as Featured Template (Shown in Top Hero Carousel)
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
              <input
                type="checkbox"
                checked={data.publish}
                onChange={(e) =>
                  setData({ ...data, publish: e.target.checked })
                }
                className="w-4 h-4 text-emerald-600 rounded"
              />
              ✅ Publish Immediately for All Users
            </label>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold py-3.5 rounded-2xl shadow-lg shadow-emerald-600/20 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <FaCheck /> {loading ? "Publishing Template..." : "Create Curated Smart Pack"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadGroceryTemplateModal;
