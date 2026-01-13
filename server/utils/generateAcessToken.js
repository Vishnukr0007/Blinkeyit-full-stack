import jwt from 'jsonwebtoken'

const generateAcessToken= async(userId)=>{
    const token= await jwt.sign({id:userId},
        process.env.SECRET_KEY_ACCESS_TOKEN,
        {expiresIn:'3d'}
    )

    return token

}
export default generateAcessToken