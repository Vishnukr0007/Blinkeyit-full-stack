import uploadImageCloudinary from "../utils/uploadimageCloudinary.js";



const uploadImageController = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "No file received",
        success: false,
      });
    }

    const uploadImage = await uploadImageCloudinary(file);

    return res.json({
      message: "Upload done",
      data: uploadImage,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error);

    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};


export default uploadImageController;
