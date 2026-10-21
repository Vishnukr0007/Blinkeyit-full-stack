import { useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useNavigate } from "react-router-dom";
import ButtonLoader from "../components/ButtonLoader";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const isFormValid = Object.values(data).every((val) => Boolean(val.trim()));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match. Please verify.");
      return;
    }

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.register,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message || "Registration failed");
      } else if (response.data.success) {
        toast.success(response.data.message || "Account created successfully! Please log in.");
        setData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/login");
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full min-h-[80vh] container mx-auto px-4 flex justify-center items-center py-8">
      <div className="bg-white w-full max-w-md shadow-md hover:shadow-lg border border-gray-100 rounded-3xl p-8 transition-shadow">
        <div className="text-center mb-6">
          <span className="text-2xl font-black text-green-700 tracking-tight">blinkey<span className="text-amber-500">it</span></span>
          <h2 className="text-xl font-bold text-gray-900 mt-2">
            Create Your Account
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Get groceries delivered to your door in 10 minutes
          </p>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="grid gap-1">
            <label className="text-xs font-semibold text-gray-700" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              id="name"
              name="name"
              autoComplete="name"
              className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition"
              value={data.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
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

          {/* Password */}
          <div className="grid gap-1">
            <label className="text-xs font-semibold text-gray-700" htmlFor="password">
              Password (min. 6 characters)
            </label>
            <div className="flex items-center border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-100 transition">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                id="password"
                name="password"
                autoComplete="new-password"
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

          {/* Confirm Password */}
          <div className="grid gap-1">
            <label className="text-xs font-semibold text-gray-700" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="flex items-center border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-100 transition">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                id="confirmPassword"
                name="confirmPassword"
                autoComplete="new-password"
                className="w-full focus:outline-none text-sm bg-transparent"
                value={data.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="cursor-pointer text-gray-400 hover:text-gray-600 ml-2"
                title={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-sm flex items-center justify-center mt-2 ${
              isFormValid && !loading
                ? "bg-green-700 hover:bg-green-800 text-white cursor-pointer active:scale-98"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? <ButtonLoader /> : "Create Account"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-green-700 hover:text-green-800 hover:underline cursor-pointer"
          >
            Log In
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
