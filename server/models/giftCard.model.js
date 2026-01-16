import mongoose from "mongoose";

const giftCardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Provide gift card name"],
    },
    image: {
        type: String,
        required: [true, "Provide gift card image"],
    },
    price: {
        type: Number,
        required: [true, "Provide gift card price"],
    },
    discount: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: ""
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const GiftCardModel = mongoose.model("giftCard", giftCardSchema);

export default GiftCardModel;
