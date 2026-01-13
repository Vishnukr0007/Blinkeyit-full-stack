import { useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useNavigate } from "react-router-dom";
const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const ValidateValue=Object.values(data).every(el =>el)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate=useNavigate()
  const handleChange =  (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit= async(e)=>{
     e.preventDefault()
     if(data.password!==data.confirmPassword){
      toast.error(
        "password and confirm password mismatch"
      )
      return 
     }

     try {
      const response=await Axios({
        ...SummaryApi.register,
        data:data
  })
  if(response.data.error){
    toast.error(response.data.message)
  }
  if(response.data.success){
    toast.success(response.data.message)
    setData({
      name:"",
      email:"",
      password:"",
      confirmPassword:""
    })
    navigate('/login')
  }

  console.log('response',response)
      
     } catch (error) {
       AxiosToastError(error)
     }

  }

  

  return (
    <section className="w-full container mx-auto px-4 flex justify-center items-center  ">
      <div className="bg-white my-4 w-full max-w-md shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Welcome to Blinkeyit
        </h2>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid">
            <label className="text-gray-700 font-medium" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              id="name"
              className="border rounded-lg p-2 focus:outline-none focus-within:border-yellow-500"
              name="name"
              value={data.name}
              onChange={handleChange}
            />
          </div>

          <div className="grid">
            <label className="text-gray-700 font-medium" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              id="email"
              name="email"
              className="border rounded-lg p-2 focus:outline-none focus-within:border-yellow-500"
              value={data.email}
              onChange={handleChange}
            />
          </div>

          {/* Password Field */}
          <div className="grid">
            <label className="text-gray-700 font-medium" htmlFor="password">
              Password
            </label>
            <div className="flex items-center border rounded-lg p-2 focus-within:border-yellow-500 outline-none">
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

          {/* Confirm Password Field */}
          <div className="grid">
            <label className="text-gray-700 font-medium" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="flex items-center border rounded-lg p-2 focus-within:border-yellow-500">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                id="confirmPassword"
                name="confirmPassword"
                className="w-full focus:outline-none"
                value={data.confirmPassword}
                onChange={handleChange}
              />
              <div
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="cursor-pointer text-gray-600 ml-2"
              >
                {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
          </div>

          <button disabled={!ValidateValue} className={`${ValidateValue ? "bg-green-800 hover:bg-green-700":"bg-gray-400"} text-white py-2 rounded-lg  transition-all cursor-pointer`}>
            Register
          </button>
        </form>
        <p>Already have account?<Link to={"/login"} className="font-semibold text-green-800">Login</Link> 

        </p>
      </div>
    </section>
  );
};

export default Register;
