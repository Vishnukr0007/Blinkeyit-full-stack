import { GoogleGenAI } from "@google/genai";
import GroceryPlanModel from "../models/groceryPlan.model.js";
import ProductModel from "../models/product.model.js";

// Helper to initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;
  try {
    return new GoogleGenAI({ apiKey });
  } catch (error) {
    console.error("Gemini initialization error in grocery planner:", error);
    return null;
  }
};

/* ==========================================================================
   1. AI GROCERY PLAN GENERATION (Smart Inventory Matching & Meal Planner)
   ========================================================================== */
export const generateAIGroceryPlanController = async (req, res) => {
  try {
    const {
      budget = 600,
      days = 3,
      dietary = "vegetarian",
      familyMembers = 2,
      goal = "Balanced Diet",
      preferences = "",
      autoSave = false,
    } = req.body;

    const targetBudget = Math.max(Number(budget) || 500, 100);
    const planDays = Math.max(Number(days) || 3, 1);
    const members = Math.max(Number(familyMembers) || 2, 1);

    // 1. Fetch products from store inventory
    const allProducts = await ProductModel.find({});

    // 2. Filter products based on dietary restrictions
    let availableProducts = allProducts;
    const lowerDiet = dietary.toLowerCase();

    if (lowerDiet === "vegetarian" || lowerDiet === "vegan") {
      availableProducts = allProducts.filter((p) => {
        const name = p.name.toLowerCase();
        return (
          !name.includes("chicken") &&
          !name.includes("meat") &&
          !name.includes("egg") &&
          !name.includes("fish") &&
          !name.includes("mutton") &&
          !name.includes("pork") &&
          !name.includes("prawn")
        );
      });
    } else if (lowerDiet === "jain") {
      availableProducts = allProducts.filter((p) => {
        const name = p.name.toLowerCase();
        return (
          !name.includes("chicken") &&
          !name.includes("meat") &&
          !name.includes("egg") &&
          !name.includes("fish") &&
          !name.includes("onion") &&
          !name.includes("garlic") &&
          !name.includes("potato")
        );
      });
    }

    if (availableProducts.length === 0) {
      availableProducts = allProducts;
    }

    // 3. Try generating plan with Gemini AI
    const ai = getGeminiClient();
    let aiGeneratedData = null;

    if (ai) {
      try {
        const storeInventorySample = availableProducts.slice(0, 40).map((p) => ({
          id: p._id,
          name: p.name,
          price: p.price,
          unit: p.unit || "1 pack",
        }));

        const prompt = `You are an expert AI Nutritionist and Grocery Budget Planner for Blinkeyit (an ultra-fast 10-minute grocery delivery app).
Generate a highly optimized, healthy, and budget-friendly grocery meal plan for:
- Target Budget: ₹${targetBudget}
- Duration: ${planDays} Days
- Family Size: ${members} Person(s)
- Dietary Type: ${dietary}
- Fitness/Health Goal: ${goal}
${preferences ? `- User Custom Preferences: ${preferences}` : ""}

Available Store Inventory Sample:
${JSON.stringify(storeInventorySample)}

Output strictly valid JSON (no markdown formatting, no code blocks):
{
  "title": "Inspiring Plan Title",
  "description": "2-sentence summary of how this plan achieves the goal within budget.",
  "items": [
    {
      "name": "Exact or close product name",
      "quantity": 1,
      "estimatedPrice": 80,
      "category": "Pantry Staples / Dairy / Fresh Produce / Snacks"
    }
  ],
  "mealsBreakdown": [
    {
      "mealType": "Breakfast",
      "suggestions": ["Suggestion 1", "Suggestion 2"]
    },
    {
      "mealType": "Lunch & Dinner",
      "suggestions": ["Suggestion 1", "Suggestion 2"]
    },
    {
      "mealType": "Smart Healthy Snacks",
      "suggestions": ["Suggestion 1"]
    }
  ],
  "tips": [
    "Practical money saving grocery tip 1",
    "Nutrition or freshness storage tip 2"
  ]
}`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

        const cleanedText = response.text?.replace(/```json|```/g, "").trim();
        aiGeneratedData = JSON.parse(cleanedText);
      } catch (err) {
        console.warn("Gemini AI grocery plan generation fallback:", err.message);
      }
    }

    // 4. Map or Algorithmic Assemble Products
    let plannedItems = [];
    let calculatedTotal = 0;

    if (aiGeneratedData && Array.isArray(aiGeneratedData.items)) {
      for (const item of aiGeneratedData.items) {
        // Try finding matching store product
        const matched = availableProducts.find(
          (p) =>
            p.name.toLowerCase().includes(item.name.toLowerCase()) ||
            item.name.toLowerCase().includes(p.name.toLowerCase())
        );

        if (matched) {
          const itemPrice = matched.price * (item.quantity || 1);
          if (calculatedTotal + itemPrice <= targetBudget * 1.15) {
            plannedItems.push({
              productId: matched._id,
              name: matched.name,
              category: item.category || "Grocery",
              quantity: item.quantity || 1,
              unit: matched.unit || "1 Pack",
              price: matched.price,
              image: matched.image?.[0] || "",
            });
            calculatedTotal += itemPrice;
          }
        } else {
          const estPrice = item.estimatedPrice || 50;
          if (calculatedTotal + estPrice <= targetBudget * 1.15) {
            plannedItems.push({
              productId: null,
              name: item.name,
              category: item.category || "Fresh Produce",
              quantity: item.quantity || 1,
              unit: "1 Pack",
              price: estPrice,
              image: "",
            });
            calculatedTotal += estPrice;
          }
        }
      }
    }

    // 5. Fallback Algorithmic Assembly if AI response was empty or too small
    if (plannedItems.length < 3) {
      plannedItems = [];
      calculatedTotal = 0;

      // Shuffle pool for variety
      const shuffled = [...availableProducts].sort(() => Math.random() - 0.5);

      for (const p of shuffled) {
        if (calculatedTotal + p.price <= targetBudget) {
          plannedItems.push({
            productId: p._id,
            name: p.name,
            category: p.category?.[0]?.name || "Groceries",
            quantity: 1,
            unit: p.unit || "1 Pack",
            price: p.price,
            image: p.image?.[0] || "",
          });
          calculatedTotal += p.price;
        }
        if (calculatedTotal >= targetBudget * 0.9) break;
      }

      aiGeneratedData = {
        title: `${goal} ${planDays}-Day Smart Basket`,
        description: `Custom-tailored grocery bundle for ${members} person(s) optimized for ${goal.toLowerCase()} under ₹${targetBudget}.`,
        mealsBreakdown: [
          {
            mealType: "Breakfast",
            suggestions: [
              "Fresh high-fiber oats or warm buttered toast with tea/coffee",
              "Nutritious scrambled eggs or protein smoothie bowl",
            ],
          },
          {
            mealType: "Lunch & Dinner",
            suggestions: [
              "Balanced vegetable stir-fry with fragrant basmati rice",
              "Hearty warm dal or paneer curry with fresh rotis",
            ],
          },
          {
            mealType: "Healthy Snacks",
            suggestions: ["Roasted nuts, fresh fruits, or baked munchies"],
          },
        ],
        tips: [
          "Blinkeyit delivers your fresh items in 8-10 minutes, so order produce fresh without bulk wastage.",
          `You saved ₹${Math.max(targetBudget - calculatedTotal, 0)} on this customized smart basket!`,
        ],
      };
    }

    const calculatedSavings = Math.max(targetBudget - calculatedTotal, 0);

    const planPayload = {
      title:
        aiGeneratedData?.title ||
        `${goal} ${planDays}-Day Smart AI Grocery Basket`,
      description:
        aiGeneratedData?.description ||
        `Optimized grocery plan for ${members} person(s) for ${planDays} days under ₹${targetBudget}.`,
      budget: targetBudget,
      totalPrice: calculatedTotal,
      savings: calculatedSavings,
      days: planDays,
      dietary,
      familyMembers: members,
      goal,
      items: plannedItems,
      mealsBreakdown: aiGeneratedData?.mealsBreakdown || [],
      tips: aiGeneratedData?.tips || [],
      tags: [goal, `${planDays} Days`, dietary, `Family of ${members}`],
      isTemplate: false,
    };

    // Auto save if user is authenticated and requested
    let savedPlan = null;
    if (autoSave && req.userId) {
      const newPlan = new GroceryPlanModel({
        ...planPayload,
        userId: req.userId,
        creatorRole: "USER",
      });
      savedPlan = await newPlan.save();
    }

    return res.json({
      message: "Smart AI Grocery Plan generated successfully",
      success: true,
      error: false,
      data: savedPlan || planPayload,
    });
  } catch (error) {
    console.error("Generate AI Grocery Plan Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to generate AI Grocery Plan",
      error: true,
      success: false,
    });
  }
};

/* ==========================================================================
   2. USER PLAN CRUD OPERATIONS
   ========================================================================== */

// Save a Grocery Plan (User)
export const saveGroceryPlanController = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      title,
      description,
      budget,
      days,
      dietary,
      familyMembers,
      goal,
      items,
      mealsBreakdown,
      tips,
      tags,
    } = req.body;

    if (!title || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Title and at least one grocery item are required",
        error: true,
        success: false,
      });
    }

    const calculatedTotal = items.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
      0
    );
    const targetBudget = Number(budget) || calculatedTotal;
    const savings = Math.max(targetBudget - calculatedTotal, 0);

    const newPlan = new GroceryPlanModel({
      title,
      description: description || "",
      budget: targetBudget,
      totalPrice: calculatedTotal,
      savings,
      days: Number(days) || 3,
      dietary: dietary || "vegetarian",
      familyMembers: Number(familyMembers) || 2,
      goal: goal || "Balanced Diet",
      userId,
      creatorRole: "USER",
      isTemplate: false,
      publish: true,
      items,
      mealsBreakdown: Array.isArray(mealsBreakdown) ? mealsBreakdown : [],
      tips: Array.isArray(tips) ? tips : [],
      tags: Array.isArray(tags) ? tags : [goal || "Balanced Diet"],
    });

    const savedPlan = await newPlan.save();

    return res.status(201).json({
      message: "Grocery plan saved to your account successfully",
      success: true,
      error: false,
      data: savedPlan,
    });
  } catch (error) {
    console.error("Save Grocery Plan Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to save grocery plan",
      error: true,
      success: false,
    });
  }
};

// Get Authenticated User's Saved Plans
export const getMyGroceryPlansController = async (req, res) => {
  try {
    const userId = req.userId;
    const plans = await GroceryPlanModel.find({ userId })
      .populate("items.productId", "name price image unit stock")
      .sort({ createdAt: -1 });

    return res.json({
      message: "Saved grocery plans fetched successfully",
      success: true,
      error: false,
      data: plans,
    });
  } catch (error) {
    console.error("Get User Grocery Plans Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to fetch user grocery plans",
      error: true,
      success: false,
    });
  }
};

// Get Public Admin-Curated Smart Templates
export const getPublicTemplatesController = async (req, res) => {
  try {
    const { dietary, maxBudget, days, goal, search } = req.query;

    let filter = {
      isTemplate: true,
      publish: true,
    };

    if (dietary && dietary !== "all") {
      filter.dietary = dietary;
    }
    if (days) {
      filter.days = Number(days);
    }
    if (goal) {
      filter.goal = goal;
    }
    if (maxBudget) {
      filter.budget = { $lte: Number(maxBudget) };
    }
    if (search) {
      filter.$text = { $search: search };
    }

    const templates = await GroceryPlanModel.find(filter)
      .populate("items.productId", "name price image unit stock")
      .sort({ isFeatured: -1, usedCount: -1, createdAt: -1 });

    return res.json({
      message: "Curated smart grocery templates fetched successfully",
      success: true,
      error: false,
      data: templates,
    });
  } catch (error) {
    console.error("Get Public Templates Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to fetch curated templates",
      error: true,
      success: false,
    });
  }
};

// Get Single Plan by ID
export const getGroceryPlanByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await GroceryPlanModel.findByIdAndUpdate(
      id,
      { $inc: { viewsCount: 1 } },
      { new: true }
    ).populate("items.productId", "name price image unit stock");

    if (!plan) {
      return res.status(404).json({
        message: "Grocery plan not found",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: "Grocery plan fetched successfully",
      success: true,
      error: false,
      data: plan,
    });
  } catch (error) {
    console.error("Get Grocery Plan By ID Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to fetch grocery plan details",
      error: true,
      success: false,
    });
  }
};

// Update User's Grocery Plan
export const updateGroceryPlanController = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const updateData = req.body;

    const plan = await GroceryPlanModel.findById(id);
    if (!plan) {
      return res.status(404).json({
        message: "Grocery plan not found",
        error: true,
        success: false,
      });
    }

    // Verify ownership
    if (plan.userId?.toString() !== userId && plan.creatorRole !== "ADMIN") {
      return res.status(403).json({
        message: "You do not have permission to edit this plan",
        error: true,
        success: false,
      });
    }

    // Recalculate price if items updated
    if (updateData.items && Array.isArray(updateData.items)) {
      updateData.totalPrice = updateData.items.reduce(
        (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
        0
      );
      const budget = Number(updateData.budget) || plan.budget;
      updateData.savings = Math.max(budget - updateData.totalPrice, 0);
    }

    const updated = await GroceryPlanModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return res.json({
      message: "Grocery plan updated successfully",
      success: true,
      error: false,
      data: updated,
    });
  } catch (error) {
    console.error("Update Grocery Plan Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to update grocery plan",
      error: true,
      success: false,
    });
  }
};

// Delete User's Grocery Plan
export const deleteGroceryPlanController = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const plan = await GroceryPlanModel.findById(id);
    if (!plan) {
      return res.status(404).json({
        message: "Grocery plan not found",
        error: true,
        success: false,
      });
    }

    // Verify ownership
    if (plan.userId?.toString() !== userId) {
      return res.status(403).json({
        message: "You do not have permission to delete this plan",
        error: true,
        success: false,
      });
    }

    await GroceryPlanModel.findByIdAndDelete(id);

    return res.json({
      message: "Grocery plan deleted successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Delete Grocery Plan Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to delete grocery plan",
      error: true,
      success: false,
    });
  }
};

// Increment Plan Usage (Cart Conversion)
export const useGroceryPlanController = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await GroceryPlanModel.findByIdAndUpdate(
      id,
      { $inc: { usedCount: 1 } },
      { new: true }
    );

    return res.json({
      message: "Plan conversion recorded",
      success: true,
      error: false,
      data: { usedCount: updated?.usedCount || 1 },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to record plan usage",
      error: true,
      success: false,
    });
  }
};

/* ==========================================================================
   3. ADMIN MAINTENANCE & CRUD OPERATIONS (Admin Only)
   ========================================================================== */

// Admin: Get all Grocery Plans (Templates + User Plans) with Pagination & Filters
export const adminGetAllPlansController = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      type = "all", // 'all' | 'template' | 'user'
      dietary = "",
      publish = "",
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    let filter = {};

    if (type === "template") {
      filter.isTemplate = true;
    } else if (type === "user") {
      filter.isTemplate = false;
    }

    if (dietary && dietary !== "all") {
      filter.dietary = dietary;
    }

    if (publish !== "") {
      filter.publish = publish === "true";
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { goal: { $regex: search, $options: "i" } },
      ];
    }

    const [plans, totalCount] = await Promise.all([
      GroceryPlanModel.find(filter)
        .populate("userId", "name email mobile")
        .sort({ isFeatured: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      GroceryPlanModel.countDocuments(filter),
    ]);

    return res.json({
      message: "Admin grocery plans fetched successfully",
      success: true,
      error: false,
      data: {
        plans,
        totalCount,
        totalPages: Math.ceil(totalCount / limitNum),
        currentPage: pageNum,
      },
    });
  } catch (error) {
    console.error("Admin Get All Plans Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to fetch admin grocery plans",
      error: true,
      success: false,
    });
  }
};

// Admin: Create Curated Smart Grocery Template
export const adminCreateTemplateController = async (req, res) => {
  try {
    const {
      title,
      description,
      budget,
      days,
      dietary,
      familyMembers,
      goal,
      items,
      mealsBreakdown,
      tips,
      tags,
      isFeatured = false,
      publish = true,
    } = req.body;

    if (!title || !budget || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Title, Budget, and at least one item are required",
        error: true,
        success: false,
      });
    }

    const calculatedTotal = items.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
      0
    );
    const targetBudget = Number(budget);
    const savings = Math.max(targetBudget - calculatedTotal, 0);

    const newTemplate = new GroceryPlanModel({
      title,
      description: description || "",
      budget: targetBudget,
      totalPrice: calculatedTotal,
      savings,
      days: Number(days) || 3,
      dietary: dietary || "vegetarian",
      familyMembers: Number(familyMembers) || 2,
      goal: goal || "Curated Pack",
      userId: req.userId,
      creatorRole: "ADMIN",
      isTemplate: true,
      isFeatured: Boolean(isFeatured),
      publish: Boolean(publish),
      items,
      mealsBreakdown: Array.isArray(mealsBreakdown) ? mealsBreakdown : [],
      tips: Array.isArray(tips) ? tips : [],
      tags: Array.isArray(tags) ? tags : [goal || "Curated Template"],
    });

    const savedTemplate = await newTemplate.save();

    return res.status(201).json({
      message: "Smart Grocery Plan Template created successfully",
      success: true,
      error: false,
      data: savedTemplate,
    });
  } catch (error) {
    console.error("Admin Create Template Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to create grocery template",
      error: true,
      success: false,
    });
  }
};

// Admin: Update any Grocery Plan or Curated Template
export const adminUpdatePlanController = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.items && Array.isArray(updateData.items)) {
      updateData.totalPrice = updateData.items.reduce(
        (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
        0
      );
      if (updateData.budget !== undefined) {
        updateData.savings = Math.max(
          Number(updateData.budget) - updateData.totalPrice,
          0
        );
      }
    }

    const updatedPlan = await GroceryPlanModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedPlan) {
      return res.status(404).json({
        message: "Grocery plan not found",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: "Grocery plan updated successfully by Admin",
      success: true,
      error: false,
      data: updatedPlan,
    });
  } catch (error) {
    console.error("Admin Update Plan Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to update grocery plan",
      error: true,
      success: false,
    });
  }
};

// Admin: Delete any Grocery Plan or Template
export const adminDeletePlanController = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await GroceryPlanModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        message: "Grocery plan not found",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: "Grocery plan removed successfully by Admin",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Admin Delete Plan Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to delete grocery plan",
      error: true,
      success: false,
    });
  }
};

// Admin: Quick Toggle Publish Status
export const adminTogglePublishController = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await GroceryPlanModel.findById(id);

    if (!plan) {
      return res.status(404).json({
        message: "Grocery plan not found",
        error: true,
        success: false,
      });
    }

    plan.publish = !plan.publish;
    await plan.save();

    return res.json({
      message: `Plan ${plan.publish ? "Published" : "Unpublished"} successfully`,
      success: true,
      error: false,
      data: { publish: plan.publish },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to toggle publish status",
      error: true,
      success: false,
    });
  }
};

// Admin: Quick Toggle Featured Status
export const adminToggleFeaturedController = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await GroceryPlanModel.findById(id);

    if (!plan) {
      return res.status(404).json({
        message: "Grocery plan not found",
        error: true,
        success: false,
      });
    }

    plan.isFeatured = !plan.isFeatured;
    await plan.save();

    return res.json({
      message: `Plan ${plan.isFeatured ? "marked as Featured" : "removed from Featured"}`,
      success: true,
      error: false,
      data: { isFeatured: plan.isFeatured },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to toggle featured status",
      error: true,
      success: false,
    });
  }
};

// Admin: Analytics & Maintenance Overview
export const adminGetStatsController = async (req, res) => {
  try {
    const [
      totalPlans,
      totalTemplates,
      totalUserPlans,
      activeTemplates,
      statsAggregate,
      dietaryBreakdown,
      topTemplates,
    ] = await Promise.all([
      GroceryPlanModel.countDocuments({}),
      GroceryPlanModel.countDocuments({ isTemplate: true }),
      GroceryPlanModel.countDocuments({ isTemplate: false }),
      GroceryPlanModel.countDocuments({ isTemplate: true, publish: true }),
      GroceryPlanModel.aggregate([
        {
          $group: {
            _id: null,
            totalConversions: { $sum: "$usedCount" },
            totalViews: { $sum: "$viewsCount" },
            avgBudget: { $avg: "$budget" },
            totalSavingsGenerated: { $sum: "$savings" },
          },
        },
      ]),
      GroceryPlanModel.aggregate([
        {
          $group: {
            _id: "$dietary",
            count: { $sum: 1 },
          },
        },
      ]),
      GroceryPlanModel.find({ isTemplate: true })
        .sort({ usedCount: -1 })
        .limit(5)
        .select("title budget totalPrice usedCount viewsCount isFeatured publish"),
    ]);

    const aggregateInfo = statsAggregate[0] || {
      totalConversions: 0,
      totalViews: 0,
      avgBudget: 0,
      totalSavingsGenerated: 0,
    };

    return res.json({
      message: "Admin Grocery Planner stats fetched successfully",
      success: true,
      error: false,
      data: {
        totalPlans,
        totalTemplates,
        totalUserPlans,
        activeTemplates,
        totalConversions: aggregateInfo.totalConversions,
        totalViews: aggregateInfo.totalViews,
        avgBudget: Math.round(aggregateInfo.avgBudget || 0),
        totalSavingsGenerated: Math.round(aggregateInfo.totalSavingsGenerated || 0),
        dietaryBreakdown,
        topTemplates,
      },
    });
  } catch (error) {
    console.error("Admin Get Grocery Planner Stats Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to fetch admin stats",
      error: true,
      success: false,
    });
  }
};
