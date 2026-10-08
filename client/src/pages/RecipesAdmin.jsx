import { useEffect, useState } from "react";
import UploadRecipeModal from "../components/UploadRecipeModal";
import EditRecipeModal from "../components/EditRecipeModal";
import Loading from "../components/Loading";
import NoData from "../components/NoData";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { FaEdit, FaTrash, FaUtensils, FaPlus, FaClock } from "react-icons/fa";
import ConfirmBox from "../components/ConfirmBox";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";

const RecipesAdmin = () => {
  const [openUpload, setOpenUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteData, setDeleteData] = useState(null);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getRecipe,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        setRecipes(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleDelete = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteRecipe,
        data: {
          _id: deleteData._id,
        },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        setOpenConfirmDelete(false);
        fetchRecipes();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="bg-white min-h-[80vh] rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* HEADER BAR */}
      <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-50/50 to-white">
        <div>
          <div className="flex items-center gap-2">
            <FaUtensils className="text-amber-600" size={18} />
            <h2 className="font-extrabold text-xl text-gray-900">
              Manage Recipe Kits
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Add, edit, or remove 1-click meal recipe kits available on the store.
          </p>
        </div>

        <button
          onClick={() => setOpenUpload(true)}
          className="bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <FaPlus size={12} /> Add Recipe Kit
        </button>
      </div>

      {/* CONTENT BODY */}
      {loading && recipes.length === 0 ? (
        <div className="p-10 flex justify-center items-center">
          <Loading />
        </div>
      ) : recipes.length === 0 ? (
        <div className="p-10">
          <NoData text="No Recipe Kits found. Click 'Add Recipe Kit' to create your first one!" />
        </div>
      ) : (
        <div className="p-4 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-left text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3 border-b">Dish Image</th>
                <th className="px-4 py-3 border-b">Recipe Title</th>
                <th className="px-4 py-3 border-b">Time & Tag</th>
                <th className="px-4 py-3 border-b">Ingredients</th>
                <th className="px-4 py-3 border-b">Price</th>
                <th className="px-4 py-3 border-b">Status</th>
                <th className="px-4 py-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recipes.map((item, index) => (
                <tr
                  key={item._id || index}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  {/* IMAGE */}
                  <td className="px-4 py-3">
                    <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaUtensils className="text-gray-300" size={20} />
                      )}
                    </div>
                  </td>

                  {/* TITLE & DESCRIPTION */}
                  <td className="px-4 py-3 max-w-xs">
                    <p className="font-bold text-sm text-gray-900 line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                      {item.description || "No description provided"}
                    </p>
                  </td>

                  {/* TIME & TAG */}
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs text-gray-700 font-medium bg-gray-100 px-2 py-0.5 rounded-md mb-1">
                      <FaClock size={10} className="text-amber-500" /> {item.time}
                    </span>
                    {item.tag && (
                      <div className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded inline-block">
                        {item.tag}
                      </div>
                    )}
                  </td>

                  {/* INGREDIENTS */}
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold text-gray-700">
                      {item.ingredients?.length || 0} Items Included
                    </span>
                  </td>

                  {/* PRICE */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-sm text-gray-900">
                        {DisplayPriceInRupees(item.price)}
                      </span>
                      {item.originalPrice > item.price && (
                        <span className="text-[11px] text-gray-400 line-through">
                          {DisplayPriceInRupees(item.originalPrice)}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        item.publish
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {item.publish ? "Published" : "Draft"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => {
                          setEditData(item);
                          setOpenEdit(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 rounded-lg transition-colors cursor-pointer"
                        title="Edit Recipe Kit"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteData(item);
                          setOpenConfirmDelete(true);
                        }}
                        className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg transition-colors cursor-pointer"
                        title="Delete Recipe Kit"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* UPLOAD MODAL */}
      {openUpload && (
        <UploadRecipeModal
          fetchData={fetchRecipes}
          close={() => setOpenUpload(false)}
        />
      )}

      {/* EDIT MODAL */}
      {openEdit && (
        <EditRecipeModal
          editData={editData}
          fetchData={fetchRecipes}
          close={() => setOpenEdit(false)}
        />
      )}

      {/* CONFIRM DELETE MODAL */}
      {openConfirmDelete && (
        <ConfirmBox
          close={() => setOpenConfirmDelete(false)}
          cancel={() => setOpenConfirmDelete(false)}
          confirm={handleDelete}
          title="Delete Recipe Kit?"
          description={`Are you sure you want to remove "${deleteData?.title}"? This cannot be undone.`}
        />
      )}
    </section>
  );
};

export default RecipesAdmin;
