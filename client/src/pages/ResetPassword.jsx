import  { useEffect, useState } from 'react'
import { useLocation, useNavigate,Link } from 'react-router-dom'
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const ResetPassword = () => {
    const location=useLocation()
    const navigate=useNavigate()
    const [data,setData]=useState({
        email:"",
        newPassword:"",
        confirmPassword:""
    })
    const isFormValid = Object.values(data).every((el) => el.trim() !== "");
    const [showNewPassword,setShowPassword]=useState(false)
    const[ShowConfirmPassword,setShowConfirmPassword]=useState(false)
    useEffect(()=>{
        if(!(location?.state?.data?.success)){
         navigate("/")
        }
        if(location?.state?.email){
           setData((preve)=>{
            return{
                ...preve,
                email:location?.state?.email
            }
           })
        }
    },[])
    console.log("data reset",data)


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
            ...SummaryApi.resetPassword,
            data: data,
          });
    
          if (response.data.error) {
            toast.error(response.data.message);
          } else if (response.data.success) {
            toast.success(response.data.message);
            navigate("/login");
            setData({ email: "",
                      newPassword:"",
                      confirmPassword:""
             });
            
          }
    
          console.log("response", response);
        } catch (error) {
          AxiosToastError(error);
        }
      };

    

    
  return (
    <section className="w-full container mx-auto px-4 flex justify-center items-center ">
    <div className="bg-white my-4 w-full max-w-md shadow-lg rounded-2xl p-6">
     
       <p className="font-semibold text-lg mb-5 ">Enter Your New Password</p>
      <form className="grid gap-4" onSubmit={handleSubmit}>
          <label className="text-gray-700 font-medium" htmlFor="newpassword">
            New Password
          </label>
           <div className="grid">
                      <div className="flex items-center border rounded-lg p-2  focus-within:border-yellow-500">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter your new password"
                          id="password"
                          name="newPassword"
                          className="w-full focus:outline-none"
                          value={data.newPassword}
                          onChange={handleChange}
                        />
                        <div
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="cursor-pointer text-gray-600 ml-2"
                        >
                          {showNewPassword? <FaRegEye /> : <FaRegEyeSlash />}
                        </div>
                      </div>
                    

        </div>
        <label className="text-gray-700 font-medium" htmlFor="confirmPassword">
            confirmPassword 
          </label>
           <div className="grid">
                      <div className="flex items-center border rounded-lg p-2  focus-within:border-yellow-500">
                        <input
                          type={ShowConfirmPassword ? "text" : "Password"}
                          placeholder="Enter your confirm Password"
                          id="confirmpassword"
                          name="confirmPassword"
                          className="w-full focus:outline-none"
                          value={data.confirmPassword}
                          onChange={handleChange}
                        />
                        <div
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          className="cursor-pointer text-gray-600 ml-2"
                        >
                          {ShowConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                        </div>
                      </div>
                    

        </div>

       
        {/* Login Button */}
        <button
          disabled={!isFormValid}
          className={`${
            isFormValid ? "bg-green-800 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
          } text-white py-2 rounded-lg transition-all`}
        >
          Change Password
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
  )
}

export default ResetPassword
