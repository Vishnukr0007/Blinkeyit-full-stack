import uploadImageCloudinary from "../utils/uploadimageCloudinary.js";

const uploadImageController = async (req, res) => {
  try {
    const file = req.file;
    console.log("Upload Request File:", file ? { ...file, buffer: file.buffer ? "Buffer Present" : "No Buffer" } : "No File");

    if (!file) {
      return res.status(400).json({
        message: "No file uploaded",
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
    console.error("Cloudinary upload error:", error);

    return res.status(500).json({
      message: error.message || "Image upload failed",
      error: true,
      success: false,
    });
  }
};

export default uploadImageController;
