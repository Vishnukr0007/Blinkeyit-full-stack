import jwt from 'jsonwebtoken'
const auth=async(req,res,next)=>{
    try {
        const token = req.cookies.acesstoken || req.headers.authorization?.split(" ")[1];

      if (!token) {
      return res.status(401).json({ message: "Please Login", error: true, success: false });
      }
        const decode = await jwt.verify(token,process.env.SECRET_KEY_ACCESS_TOKEN)
        if(!decode){
            return response.status(401).json({
                message:' unauthorized access',
                error:true,
                sucess:false
            })
        }
        req.userId=decode.id
     next()
        
        
    } catch (error) {
        return res.status(500).json({
             message:error.message|| error,
            error:true,
            sucess:false
        })
    }
}
export default auth