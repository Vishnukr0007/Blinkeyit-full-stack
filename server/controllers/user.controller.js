import jwt from 'jsonwebtoken'
import sendEmail from '../config/sendEmail.js'
import UserModel from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js'
import generateAcessToken from '../utils/generateAcessToken.js'
import generateRefreshToken from '../utils/generateRefreshToken.js'
import uploadImageCloudinary from '../utils/uploadimageCloudinary.js'
import generateOtp from '../utils/generateOtp.js'
import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js'
// Register Controller
export async function registerUserController(req,res){
    try{
        const {name,email,password}=req.body

        if(!name|| !email||!password){
            return res.status(400).json({
                message:"provided email,name,password",
                error:true,
                success:false
                
            })
        }

        const user=await UserModel.findOne({email})
        if(user){
            return res.json({
                message:"Already register email",
                error: true,
                success:false
            })
        }

      const salt=await bcryptjs.genSalt(10)
      const hashPassword=await bcryptjs.hash(password,salt)
      const payload={
        name,
        email,
        password:hashPassword
      }

      const newUser=new UserModel(payload)
      const save=await newUser.save()
       const VerifyEmaiUrl=`${process.env.FRONTEND_URL}/verify-email?code=${save._id}`// verify Email
      const verifyEmail=await sendEmail({
           sendTo :email,
           subject:"verify email from blinkeyit",
           html:verifyEmailTemplate({
              name,
              Url:VerifyEmaiUrl
           })

      })
      return res.json({
        message: " User register successfully",
        error:false,
        success: true,
        data : save

      })

    }catch(error){
        return res.status(500).json({
            message:error.message||error,
            error:true,
            success:false
        })
    }
}
// verify Email Controller
export async function verifyEmailcontroller(req,res){
    try{
       const {code} =req.body
       
       if (!code) {
         return res.status(400).json({
           message: "Verification code is required",
           error: true,
           success: false
         })
       }
       
       const user=await UserModel.findOne({_id:code })
       if(!user){
        return res.status(400).json({
            message:" Invalid code",
            error:true,
            success:false
        })
       }
       const updateUser= await UserModel.updateOne({_id:code},{
        Verify_email:true
       })

       return res.json({
        message:"verify email done",
        success:true,
        error: false

       })
    }catch(error){
        return res.status(500).json({
            message: error.message|| error,
            error: true,
            success:false
        })
    }
}

// Login Controller

export async function loginController(req,res) {
    try {
        const {email,password}=req.body
         if(!email|| !password){
            return res.status(400).json({
                message:"provide email,password",
                error:true,
                success:false
            })
         }

        const user=await UserModel.findOne({email})
        if(!user){
            return res.status(400).json({
              message:"user not registered",
              error:true,
              success:false
            })
        }
        if(user.status !=="Active"){
            return res.status(400).json({
                message:"contact to admin",
                error:true,
                success:false
            })
        }
        const checkPassword=await bcryptjs.compare(password,user.password)
    if(!checkPassword){
        return res.status(400).json({
            message:"check the password",
            error:true,
            success:false
        })
    }
    
    const accesstoken=await generateAcessToken(user._id)
    const refreshtoken=await generateRefreshToken(user._id)
    const updateUser=await UserModel.findByIdAndUpdate(user?._id,{
        last_login_date:new Date()
    })

    const cookiesOption={
        httpOnly:true,
        secure:true,
        sameSite:"none"
    }
    res.cookie('acesstoken',accesstoken,cookiesOption)
    res.cookie('refreshtoken',refreshtoken,cookiesOption)

    return res.json({
        message:"Login Successfully",
        error:false,
        success:true,
        data:{
            accesstoken,
            refreshtoken
        }
    })



    } catch (error) {
        return res.status(500).json({
            message:error.message|| error,
            error:true,
            success:false
        })
        
    }

}

// Logout Controller

export async function logoutController(req,res) {
    try {
        const userid=req.userId// middleware

        const cookiesOption={
            httpOnly:true,
            secure:true,
            sameSite:"none"
        }
        res.clearCookie("acesstoken",cookiesOption)
        res.clearCookie("refreshtoken",cookiesOption)
        const removeRefreshtoken=await UserModel.findByIdAndUpdate(userid,{
            refresh_token:""
        })
        return res.json({
            message:"Logout Successfully ",
            error:false,
            success:true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message|| error,
            error:true,
            success:false
        })
    }
    
}

//upload user avatar
export async function uploadAvatar(req,res) {
    try {
         const userId=req.userId //auth middleware
        const image = req.file; // multer middleware
        const upload= await uploadImageCloudinary(image)
        const updateUser=await UserModel.findByIdAndUpdate(userId,{
            avatar:upload.url
        })
        return res.json({
             message:"upload profile" ,
             success:true,
             error:false,
             data:{
                _id:userId,
                avatar : upload.url 
             }
               
            })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message|| error,
            error:true,
            success:false
        })
    }
    
}
// update user details

export async function updateUserDetails(req,res) {
    try {
        const userId=req.userId // auth middleware
        const {name,email,mobile,password}=req.body
        let hashPassword=''
        if(password){
            const salt =await bcryptjs.genSalt(10)
            hashPassword=await bcryptjs.hash(password,salt)
        }

        const updateUser=await  UserModel.updateOne({_id:userId},{
            ...(name&&{name:name}),
            ...(email&& {email :email}),
            ...(mobile&& {mobile :mobile}),
            ...(password&&{password :hashPassword})
        })

        return res.json({
            message:"Updated  successfully",
            error:false,
            success:true,
            data: updateUser
        })


    } catch (error) {
        return res.status(500).json({
            message:error.message|| error,
            error:true,
            success:false

        })
        
    }
    
}
// forgot password not login
export async function forgotPasswordController(req,res) {
    try {
        const {email}=req.body

        const user=await UserModel.findOne({email})

        if(!user){
            return res.status(400).json({
                message:" email not available",
                error:true,
                success:false
            })
        }
      const otp=generateOtp()
      const expireTime= new Date()+ 60 *60 *1000 // 10 minutes
      const update=await UserModel.findByIdAndUpdate(user._id,{
        forgot_password_otp: otp,
        forgot_password_expiry:new Date(expireTime).toISOString()
      })
      await sendEmail({
        sendTo :email,
        subject:"forgot password from Blinkeyit",
        html: forgotPasswordTemplate({
            name :user.name,
             otp :otp
        })
        

      })

      return res.json({
        message :"check the email",
        error:false,
        success:true
      })
      

    } catch (error) {
        return res.status(500).json({
            message:error.message|| error,
            error:true,
            success:false
        })
        
    }
    
}

// verify forgot password otp

export async function verifyForgotPasswordOtp(req,res) {
    try {

        const {email,otp}=req.body

       if(!email || !otp){
         return res.status(400).json({
            message:"Provide required field email,otp.",
            error:true,
            success:false
         })
       }

       const user=await UserModel.findOne({email})

        if(!user){
            return res.status(400).json({
                message:" email not available",
                error:true,
                success:false
            })
        }

        const currentTime=new Date().toISOString()
        if(user.forgot_password_expiry<currentTime){
            return res.status(400).json({
                message:" otp is expired",
                error:true,
                success:false
            })
        }

        if(otp!==user.forgot_password_otp){
            return res.status(400).json({
                message:"Invalid otp",
                error:true,
                success:false
            })
        }
   // if otp is not expired
   // otp===user.forgot_password_otp
   

   if(otp==user.forgot_password_otp){
    const updateUser=await UserModel.findByIdAndUpdate(user?._id,{
        forgot_password_otp:"",
        forgot_password_expiry:""
    })

    return res.status(200).json({
        message:"verify otp is successfully",
        error:false,
        success:true
    })

   }   
    } catch (error) {
        return res.status(500).json({
            message:error.message|| error,
            error:true,
            success :false
        })
        
    }
    
}

// reset the password

export async function resetPassword(req,res) {

    try {
        const {email ,newPassword, confirmPassword}=req.body
        if(!email || !newPassword || !confirmPassword){
            return res.status(400).json({
                message:"provided required fields email,newpassword,confirmPassword",
                error:true,
                success:false
            })
        }

        const user=await UserModel.findOne({email})
        if(!user){
            return res.status(400).json({
                message:" email not available",
                error:true,
                success:false
            })
        }

      if(newPassword!==confirmPassword){
        return res.status(400).json({
            message:" Passwors doesn't match",
            error:true,
            success:false
        })
      } 
       const salt= await bcryptjs.genSalt(10)
       const  hashPassword=await bcryptjs.hash(newPassword,salt)
      const update=await UserModel.findByIdAndUpdate(user._id,{
           password:hashPassword
      })

      return res.json({
        message:"password updated successfully",
        error:false,
        success:true
      })
        
    } catch (error) {
        return res.status(500).json({
            message:error.message|| error,
            error:true,
            success:false
        })
        
    }
    
}

// refresh token controller
export async function  refreshToken(req,res) {
    try {
        const refreshToken = req.cookies.refreshtoken || req?.headers?.
        authorization?.split(" ")[1] /// [Bearer token] ;

      if(!refreshToken){
        return res.status(401).json({
            message:" Invalid Token",
            error:true,
            success:false

        })
      }
      const verifyToken=await jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN)

      if(!verifyToken){
        return res.status(401).json({
            message:" token is Expired",
            error: true,
            success:false
        })
      }
       
      const userId=verifyToken?._id

      const newAcessToken=await generateAcessToken(userId)
      const cookiesOption={
        httpOnly:true,
        secure:true,
        sameSite:"none"
    }
      
      res.cookie('acesstoken',newAcessToken,cookiesOption)

      return res.json({
        message:" New Access Token is Generated",
        error:false,
        success:true,
        data:{
            accesstoken:newAcessToken
        }
      })
      
        
    } catch (error) {
        return res.status(500).json({
            message:error.message || error,
            error: true,
            success: false
        })
        
    }
    
}
// get login user details

export async function userDetails(req,res) {
    try {
        const userId= req.userId
        const user =await UserModel.findById(userId).select("-password -refresh_token")
        return res.json({
            message:"user details",
            data:user,
            error:false,
            success:true
        })

    } catch (error) {
        return res.status(500).json({
            message:error.message || error,
            error: true,
            success: false
        })
    }
    
}