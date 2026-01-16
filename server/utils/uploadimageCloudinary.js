import cloudinary from "../config/cloudinary.js";

const uploadImageCloudinary = async (file) => {
  if (!file || !file.buffer) {
    throw new Error("No file buffer found");
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: "blinkeyit",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    ).end(file.buffer);
  });
};

export default uploadImageCloudinary;
