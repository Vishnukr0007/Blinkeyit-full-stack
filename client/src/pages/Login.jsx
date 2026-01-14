import { useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useNavigate } from "react-router-dom";
import fetchUserDetails from "../utils/fetchUserDetails";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";
const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch=useDispatch()

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
        ...SummaryApi.login,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
      } else if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("accesstoken",response.data.data.accesstoken)
        localStorage.setItem("refreshtoken",response.data.data.refreshtoken)
        const userDetails =await fetchUserDetails()
         dispatch(setUserDetails(userDetails.data))

         
        setData({ email: "", password: "" });
        navigate("/");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="w-full container mx-auto px-4 flex justify-center items-center ">
      <div className="bg-white my-4 w-full max-w-md shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Indias Last Minute App
        </h2>

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

          {/* Password Field */}
          <div className="grid">
            <label className="text-gray-700 font-medium" htmlFor="password">
              Password
            </label>
            <div className="flex items-center border rounded-lg p-2  focus-within:border-yellow-500">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                id="password"
                name="password"
                className="w-full focus:outline-none"
                value={data.password}
                onChange={handleChange}
              />
              <div
                onClick={() => setShowPassword((prev) => !prev)}
                className="cursor-pointer text-gray-600 ml-2"
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
          </div>
          <Link to={"/forgot-password"} className="block ml-auto hover:text-yellow-500 underline">Forgot Password ?</Link>

          {/* Login Button */}
          <button
            disabled={!isFormValid}
            className={`${
              isFormValid ? "bg-green-800 hover:bg-green-700 cursor-pointer" : "bg-gray-400 cursor-not-allowed"
            } text-white py-2 rounded-lg transition-all`}
          >
            Login
          </button>
        </form>

        <p className="text-center mt-3">
          Don t have an account?{" "}
          <Link to="/register" className="font-semibold text-green-800">
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
