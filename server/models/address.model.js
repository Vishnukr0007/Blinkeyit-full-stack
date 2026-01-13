import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    address_line: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: "India",
    },
    mobile: {
      type: Number,
      required: true,
    },
    addressType: {
      type: String,
      enum: ["Home", "Work"],
      default: "Home",
    },
    status: {
      type: Boolean,
      default: true,
    },
    userId:{
        type:mongoose.Schema.ObjectId,
        default:null
    }
  },
  {
    timestamps: true,
  }
);

const AddressModel = mongoose.model("address", addressSchema);

export default AddressModel;
