import { useState } from "react";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [data, setData] = useState({
    email: ""
   
  });

  const navigate = useNavigate();

  // Validate if all fields are filled
  const isFormValid = Object.values(data).every((el) => el.trim() !== "");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.forgot_password,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
      } else if (response.data.success) {
        toast.success(response.data.message);
        navigate("/verification-otp",{
          state:data
        });
        setData({ email: "" });
        
      }

      console.log("response", response);
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="w-full container mx-auto px-4 flex justify-center items-center ">
      <div className="bg-white my-4 w-full max-w-md shadow-lg rounded-2xl p-6">
       
         <p className="font-semibold text-lg mb-5">Forgotpassword</p>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="grid">
            <label className="text-gray-700 font-medium" htmlFor="email">
              Email
            </label>
            <input
            type="email"
            placeholder="Enter your email"
            id="email"
            name="email"
            className="border rounded-lg p-2 focus:outline-none  focus:border-yellow-500"
            value={data.email}
            onChange={handleChange}
            />

          </div>

         
          {/* Login Button */}
          <button
            disabled={!isFormValid}
            className={`${
              isFormValid ? "bg-green-800 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
            } text-white py-2 rounded-lg transition-all`}
          >
            send OTP
          </button>
        </form>

        <p className="text-center mt-3">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-green-800">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ForgotPassword;
