
import AddressModel from "../models/address.model.js"
import UserModel from  "../models/user.model.js"


export const addAddressController = async (req, res) => {
  try {
    const userId = req.userId; // ✅ make sure JWT middleware sets this

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized user",
        error: true,
        success: false,
      });
    }

    const {
      fullName,
      address_line,
      city,
      state,
      pincode,
      country,
      mobile,
      addressType,
      
    } = req.body;

    // ✅ Basic validation
    if (
      !fullName ||
      !address_line ||
      !city ||
      !state ||
      !pincode ||
      !country ||
      !mobile
    ) {
      return res.status(400).json({
        message: "All required fields must be filled",
        error: true,
        success: false,
      });
    }

    // ✅ Create address
    const createAddress = new AddressModel({
      fullName,
      address_line,
      city,
      state,
      pincode,
      country,
      mobile,
      addressType,
      userId, // optional but recommended
    });

    const saveAddress = await createAddress.save();

    // ✅ Push address ID to user
    await UserModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          address_details: saveAddress._id,
        },
      },
      { new: true }
    );

    return res.status(201).json({
      message: "Address created successfully",
      error: false,
      success: true,
      data: saveAddress,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server Error",
      error: true,
      success: false,
    });
  }
};

export const getAddressController=async(req,res)=>{
    try {
        const userId=req.userId

        const data=await AddressModel.find({userId :userId}).sort({createdAt :-1})

        return res.json({
            data:data,
            message:"List of Address",
            error:false,
            success:true

        })
        
    } catch (error) {

       return  res.status(500).json({
            message:error.message|| error,
            error:true,
            success:false
        })
        
    }
}

export const updateAddressController = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      _id,
      fullName,
      address_line,
      city,
      state,
      pincode,
      country,
      mobile,
      addressType,
    } = req.body;

    if (!_id) {
      return res.status(400).json({
        message: "Address ID is required",
        success: false,
        error: true,
      });
    }

    const updateAddress = await AddressModel.findOneAndUpdate(
      { _id, userId }, // ✅ FIX
      {
        fullName,
        address_line,
        city,
        state,
        pincode,
        country,
        mobile,
        addressType,
      },
      { new: true }
    );

    return res.json({
      message: "Address updated successfully",
      success: true,
      error: false,
      data: updateAddress,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};

export const deleteAddressController = async (req, res) => {
  try {
    const userId = req.userId;
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({
        message: "Address ID is required",
        success: false,
        error: true,
      });
    }

    const disableAddress = await AddressModel.updateOne(
      { _id, userId },
      { status: false }
    );

    return res.json({
      message: "Address removed successfully",
      success: true,
      error: false,
      data: disableAddress,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};



