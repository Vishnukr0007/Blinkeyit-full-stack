import CartProductModel from "../models/cartproduct.model.js";
import UserModel from "../models/user.model.js";


export const addToCartItemController =async(req,res)=>{
    try {
        const userId=req.userId;
        const {productId}=req.body;

        if(!productId){
            return res.status(402).json({
                message:"provide ProductId",
                error:true,
                success:false
            })
        }

        const checkItemcart=await CartProductModel.findOne({
            userId:userId,
            productId:productId
        })

        if(checkItemcart){
            return res.status(400).json({
                message:"Item already in cart",
                error:true,
                success:false
            })
        }

        const cartItem =new CartProductModel({
            quantity:1,
            userId:userId,
            productId:productId
        })

        const save=await cartItem.save()

        const updateCartUser=await UserModel.updateOne({_id:userId},{
            $push:{
                shopping_cart:productId
            }
        })

        return res.json({
            message:"Item Added Successfully",
            error:false,
            success:true,
            data:updateCartUser
        })
        
    } catch (error) {
         return res.status(500).json({
         message:error.message|| error,
         error:true,
         success:false
        })
        
    }
}

export const getCartItemController =async(req,res)=>{
    try {

        const userId=req.userId

        const cartItem=await CartProductModel.find({
           userId:userId

        }).populate('productId')

      return res.json({
        data:cartItem,
        error:false,
        success:true
      })  
        
    } catch (error) {
        return res.status(500).json({
            message:error.message || error,
            error:true,
            success:false
        })
    }
}

export const updateCartItemQtyController = async (req, res) => {
  try {
    const userId = req.userId;
    const { _id, qty } = req.body;

    // ✅ Proper validation
    if (!_id || qty === undefined) {
      return res.status(400).json({
        message: "provide _id and qty",
        success: false,
        error: true,
      });
    }

    // ✅ Remove item if qty <= 0
    if (qty <= 0) {
      await CartProductModel.deleteOne({
        _id,
        userId,
      });

      return res.json({
        message: "Item removed from cart",
        success: true,
        error: false,
      });
    }

    // ✅ Update quantity (ownership protected)
    const updateCartItem = await CartProductModel.findOneAndUpdate(
      { _id, userId },
      { quantity: qty },
      { new: true }
    );

    if (!updateCartItem) {
      return res.status(404).json({
        message: "Cart item not found",
        success: false,
        error: true,
      });
    }

    return res.json({
      message: "Cart quantity updated",
      success: true,
      error: false,
      data: updateCartItem,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server error",
      success: false,
      error: true,
    });
  }
};
