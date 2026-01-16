import Axios from "../utils/Axios.js"
import SummaryApi from "../common/SummaryApi"
const uploadImage=async(image)=>{
    try {
        const formData= new FormData
        formData.append("image",image)
        const response=await  Axios({
          ...SummaryApi.uploadImage,
          data:formData
        })

        return response
    } catch (error) {
        return error.response ? error.response : { data: { success: false, message: error.message } }
    }
}

export default uploadImage