import { GoogleGenAI } from "@google/genai";
import ProductModel from "../models/product.model.js";
import CategoryModel from "../models/category.model.js";

// Initialize Gemini client if API key is provided
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;
  try {
    return new GoogleGenAI({ apiKey });
  } catch (error) {
    console.error("Gemini initialization error:", error);
    return null;
  }
};

/* ==========================================================================
   1. AI RECIPE GENERATOR & STORE PRODUCT MAPPER
   ========================================================================== */
export const generateRecipeAI = async (req, res) => {
  try {
    const { dishQuery, pantryItems } = req.body;

    if (!dishQuery && (!pantryItems || pantryItems.length === 0)) {
      return res.status(400).json({
        message: "Provide a dish name or at least 1 pantry ingredient",
        error: true,
        success: false
      });
    }

    // Fetch all products from DB for ingredient matching
    const storeProducts = await ProductModel.find({}).limit(100);

    const ai = getGeminiClient();
    let aiResponse = null;

    if (ai) {
      try {
        const prompt = `You are a master chef AI for a fast 10-minute grocery app called Blinkeyit.
Generate a high-quality recipe for: "${dishQuery || pantryItems.join(", ")}".
Return strictly valid JSON with this format (no markdown formatting, plain JSON):
{
  "title": "Dish Title",
  "prepTime": "15 Mins",
  "servings": "2-3 People",
  "calories": "450 kcal",
  "recipeText": "Step-by-step cooking summary...",
  "ingredients": [
    { "name": "Ingredient Name", "searchQuery": "Search Term" }
  ]
}`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt
        });

        const text = response.text?.replace(/```json|```/g, "").trim();
        aiResponse = JSON.parse(text);
      } catch (err) {
        console.warn("Gemini API fallback to smart DB matching:", err.message);
      }
    }

    // Fallback or post-processing: Map ingredients to real store products
    const queryTerm = (dishQuery || pantryItems.join(" ")).toLowerCase();

    // Map required ingredients to actual DB products
    let recipeIngredients = [];
    let mappedProducts = [];

    if (aiResponse && aiResponse.ingredients) {
      for (const ing of aiResponse.ingredients) {
        const match = storeProducts.find(p =>
          p.name.toLowerCase().includes(ing.name.toLowerCase()) ||
          p.name.toLowerCase().includes((ing.searchQuery || "").toLowerCase())
        );
        if (match) {
          mappedProducts.push(match);
          recipeIngredients.push({
            name: match.name,
            price: match.price,
            productId: match._id,
            image: match.image?.[0] || ""
          });
        } else {
          recipeIngredients.push({
            name: ing.name,
            price: Math.floor(Math.random() * 80) + 30,
            productId: null,
            image: ""
          });
        }
      }
    }

    // If AI failed or wasn't available, generate high quality dynamic response from real DB products
    if (!aiResponse) {
      const matchedDbProducts = storeProducts.filter(p =>
        p.name.toLowerCase().includes(queryTerm) ||
        queryTerm.split(" ").some(word => word.length > 2 && p.name.toLowerCase().includes(word))
      );

      const itemsToUse = matchedDbProducts.length > 0 ? matchedDbProducts.slice(0, 4) : storeProducts.slice(0, 4);

      recipeIngredients = itemsToUse.map(p => ({
        name: p.name,
        price: p.price,
        productId: p._id,
        image: p.image?.[0] || ""
      }));

      aiResponse = {
        title: dishQuery ? `${dishQuery.charAt(0).toUpperCase() + dishQuery.slice(1)} Special Kit` : "Chef's Pantry Special",
        prepTime: "15 Mins",
        servings: "2-3 People",
        calories: "420 kcal",
        recipeText: `Prepare ${dishQuery || 'your meal'} using fresh ingredients sautéed with butter, seasoned to taste.`,
      };
    }

    const totalPrice = recipeIngredients.reduce((sum, item) => sum + item.price, 0);

    return res.json({
      success: true,
      error: false,
      data: {
        ...aiResponse,
        ingredients: recipeIngredients,
        totalPrice
      }
    });
  } catch (error) {
    console.error("AI Recipe error:", error);
    return res.status(500).json({
      message: error.message || "Failed to generate AI recipe",
      error: true,
      success: false
    });
  }
};

/* ==========================================================================
   2. AI SMART GROCERY BUDGET PLANNER
   ========================================================================== */
export const generateBudgetPlanAI = async (req, res) => {
  try {
    const { budget = 500, days = 3, dietary = "vegetarian" } = req.body;

    const targetBudget = Number(budget);
    const storeProducts = await ProductModel.find({});

    let filteredProducts = storeProducts;
    if (dietary === "vegetarian") {
      filteredProducts = storeProducts.filter(p => 
        !p.name.toLowerCase().includes("chicken") && 
        !p.name.toLowerCase().includes("meat") && 
        !p.name.toLowerCase().includes("egg") &&
        !p.name.toLowerCase().includes("fish")
      );
    }

    if (filteredProducts.length === 0) {
      filteredProducts = storeProducts;
    }

    // Smart greedy algorithm to select optimal product bundle fitting target budget
    const selectedItems = [];
    let currentTotal = 0;

    // Shuffle slightly for variety
    const pool = [...filteredProducts].sort(() => Math.random() - 0.5);

    for (const prod of pool) {
      if (currentTotal + prod.price <= targetBudget) {
        selectedItems.push({
          productId: prod._id,
          name: prod.name,
          qty: "1 Pack",
          price: prod.price,
          unit: prod.unit,
          image: prod.image?.[0] || ""
        });
        currentTotal += prod.price;
      }
      if (currentTotal >= targetBudget * 0.9) break;
    }

    const savings = Math.max(targetBudget - currentTotal, 0);

    return res.json({
      success: true,
      error: false,
      data: {
        budget: targetBudget,
        days,
        totalSpent: currentTotal,
        savings,
        items: selectedItems
      }
    });
  } catch (error) {
    console.error("AI Budget Planner error:", error);
    return res.status(500).json({
      message: error.message || "Failed to calculate AI budget cart",
      error: true,
      success: false
    });
  }
};

/* ==========================================================================
   3. BLINKEY AI FLOATING SHOPPING ASSISTANT
   ========================================================================== */
export const chatShoppingAssistantAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required", error: true, success: false });
    }

    const allProducts = await ProductModel.find({}).limit(30);
    const matchedProducts = allProducts.filter(p =>
      p.name.toLowerCase().includes(message.toLowerCase()) ||
      message.toLowerCase().split(" ").some(word => word.length > 2 && p.name.toLowerCase().includes(word))
    ).slice(0, 4);

    const ai = getGeminiClient();
    let aiTextResponse = "";

    if (ai) {
      try {
        const productListStr = allProducts.map(p => `${p.name} (₹${p.price})`).join(", ");
        const prompt = `You are "Blinkey AI", a super helpful and friendly instant grocery shopping assistant for Blinkeyit (delivering groceries in 8-10 minutes).
User asks: "${message}"
Available inventory preview: [${productListStr}].
Answer concisely in 2-3 friendly sentences. Suggest relevant groceries available in store.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt
        });

        aiTextResponse = response.text;
      } catch (err) {
        console.warn("Gemini Chat API fallback:", err.message);
      }
    }

    if (!aiTextResponse) {
      if (matchedProducts.length > 0) {
        aiTextResponse = `Here are some great options for "${message}" available for 10-minute delivery!`;
      } else {
        aiTextResponse = `I searched our inventory for "${message}". We have fresh produce, dairy, bakery, and snacks ready for fast 8-minute delivery!`;
      }
    }

    return res.json({
      success: true,
      error: false,
      reply: aiTextResponse,
      suggestedProducts: matchedProducts
    });
  } catch (error) {
    console.error("Blinkey AI Chat error:", error);
    return res.status(500).json({
      message: error.message || "Failed to process AI chat",
      error: true,
      success: false
    });
  }
};

/* ==========================================================================
   4. AI VISUAL SEARCH / SNAP & SHOP
   ========================================================================== */
export const visualSearchAI = async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    const allProducts = await ProductModel.find({}).limit(50);
    const ai = getGeminiClient();
    let detectedTerms = [];

    if (ai && imageBase64) {
      try {
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: cleanBase64
              }
            },
            "Identify all grocery items, dishes, or handwritten shopping list items present in this image. Return a comma-separated list of item names only."
          ]
        });

        const text = response.text || "";
        detectedTerms = text.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
      } catch (err) {
        console.warn("Gemini Vision API error/fallback:", err.message);
      }
    }

    // Match detected terms or fallback to popular fresh store items
    let matchedProducts = [];
    if (detectedTerms.length > 0) {
      matchedProducts = allProducts.filter(p =>
        detectedTerms.some(term => p.name.toLowerCase().includes(term))
      );
    }

    if (matchedProducts.length === 0) {
      matchedProducts = allProducts.slice(0, 6);
    }

    return res.json({
      success: true,
      error: false,
      detectedItems: detectedTerms,
      products: matchedProducts
    });
  } catch (error) {
    console.error("AI Visual Search error:", error);
    return res.status(500).json({
      message: error.message || "Failed to perform AI visual search",
      error: true,
      success: false
    });
  }
};
