import axios from 'axios'
import SummaryApi, { baseURL } from '../common/SummaryApi'

const Axios= axios.create({
    baseURL:baseURL,
    withCredentials:true, // Enable credentials for cookies/auth
    headers: {
        'Content-Type': 'application/json',
    }
})
// sending acess token in the header
Axios.interceptors.request.use(
    async(config)=>{
      const accesstoken=localStorage.getItem('accesstoken')
      if(accesstoken){
        config.headers.Authorization=`Bearer ${accesstoken}`
      }

      return config
    },
    (error)=>{
        return Promise.reject(error)
    }
)

// extend the life span  of acess token with the help refresh 

Axios.interceptors.response.use(
    (response)=>{
        return response
    },
    async(error)=>{
        let originalRequest=error.config
        if(error.response?.status==401 && !originalRequest.retry){
            originalRequest.retry= true
            const refreshToken=localStorage.getItem('refreshtoken')
            

            if(refreshToken){
              const newAcessToken= await refreshAccessToken(refreshToken)
              if(newAcessToken){
                originalRequest.headers.Authorization=`Bearer ${newAcessToken}`
                return Axios(originalRequest)
              }
            }
        }

        return Promise.reject(error)
    }
)

const refreshAccessToken=async(refreshtoken)=>{
    try {
        const response=await Axios({
            ...SummaryApi.refreshToken ,
            headers:{
                Authorization:`Bearer ${refreshtoken}`
            }

        })
        const accessToken=response.data.data.accesstoken
        localStorage.setItem("accesstoken",accessToken)
       return accessToken
        
    } catch (error) {
         console.log(error)
    }
}

export default Axios