import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { Link,  useLocation,useNavigate} from "react-router-dom";

const OtpVerification = () => {
  const [data, setData] = useState(["","","","","",""]);
  const inputRef=useRef([])
  const location=useLocation()
  const navigate=useNavigate()
  console.log("location",location)

  useEffect(()=>{
    if(!location?.state?.email){
        navigate("/forgot-password")
    }
  },)
  const isFormValid = data.every(el => el)

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.forgot_password_otp_verification,
        data:{
               otp :data.join(""),
               email :location?.state?.email
        }
      });

      if (response.data.error) {
        toast.error(response.data.message);
      } else if (response.data.success) {
        toast.success(response.data.message);
        setData(["", "", "", "", "", ""]);
        navigate("/reset-password",{
            state:{
                data:response.data,
                email:location?.state?.email
            }
        });
      }
      
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="w-full container mx-auto px-4 flex justify-center items-center ">
      <div className="bg-white my-4 w-full max-w-md shadow-lg rounded-2xl p-6">
       
         <p className="font-semibold text-lg mb-5 text-center">Enter OTP</p>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="grid">
            <label className="text-gray-700 font-medium" htmlFor="otp">
              Enter Your OTP:
            </label>
            <div className="flex items-center gap-2 mt-3">
                {
                    data.map((element,index)=>{
                        return(
                           <input
                           key={"otp"+index}
                           type="text"
                           id="otp"
                           ref={(ref)=>{
                               inputRef.current[index]=ref
                               return ref
                           }}
                           value={data[index]}
                           onChange={(e)=>{
                              const value=e.target.value
                              console.log("value",value)
                              const newdata=[...data]
                              newdata[index]=value
                              setData(newdata)
                              if(value && index < data.length-1){
                                inputRef.current[index+1].focus()
                              }
                           }}
                           maxLength={1}
                           className="border rounded-lg p-3 focus:outline-none w-14 flex-1 focus:border-yellow-500 text-center font-semibold  "
                           />
                            
                        )
                    })
                }
            </div>
            

          </div>

         
          {/* Login Button */}
          <button
            disabled={!isFormValid}
            className={`${
              isFormValid ? "bg-green-800 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
            } text-white py-2 rounded-lg transition-all`}
          >
            Verify OTP
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

export default OtpVerification;
