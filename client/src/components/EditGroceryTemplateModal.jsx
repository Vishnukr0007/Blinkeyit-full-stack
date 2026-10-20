import { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaTrash, FaCheck, FaEdit } from "react-icons/fa";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { useSelector } from "react-redux";

const EditGroceryTemplateModal = ({ close, fetchData, editData }) => {
  const allProducts = useSelector((state) => state.product.allProduct || []);

  const [data, setData] = useState({
    title: editData?.title || "",
    description: editData?.description || "",
    budget: editData?.budget || 500,
    days: editData?.days || 3,
    dietary: editData?.dietary || "vegetarian",
    familyMembers: editData?.familyMembers || 2,
    goal: editData?.goal || "Balanced Diet",
    isFeatured: Boolean(editData?.isFeatured),
    publish: Boolean(editData?.publish),
    items: editData?.items || [],
    mealsBreakdown: editData?.mealsBreakdown || [],
    tips: editData?.tips || [],
    tags: editData?.tags || [],
  });

  const [tagInput, setTagInput] = useState("");
  const [tipInput, setTipInput] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredProducts = allProducts.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  ).slice(0, 8);

  const handleAddItemFromStore = (product) => {
    if (data.items.some((i) => (i.productId?._id || i.productId) === product._id)) {
      toast.error("Item already added");
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
      toast.error("Please provide a title");
      return;
    }
    if (data.items.length === 0) {
      toast.error("Please add at least 1 grocery item");
      return;
    }

    try {
      setLoading(true);
      const response = await Axios({
        url: `${SummaryApi.adminUpdateGroceryPlan.url}/${editData._id}`,
        method: SummaryApi.adminUpdateGroceryPlan.method,
        data: {
          ...data,
          budget: Number(data.budget),
          days: Number(data.days),
          familyMembers: Number(data.familyMembers),
        },
      });

      if (response.data.success) {
        toast.success(response.data.message || "Plan updated successfully!");
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
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-500/20">
              <FaEdit size={16} />
            </span>
            <div>
              <h2 className="font-extrabold text-lg sm:text-xl text-gray-900">
                Edit Smart Grocery Plan
              </h2>
              <p className="text-xs text-gray-500">
                Modify pricing, items, duration, and publishing state
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Plan Title *
              </label>
              <input
                type="text"
                required
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={data.description}
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-800 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                Budget (₹) *
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
                <option value={1}>1 Day</option>
                <option value={3}>3 Days</option>
                <option value={5}>5 Days</option>
                <option value={7}>7 Days</option>
                <option value={14}>14 Days</option>
                <option value={30}>30 Days</option>
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
                Inventory Items
              </label>
              <span className="text-xs font-extrabold text-blue-700">
                {data.items.length} items (Total: ₹{calculatedTotal})
              </span>
            </div>

            <input
              type="text"
              placeholder="Search store inventory to add more items..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 mb-2 focus:bg-white focus:border-blue-500"
            />

            {filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 max-h-36 overflow-y-auto p-1 bg-gray-50 rounded-xl border border-gray-100">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod._id}
                    className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200 text-xs"
                  >
                    <div className="truncate max-w-[170px]">
                      <p className="font-bold text-gray-800 truncate">
                        {prod.name}
                      </p>
                      <p className="text-[10px] text-gray-500">₹{prod.price}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddItemFromStore(prod)}
                      className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {data.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-blue-50/40 rounded-xl border border-blue-100 text-xs"
                >
                  <span className="font-bold text-gray-800 truncate max-w-[200px]">
                    {item.name}
                  </span>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2 py-0.5">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(idx, -1)}
                        className="font-bold text-gray-600 hover:text-black cursor-pointer px-1"
                      >
                        -
                      </button>
                      <span className="font-bold text-blue-800">
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

                    <span className="font-extrabold text-blue-800 w-14 text-right">
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
          </div>

          {/* TOGGLES */}
          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
              <input
                type="checkbox"
                checked={data.isFeatured}
                onChange={(e) =>
                  setData({ ...data, isFeatured: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded"
              />
              ⭐ Featured Template
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
              <input
                type="checkbox"
                checked={data.publish}
                onChange={(e) =>
                  setData({ ...data, publish: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded"
              />
              ✅ Published (Visible to users)
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold py-3.5 rounded-2xl shadow-lg shadow-blue-600/20 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <FaCheck /> {loading ? "Updating..." : "Save Plan Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGroceryTemplateModal;
