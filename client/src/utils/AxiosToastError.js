import toast from "react-hot-toast"
const AxiosToastError=(error)=>{
    const errorMessage = error?.response?.data?.message 
        || error?.message 
        || "An error occurred. Please try again.";
    toast.error(errorMessage);
}
export default AxiosToastError