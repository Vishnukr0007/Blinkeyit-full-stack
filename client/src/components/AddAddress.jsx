import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { useState } from "react";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { useGlobalContext } from "../provider/GlobalProvider";

const AddAddress = ({ close, onSubmitAddress }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [addressType, setAddressType] = useState("Home");
  const {fetchAddress}=useGlobalContext();

  const STATES = [
    "Kerala",
    "Tamil Nadu",
    "Karnataka",
    "Andhra Pradesh",
    "Telangana",
    "Maharashtra",
  ];

  const onSubmit = async (data) => {
    try {
      const payload = {
        fullName: data.fullName,
        address_line: `${data.house}, ${data.area}`,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        country: "India", // ✅ forced because select is disabled
        mobile: data.phone,
        addressType,
      };

      const response = await Axios({
        ...SummaryApi.createAddress,
        data: payload,
      });

      const { data: responseData } = response;

      if (responseData?.success) {
        toast.success(responseData.message || "Address added");
        onSubmitAddress?.(responseData.data);
        reset();
        close(); // ✅ close modal
        fetchAddress()
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-lg max-h-[90vh] flex flex-col animate-slideUp">

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b sticky top-0 bg-white z-10">
          <h2 className="text-base font-semibold">Add New Address</h2>
          <button className="cursor-pointer" onClick={close}>
            <IoClose size={22} />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-4 space-y-3"
        >
          {/* FULL NAME */}
          <div>
            <label className="text-xs font-medium text-gray-600">Full Name</label>
            <input
              {...register("fullName", { required: "Name is required" })}
              className="input"
              placeholder="Enter your name"
            />
            {errors.fullName && (
              <p className="error">{errors.fullName.message}</p>
            )}
          </div>

          {/* PHONE */}
          <div>
            <label className="text-xs font-medium text-gray-600">
              Phone Number
            </label>
            <input
              {...register("phone", {
                required: "Phone number required",
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: "Enter valid 10-digit number",
                },
              })}
              className="input"
              placeholder="10-digit mobile number"
            />
            {errors.phone && <p className="error">{errors.phone.message}</p>}
          </div>

          {/* HOUSE */}
          <div>
            <label className="text-xs font-medium text-gray-600">
              House / Flat / Floor
            </label>
            <input
              {...register("house", { required: "House details required" })}
              className="input"
              placeholder="House No, Flat, Floor"
            />
          </div>

          {/* AREA */}
          <div>
            <label className="text-xs font-medium text-gray-600">
              Area / Locality
            </label>
            <input
              {...register("area", { required: "Area required" })}
              className="input"
              placeholder="Apartment, Road, Area"
            />
          </div>

          {/* CITY & PIN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              {...register("city", { required: "City required" })}
              className="input"
              placeholder="City"
            />
            <input
              {...register("pincode", {
                required: "Pincode required",
                minLength: { value: 6, message: "Invalid pincode" },
              })}
              className="input"
              placeholder="Pincode"
            />
          </div>

          {/* STATE */}
          <div>
            <label className="text-xs font-medium text-gray-600">State</label>
            <select
              {...register("state", { required: "State is required" })}
              className="input"
            >
              <option value="">Select State</option>
              {STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors.state && <p className="error">{errors.state.message}</p>}
          </div>

          {/* ADDRESS TYPE */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              Address Type
            </label>
            <div className="flex gap-3">
              {["Home", "Work"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setAddressType(type)}
                  className={`px-4 py-2 border rounded-full text-sm ${
                    addressType === type
                      ? "border-green-700 text-green-700 bg-green-50"
                      : "hover:border-green-600"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* SUBMIT */}
          <button
            disabled={isSubmitting}
            className="w-full bg-yellow-300 hover:bg-yellow-400 cursor-pointer text-white py-3 rounded-xl text-sm font-semibold"
          >
            {isSubmitting ? "Saving..." : "Save Address"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddAddress;
