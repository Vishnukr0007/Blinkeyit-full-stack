import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaPlus, FaTrash } from "react-icons/fa";
import uploadImage from "../utils/UploadImage.js";
import SummaryApi from "../common/SummaryApi.js";
import Axios from "../utils/Axios.js";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError.js";

const EditRecipeModal = ({ editData, close, fetchData }) => {
  const [data, setData] = useState({
    _id: editData?._id || "",
    title: editData?.title || "",
    description: editData?.description || "",
    image: editData?.image || "",
    time: editData?.time || "15 mins",
    difficulty: editData?.difficulty || "Easy",
    servings: editData?.servings || "2-3 People",
    tag: editData?.tag || "Trending Kit",
    price: editData?.price ?? "",
    originalPrice: editData?.originalPrice ?? "",
    ingredients: editData?.ingredients?.length ? editData.ingredients : [""],
    publish: editData?.publish ?? true,
  });

  const [loading, setLoading] = useState(false);

  const handleOnChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleIngredientChange = (index, value) => {
    const updated = [...data.ingredients];
    updated[index] = value;
    setData((prev) => ({ ...prev, ingredients: updated }));
  };

  const addIngredientField = () => {
    setData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ""],
    }));
  };

  const removeIngredientField = (index) => {
    const updated = data.ingredients.filter((_, i) => i !== index);
    setData((prev) => ({
      ...prev,
      ingredients: updated.length ? updated : [""],
    }));
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const response = await uploadImage(file);
      const { data: ImageResponse } = response;
      if (ImageResponse.success) {
        setData((prev) => ({
          ...prev,
          image: ImageResponse.data.url,
        }));
        toast.success("Image updated successfully!");
      }
    } catch (error) {
      console.error("Recipe Image upload failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.title || data.price === "" || !data.image) {
      toast.error("Title, Image and Price are required fields");
      return;
    }

    const cleanedIngredients = data.ingredients.filter(
      (item) => item.trim() !== ""
    );

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.updateRecipe,
        data: {
          ...data,
          ingredients: cleanedIngredients,
        },
      });

      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        close();
        fetchData();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fixed top-0 left-0 bottom-0 right-0 z-50 bg-neutral-800/60 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white max-w-xl w-full p-6 rounded-2xl shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b mb-4">
          <div>
            <h1 className="font-extrabold text-xl text-gray-900">
              Edit Recipe Kit ✏️
            </h1>
            <p className="text-xs text-gray-500">
              Update details, ingredients or pricing for this recipe kit
            </p>
          </div>
          <button
            onClick={close}
            className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            <IoClose size={26} />
          </button>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          {/* TITLE & TAG */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 grid gap-1">
              <label className="text-xs font-bold text-gray-700 uppercase">
                Recipe Title *
              </label>
              <input
                type="text"
                value={data.title}
                name="title"
                onChange={handleOnChange}
                required
                className="bg-gray-50 p-2.5 border border-gray-200 outline-none focus:border-green-600 rounded-xl text-sm"
              />
            </div>
            <div className="grid gap-1">
              <label className="text-xs font-bold text-gray-700 uppercase">
                Badge / Tag
              </label>
              <input
                type="text"
                value={data.tag}
                name="tag"
                onChange={handleOnChange}
                className="bg-gray-50 p-2.5 border border-gray-200 outline-none focus:border-green-600 rounded-xl text-sm"
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="grid gap-1">
            <label className="text-xs font-bold text-gray-700 uppercase">
              Description
            </label>
            <textarea
              value={data.description}
              name="description"
              rows={2}
              onChange={handleOnChange}
              className="bg-gray-50 p-2.5 border border-gray-200 outline-none focus:border-green-600 rounded-xl text-sm resize-none"
            />
          </div>

          {/* COOK TIME, DIFFICULTY, SERVINGS */}
          <div className="grid grid-cols-3 gap-3">
            <div className="grid gap-1">
              <label className="text-xs font-bold text-gray-700 uppercase">
                Prep Time
              </label>
              <input
                type="text"
                value={data.time}
                name="time"
                onChange={handleOnChange}
                className="bg-gray-50 p-2 border border-gray-200 outline-none focus:border-green-600 rounded-xl text-sm"
              />
            </div>
            <div className="grid gap-1">
              <label className="text-xs font-bold text-gray-700 uppercase">
                Difficulty
              </label>
              <select
                name="difficulty"
                value={data.difficulty}
                onChange={handleOnChange}
                className="bg-gray-50 p-2 border border-gray-200 outline-none focus:border-green-600 rounded-xl text-sm"
              >
                <option value="Super Fast">Super Fast</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Chef Level">Chef Level</option>
              </select>
            </div>
            <div className="grid gap-1">
              <label className="text-xs font-bold text-gray-700 uppercase">
                Servings
              </label>
              <input
                type="text"
                value={data.servings}
                name="servings"
                onChange={handleOnChange}
                className="bg-gray-50 p-2 border border-gray-200 outline-none focus:border-green-600 rounded-xl text-sm"
              />
            </div>
          </div>

          {/* PRICING */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1">
              <label className="text-xs font-bold text-gray-700 uppercase">
                Offer Price (₹) *
              </label>
              <input
                type="number"
                value={data.price}
                name="price"
                onChange={handleOnChange}
                required
                className="bg-gray-50 p-2.5 border border-gray-200 outline-none focus:border-green-600 rounded-xl text-sm font-semibold"
              />
            </div>
            <div className="grid gap-1">
              <label className="text-xs font-bold text-gray-700 uppercase">
                Original Price (₹)
              </label>
              <input
                type="number"
                value={data.originalPrice}
                name="originalPrice"
                onChange={handleOnChange}
                className="bg-gray-50 p-2.5 border border-gray-200 outline-none focus:border-green-600 rounded-xl text-sm"
              />
            </div>
          </div>

          {/* DYNAMIC INGREDIENTS LIST */}
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700 uppercase">
                Included Ingredients List
              </label>
              <button
                type="button"
                onClick={addIngredientField}
                className="text-xs text-green-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <FaPlus size={10} /> Add Item
              </button>
            </div>
            {data.ingredients.map((ing, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={ing}
                  onChange={(e) => handleIngredientChange(idx, e.target.value)}
                  className="bg-gray-50 p-2 border border-gray-200 outline-none focus:border-green-600 rounded-xl text-sm flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeIngredientField(idx)}
                  className="text-red-400 hover:text-red-600 p-2"
                  title="Remove Ingredient"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* IMAGE UPLOAD */}
          <div className="grid gap-2">
            <label className="text-xs font-bold text-gray-700 uppercase">
              Recipe Cover Image *
            </label>
            <div className="flex gap-4 items-center">
              <div className="bg-gray-100 h-24 w-28 border border-dashed border-gray-300 flex items-center justify-center rounded-xl overflow-hidden relative">
                {data.image ? (
                  <img
                    src={data.image}
                    alt="Recipe preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] text-gray-400 text-center px-2">
                    Upload Banner
                  </span>
                )}
              </div>
              <label htmlFor="editRecipeImg" className="flex-1">
                <div className="px-4 py-2.5 rounded-xl border border-green-600 text-green-700 font-bold text-xs text-center cursor-pointer hover:bg-green-50 transition-all">
                  {loading ? "Uploading Image..." : "Change Dish Photo"}
                </div>
                <input
                  type="file"
                  id="editRecipeImg"
                  className="hidden"
                  accept="image/*"
                  onChange={handleUploadImage}
                />
              </label>
            </div>
          </div>

          {/* PUBLISH TOGGLE */}
          <div className="flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              id="editPublish"
              name="publish"
              checked={data.publish}
              onChange={handleOnChange}
              className="w-4 h-4 accent-green-600 cursor-pointer"
            />
            <label
              htmlFor="editPublish"
              className="text-xs font-semibold text-gray-700 cursor-pointer"
            >
              Publish directly to home page
            </label>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading || !data.title || data.price === "" || !data.image}
            className={`mt-3 py-3 rounded-xl font-extrabold text-sm transition-all shadow-md ${
              loading || !data.title || data.price === "" || !data.image
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-800 text-white cursor-pointer active:scale-98"
            }`}
          >
            {loading ? "Updating Recipe..." : "Save Recipe Changes"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditRecipeModal;
