import { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import Loading from "../components/Loading";
import NoData from "../components/NoData";
import ConfirmBox from "../components/ConfirmBox";
import { useGlobalContext } from "../provider/GlobalProvider";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import {
  FaMagic,
  FaShoppingCart,
  FaTrash,
  FaCalendarAlt,
  FaUtensils,
  FaLightbulb,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const MyGroceryPlans = () => {
  const { fetchCartItems } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [expandedPlanId, setExpandedPlanId] = useState(null);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [addingPlanId, setAddingPlanId] = useState(null);

  const fetchMyPlans = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getMyGroceryPlans,
      });
      if (response.data.success) {
        setPlans(response.data.data || []);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPlans();
  }, []);

  const toggleExpand = (id) => {
    setExpandedPlanId((prev) => (prev === id ? null : id));
  };

  // 1-Click Add Entire Plan to Cart
  const handleAddPlanToCart = async (plan) => {
    if (!plan.items || plan.items.length === 0) return;

    try {
      setAddingPlanId(plan._id);
      toast.loading("Adding smart grocery bundle to cart...", { id: "cart-add" });

      let addedCount = 0;
      for (const item of plan.items) {
        const prodId = item.productId?._id || item.productId;
        if (prodId) {
          try {
            await Axios({
              ...SummaryApi.addToCart,
              data: { productId: prodId },
            });
            addedCount++;
          } catch (e) {
            console.error("Cart item error:", item.name);
          }
        }
      }

      // Record conversion on backend
      try {
        await Axios({
          url: `${SummaryApi.useGroceryPlan.url}/${plan._id}`,
          method: SummaryApi.useGroceryPlan.method,
        });
      } catch (e) {
        // Non-blocking
      }

      if (fetchCartItems) {
        await fetchCartItems();
      }

      toast.success(
        `🎉 ${addedCount > 0 ? addedCount : plan.items.length} items added to your Blinkeyit cart!`,
        { id: "cart-add" }
      );
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setAddingPlanId(null);
    }
  };

  // Delete Plan
  const handleDeletePlan = async () => {
    try {
      const response = await Axios({
        url: `${SummaryApi.deleteGroceryPlan.url}/${deleteTargetId}`,
        method: SummaryApi.deleteGroceryPlan.method,
      });

      if (response.data.success) {
        toast.success(response.data.message || "Plan removed");
        setOpenConfirmDelete(false);
        fetchMyPlans();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="bg-white min-h-[80vh] rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-600/20">
              <FaMagic size={18} />
            </span>
            <h1 className="font-extrabold text-xl sm:text-2xl text-gray-900 tracking-tight">
              My Saved Grocery Plans
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Your personalized AI meal and grocery lists ready for 1-click 10-minute delivery.
          </p>
        </div>

        <Link
          to="/"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <FaMagic size={12} /> Generate New AI Plan
        </Link>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="py-16 flex justify-center items-center">
          <Loading />
        </div>
      ) : plans.length === 0 ? (
        <div className="py-12 text-center">
          <NoData text="You haven't saved any Smart Grocery Plans yet. Generate an AI plan or choose a curated template from the Home page!" />
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-4 bg-emerald-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md hover:bg-emerald-700 transition"
          >
            <FaMagic /> Try Smart AI Grocery Planner
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {plans.map((plan) => {
            const isExpanded = expandedPlanId === plan._id;
            const isAdding = addingPlanId === plan._id;

            return (
              <div
                key={plan._id}
                className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition overflow-hidden"
              >
                {/* SUMMARY ROW */}
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md">
                        {plan.dietary}
                      </span>
                      <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <FaCalendarAlt size={10} /> {plan.days} Days
                      </span>
                      <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {plan.goal}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base sm:text-lg text-gray-900">
                      {plan.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      {plan.description || "Custom AI grocery bundle"}
                    </p>
                  </div>

                  {/* PRICE & ACTIONS */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-right pr-2">
                      <span className="text-[10px] text-gray-400 block font-bold uppercase">
                        Bundle Total
                      </span>
                      <span className="font-black text-lg text-emerald-700">
                        {DisplayPriceInRupees(plan.totalPrice)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddPlanToCart(plan)}
                      disabled={isAdding}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <FaShoppingCart size={13} />
                      {isAdding ? "Adding..." : "1-Click Add to Cart"}
                    </button>

                    <button
                      onClick={() => toggleExpand(plan._id)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1"
                      title={isExpanded ? "Collapse" : "View Items & Meals"}
                    >
                      {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                    </button>

                    <button
                      onClick={() => {
                        setDeleteTargetId(plan._id);
                        setOpenConfirmDelete(true);
                      }}
                      className="text-red-500 hover:text-red-700 p-2.5 hover:bg-red-50 rounded-xl transition cursor-pointer"
                      title="Delete saved plan"
                    >
                      <FaTrash size={13} />
                    </button>
                  </div>
                </div>

                {/* EXPANDABLE DETAILS BODY */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 bg-gray-50/70 border-t border-gray-100 space-y-4 animate-fade-in">
                    {/* ITEMS LIST */}
                    <div>
                      <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <FaShoppingCart className="text-emerald-600" /> Planned Items ({plan.items?.length || 0})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {plan.items?.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-gray-200/80 text-xs shadow-2xs"
                          >
                            <div className="flex items-center gap-2 truncate">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-8 h-8 rounded object-cover"
                                />
                              ) : (
                                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center font-bold text-gray-400">
                                  {idx + 1}
                                </div>
                              )}
                              <div className="truncate">
                                <p className="font-bold text-gray-800 truncate">
                                  {item.name}
                                </p>
                                <p className="text-[10px] text-gray-400">
                                  Qty: {item.quantity || 1} • {item.unit || "Pack"}
                                </p>
                              </div>
                            </div>
                            <span className="font-extrabold text-emerald-700 ml-2">
                              ₹{(item.price || 0) * (item.quantity || 1)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* MEAL BREAKDOWN */}
                    {plan.mealsBreakdown && plan.mealsBreakdown.length > 0 && (
                      <div>
                        <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <FaUtensils className="text-amber-500" /> Meal Breakdown & Recipes
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {plan.mealsBreakdown.map((meal, mIdx) => (
                            <div
                              key={mIdx}
                              className="bg-white p-3 rounded-xl border border-amber-100 shadow-2xs"
                            >
                              <span className="text-[11px] font-extrabold text-amber-800 block uppercase">
                                {meal.mealType}
                              </span>
                              <ul className="text-xs text-gray-600 mt-1 space-y-1 list-disc list-inside">
                                {meal.suggestions?.map((s, sIdx) => (
                                  <li key={sIdx} className="line-clamp-2">
                                    {s}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TIPS */}
                    {plan.tips && plan.tips.length > 0 && (
                      <div>
                        <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <FaLightbulb className="text-teal-600" /> Money Saving & Freshness Tips
                        </h4>
                        <div className="space-y-1">
                          {plan.tips.map((tip, tIdx) => (
                            <div
                              key={tIdx}
                              className="text-xs text-gray-600 bg-white p-2 rounded-lg border border-teal-100"
                            >
                              💡 {tip}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* CONFIRM DELETE */}
      {openConfirmDelete && (
        <ConfirmBox
          cancel={() => setOpenConfirmDelete(false)}
          confirm={handleDeletePlan}
          close={() => setOpenConfirmDelete(false)}
        />
      )}
    </section>
  );
};

export default MyGroceryPlans;
