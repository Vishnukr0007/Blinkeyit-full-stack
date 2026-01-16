import GiftCardModel from '../models/giftCard.model.js';
import uploadImageCloudinary from '../utils/uploadimageCloudinary.js';

// Create a new gift card (admin only)
export async function createGiftCard(req, res) {
  try {
    const { name, description, price, discount, isActive } = req.body;
    const imageFile = req.file; // multer middleware
    if (!imageFile) {
      return res.status(400).json({ message: 'Image file is required', error: true, success: false });
    }
    const upload = await uploadImageCloudinary(imageFile);
    const newCard = new GiftCardModel({
      name,
      description,
      price,
      discount,
      isActive: isActive !== undefined ? isActive : true,
      image: upload.url,
    });
    const saved = await newCard.save();
    return res.json({ message: 'Gift card created', success: true, error: false, data: saved });
  } catch (error) {
    console.error("Gift Card Create Error:", error);
    return res.status(500).json({ message: error.message || error, error: true, success: false });
  }
}

// Public: get all gift cards
export async function getAllGiftCards(req, res) {
  try {
    console.log("Fetching gift cards...");
    const cards = await GiftCardModel.find({});
    return res.json({ message: 'Gift cards fetched', success: true, error: false, data: cards });
  } catch (error) {
    console.error("Gift Card Fetch Error:", error);
    return res.status(500).json({ message: error.message || error, error: true, success: false });
  }
}

// Admin: update a gift card
export async function updateGiftCard(req, res) {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (req.file) {
      const upload = await uploadImageCloudinary(req.file);
      updateData.image = upload.url;
    }
    const updated = await GiftCardModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Gift card not found', error: true, success: false });
    }
    return res.json({ message: 'Gift card updated', success: true, error: false, data: updated });
  } catch (error) {
    console.error("Gift Card Update Error:", error);
    return res.status(500).json({ message: error.message || error, error: true, success: false });
  }
}

// Admin: delete a gift card
export async function deleteGiftCard(req, res) {
  try {
    const { id } = req.params;
    const deleted = await GiftCardModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Gift card not found', error: true, success: false });
    }
    return res.json({ message: 'Gift card deleted', success: true, error: false });
  } catch (error) {
    console.error("Gift Card Delete Error:", error);
    return res.status(500).json({ message: error.message || error, error: true, success: false });
  }
}
