import { useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useNavigate, useLocation } from "react-router-dom";
import fetchUserDetails from "../utils/fetchUserDetails";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";
import ButtonLoader from "../components/ButtonLoader";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const isFormValid = Boolean(data.email.trim() && data.password.trim());

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.login,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message || "Invalid credentials");
      } else if (response.data.success) {
        toast.success(response.data.message || "Logged in successfully!");
        if (response.data.data?.accesstoken) {
          localStorage.setItem("accesstoken", response.data.data.accesstoken);
        }
        if (response.data.data?.refreshtoken) {
          localStorage.setItem("refreshtoken", response.data.data.refreshtoken);
        }

        const userDetails = await fetchUserDetails();
        if (userDetails?.data) {
          dispatch(setUserDetails(userDetails.data));
        }

        setData({ email: "", password: "" });

        // Redirect back to intended page (e.g. /checkout) or home
        const redirectTo = location.state?.redirectTo || "/";
        navigate(redirectTo);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full min-h-[75vh] container mx-auto px-4 flex justify-center items-center py-8">
      <div className="bg-white w-full max-w-md shadow-md hover:shadow-lg border border-gray-100 rounded-3xl p-8 transition-shadow">
        <div className="text-center mb-6">
          <span className="text-2xl font-black text-green-700 tracking-tight">blinkey<span className="text-amber-500">it</span></span>
          <h2 className="text-xl font-bold text-gray-900 mt-2">
            Welcome Back!
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            India's favorite 10-minute grocery delivery app
          </p>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="grid gap-1">
            <label className="text-xs font-semibold text-gray-700" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. rahul@example.com"
              id="email"
              name="email"
              autoComplete="email"
              className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition"
              value={data.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Field */}
          <div className="grid gap-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-gray-700" htmlFor="password">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-green-700 hover:text-green-800 hover:underline cursor-pointer"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="flex items-center border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-100 transition">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                id="password"
                name="password"
                autoComplete="current-password"
                className="w-full focus:outline-none text-sm bg-transparent"
                value={data.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="cursor-pointer text-gray-400 hover:text-gray-600 ml-2"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-sm flex items-center justify-center mt-2 ${
              isFormValid && !loading
                ? "bg-green-700 hover:bg-green-800 text-white cursor-pointer active:scale-98"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? <ButtonLoader /> : "Log In"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-bold text-green-700 hover:text-green-800 hover:underline cursor-pointer"
          >
            Create an Account
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
