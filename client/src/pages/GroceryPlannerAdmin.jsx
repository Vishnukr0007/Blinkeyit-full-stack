import { useEffect, useState } from "react";
import UploadGroceryTemplateModal from "../components/UploadGroceryTemplateModal";
import EditGroceryTemplateModal from "../components/EditGroceryTemplateModal";
import Loading from "../components/Loading";
import NoData from "../components/NoData";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import ConfirmBox from "../components/ConfirmBox";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import {
  FaMagic,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaRegStar,
  FaShoppingCart,
  FaSearch,
  FaChartPie,
  FaFilter,
} from "react-icons/fa";

const GroceryPlannerAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState("template"); // 'template' | 'user'
  const [search, setSearch] = useState("");
  const [dietaryFilter, setDietaryFilter] = useState("all");

  const [openUpload, setOpenUpload] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteData, setDeleteData] = useState(null);

  // Fetch admin stats
  const fetchStats = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.adminGetGroceryStats,
      });
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Stats fetch error:", error);
    }
  };

  // Fetch all plans with filters
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        url: SummaryApi.adminGetAllGroceryPlans.url,
        method: SummaryApi.adminGetAllGroceryPlans.method,
        params: {
          type: activeTab,
          search,
          dietary: dietaryFilter !== "all" ? dietaryFilter : undefined,
        },
      });

      if (response.data.success) {
        setPlans(response.data.data.plans || []);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [activeTab, dietaryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPlans();
  };

  // Toggle publish
  const handleTogglePublish = async (plan) => {
    try {
      const response = await Axios({
        url: `${SummaryApi.adminTogglePublishGroceryPlan.url}/${plan._id}`,
        method: SummaryApi.adminTogglePublishGroceryPlan.method,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchPlans();
        fetchStats();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  // Toggle featured
  const handleToggleFeatured = async (plan) => {
    try {
      const response = await Axios({
        url: `${SummaryApi.adminToggleFeaturedGroceryPlan.url}/${plan._id}`,
        method: SummaryApi.adminToggleFeaturedGroceryPlan.method,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchPlans();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  // Delete plan
  const handleDeletePlan = async () => {
    try {
      const response = await Axios({
        url: `${SummaryApi.adminDeleteGroceryPlan.url}/${deleteData._id}`,
        method: SummaryApi.adminDeleteGroceryPlan.method,
      });
      if (response.data.success) {
        toast.success(response.data.message || "Plan deleted successfully");
        setOpenConfirmDelete(false);
        fetchPlans();
        fetchStats();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="bg-white min-h-[85vh] rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* TOP HEADER */}
      <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-white">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-600/20">
              <FaMagic size={18} />
            </span>
            <h2 className="font-extrabold text-xl text-gray-900 tracking-tight">
              Smart AI Grocery Planner Maintenance
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Curate smart grocery templates, manage user meal plans, and analyze basket conversion metrics.
          </p>
        </div>

        <button
          onClick={() => setOpenUpload(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer self-start md:self-auto"
        >
          <FaPlus size={12} /> Add Curated Smart Pack
        </button>
      </div>

      {/* ANALYTICS STATS BAR */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-5 bg-gray-50/60 border-b border-gray-100">
        <div className="bg-white p-4 rounded-xl border border-gray-200/70 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
            Total Plans
          </span>
          <p className="text-2xl font-black text-gray-900 mt-1">
            {stats?.totalPlans ?? "--"}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
            {stats?.totalTemplates ?? 0} Curated Templates
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/70 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
            Active Templates
          </span>
          <p className="text-2xl font-black text-emerald-700 mt-1">
            {stats?.activeTemplates ?? "--"}
          </p>
          <span className="text-[11px] text-gray-500 font-semibold mt-0.5 block">
            Live on Store
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/70 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
            Cart Conversions
          </span>
          <p className="text-2xl font-black text-blue-700 mt-1 flex items-center gap-2">
            <FaShoppingCart size={18} /> {stats?.totalConversions ?? 0}
          </p>
          <span className="text-[11px] text-blue-600 font-semibold mt-0.5 block">
            Added to Cart by Users
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/70 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
            Avg Target Budget
          </span>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {DisplayPriceInRupees(stats?.avgBudget || 0)}
          </p>
          <span className="text-[11px] text-gray-500 font-semibold mt-0.5 block">
            Per Planned Basket
          </span>
        </div>
      </div>

      {/* FILTER & TAB BAR */}
      <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white">
        {/* TAB BUTTONS */}
        <div className="flex bg-gray-100 p-1 rounded-xl self-start">
          <button
            onClick={() => setActiveTab("template")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === "template"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Curated Smart Templates ({stats?.totalTemplates || 0})
          </button>
          <button
            onClick={() => setActiveTab("user")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === "user"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            User Generated Plans ({stats?.totalUserPlans || 0})
          </button>
        </div>

        {/* SEARCH & DIETARY FILTER */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={dietaryFilter}
            onChange={(e) => setDietaryFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 rounded-xl px-3 py-2 cursor-pointer focus:outline-none"
          >
            <option value="all">All Diets</option>
            <option value="vegetarian">🥗 Veg</option>
            <option value="non-vegetarian">🍗 Non-Veg</option>
            <option value="vegan">🌱 Vegan</option>
            <option value="keto">🥑 Keto</option>
            <option value="jain">🙏 Jain</option>
          </select>

          <form onSubmit={handleSearchSubmit} className="flex items-center gap-1">
            <input
              type="text"
              placeholder="Search plans by title or goal..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-xs text-gray-800 rounded-xl px-3 py-2 w-48 sm:w-60 focus:outline-none focus:bg-white focus:border-emerald-500"
            />
            <button
              type="submit"
              className="bg-gray-800 hover:bg-black text-white p-2 rounded-xl text-xs cursor-pointer transition"
            >
              <FaSearch size={12} />
            </button>
          </form>
        </div>
      </div>

      {/* TABLE DATA */}
      {loading ? (
        <div className="p-12 flex justify-center items-center">
          <Loading />
        </div>
      ) : plans.length === 0 ? (
        <div className="p-10">
          <NoData text="No grocery plans found matching your criteria." />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-left text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3 border-b">Plan Title & Details</th>
                <th className="px-4 py-3 border-b">Theme & Diet</th>
                <th className="px-4 py-3 border-b">Budget & Cost</th>
                <th className="px-4 py-3 border-b">Items Included</th>
                <th className="px-4 py-3 border-b">Conversions</th>
                <th className="px-4 py-3 border-b">Status</th>
                <th className="px-4 py-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {plans.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  {/* TITLE & DESCRIPTION */}
                  <td className="px-4 py-3 max-w-xs">
                    <div className="flex items-center gap-2">
                      {item.isFeatured && (
                        <span className="text-amber-500" title="Featured Template">
                          <FaStar size={13} />
                        </span>
                      )}
                      <p className="font-bold text-sm text-gray-900 truncate">
                        {item.title}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                      {item.description || "No description provided"}
                    </p>
                    {item.userId && (
                      <span className="text-[10px] text-gray-400 block mt-0.5">
                        By: {item.userId?.name || item.userId?.email || "User"}
                      </span>
                    )}
                  </td>

                  {/* THEME & DIET */}
                  <td className="px-4 py-3">
                    <span className="inline-block bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase mr-1">
                      {item.dietary}
                    </span>
                    <span className="inline-block bg-gray-100 text-gray-700 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                      {item.days} Days • {item.goal}
                    </span>
                  </td>

                  {/* BUDGET & COST */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-black text-sm text-emerald-700">
                        {DisplayPriceInRupees(item.totalPrice)}
                      </span>
                      <span className="text-[11px] text-gray-400 font-semibold">
                        Budget: {DisplayPriceInRupees(item.budget)}
                      </span>
                    </div>
                  </td>

                  {/* ITEMS INCLUDED */}
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
                      {item.items?.length || 0} Grocery Items
                    </span>
                  </td>

                  {/* CONVERSIONS */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                      <FaShoppingCart size={11} />
                      <span>{item.usedCount || 0} Carts</span>
                    </div>
                  </td>

                  {/* STATUS TOGGLE */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTogglePublish(item)}
                        title={item.publish ? "Click to Unpublish" : "Click to Publish"}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase flex items-center gap-1 cursor-pointer transition ${
                          item.publish
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {item.publish ? <FaCheckCircle size={10} /> : <FaTimesCircle size={10} />}
                        {item.publish ? "Published" : "Draft"}
                      </button>

                      {item.isTemplate && (
                        <button
                          onClick={() => handleToggleFeatured(item)}
                          title={item.isFeatured ? "Unmark Featured" : "Mark Featured"}
                          className={`p-1.5 rounded-lg cursor-pointer transition ${
                            item.isFeatured
                              ? "text-amber-500 bg-amber-50 hover:bg-amber-100"
                              : "text-gray-400 bg-gray-50 hover:bg-gray-100"
                          }`}
                        >
                          {item.isFeatured ? <FaStar size={13} /> : <FaRegStar size={13} />}
                        </button>
                      )}
                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setEditData(item);
                          setOpenEdit(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 rounded-lg transition-colors cursor-pointer"
                        title="Edit Plan / Template"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteData(item);
                          setOpenConfirmDelete(true);
                        }}
                        className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg transition-colors cursor-pointer"
                        title="Delete Plan"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE TEMPLATE MODAL */}
      {openUpload && (
        <UploadGroceryTemplateModal
          fetchData={() => {
            fetchPlans();
            fetchStats();
          }}
          close={() => setOpenUpload(false)}
        />
      )}

      {/* EDIT MODAL */}
      {openEdit && (
        <EditGroceryTemplateModal
          editData={editData}
          fetchData={() => {
            fetchPlans();
            fetchStats();
          }}
          close={() => {
            setOpenEdit(false);
            setEditData(null);
          }}
        />
      )}

      {/* CONFIRM DELETE MODAL */}
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

export default GroceryPlannerAdmin;
