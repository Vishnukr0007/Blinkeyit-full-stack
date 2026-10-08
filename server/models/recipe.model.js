import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Recipe title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    time: {
      type: String,
      default: "15 mins",
    },
    difficulty: {
      type: String,
      default: "Easy",
    },
    servings: {
      type: String,
      default: "2-3 People",
    },
    tag: {
      type: String,
      default: "Chef Special",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    ingredients: [
      {
        type: String,
      },
    ],
    publish: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Search Index
recipeSchema.index({ title: "text", description: "text" });

const RecipeModel = mongoose.model("recipe", recipeSchema);

export default RecipeModel;
