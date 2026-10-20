import mongoose from "mongoose";

const groceryItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "product",
      default: null,
    },
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    category: {
      type: String,
      default: "Groceries",
    },
    quantity: {
      type: Number,
      default: 1,
    },
    unit: {
      type: String,
      default: "1 Pack",
    },
    price: {
      type: Number,
      required: [true, "Item price is required"],
      min: 0,
    },
    image: {
      type: String,
      default: "",
    },
  },
  { _id: true }
);

const mealBreakdownSchema = new mongoose.Schema(
  {
    mealType: {
      type: String, // e.g. 'Breakfast', 'Lunch', 'Dinner', 'Snacks'
      required: true,
    },
    suggestions: [
      {
        type: String,
      },
    ],
  },
  { _id: false }
);

const groceryPlanSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Plan title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    budget: {
      type: Number,
      required: [true, "Target budget is required"],
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    savings: {
      type: Number,
      default: 0,
    },
    days: {
      type: Number,
      default: 3,
      min: 1,
      max: 30,
    },
    dietary: {
      type: String,
      enum: ["vegetarian", "non-vegetarian", "vegan", "keto", "jain", "all"],
      default: "vegetarian",
    },
    familyMembers: {
      type: Number,
      default: 2,
      min: 1,
    },
    goal: {
      type: String,
      default: "Balanced Diet", // 'Balanced Diet', 'Max Savings', 'High Protein', 'Quick & Easy', 'Family Pack'
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      default: null,
    },
    creatorRole: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
    isTemplate: {
      type: Boolean,
      default: false, // True for Admin curated Smart Plan templates
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    publish: {
      type: Boolean,
      default: true,
    },
    items: [groceryItemSchema],
    mealsBreakdown: [mealBreakdownSchema],
    tips: [
      {
        type: String,
      },
    ],
    tags: [
      {
        type: String,
      },
    ],
    usedCount: {
      type: Number,
      default: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Search Indexes
groceryPlanSchema.index({
  title: "text",
  description: "text",
  goal: "text",
  tags: "text",
});
groceryPlanSchema.index({ isTemplate: 1, publish: 1, isFeatured: -1 });
groceryPlanSchema.index({ userId: 1, createdAt: -1 });

const GroceryPlanModel = mongoose.model("groceryPlan", groceryPlanSchema);

export default GroceryPlanModel;
