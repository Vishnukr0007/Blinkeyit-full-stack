import RecipeModel from "../models/recipe.model.js";

// Create a new Recipe Kit (Admin only)
export async function createRecipeController(req, res) {
  try {
    const { title, description, image, time, difficulty, servings, tag, price, originalPrice, ingredients, publish } = req.body;

    if (!title || price === undefined || price === null) {
      return res.status(400).json({
        message: "Title and Price are required fields",
        error: true,
        success: false,
      });
    }

    const newRecipe = new RecipeModel({
      title,
      description: description || "",
      image: image || "",
      time: time || "15 mins",
      difficulty: difficulty || "Easy",
      servings: servings || "2-3 People",
      tag: tag || "Chef Special",
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price),
      ingredients: Array.isArray(ingredients) ? ingredients : [],
      publish: publish !== undefined ? Boolean(publish) : true,
    });

    const savedRecipe = await newRecipe.save();

    return res.status(201).json({
      message: "Recipe kit created successfully",
      success: true,
      error: false,
      data: savedRecipe,
    });
  } catch (error) {
    console.error("Create Recipe Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to create recipe kit",
      error: true,
      success: false,
    });
  }
}

// Fetch all Recipe Kits (Public / Admin)
export async function getRecipeController(req, res) {
  try {
    const { search, publishedOnly } = req.query;

    let query = {};
    if (publishedOnly === "true") {
      query.publish = true;
    }
    if (search) {
      query.$text = { $search: search };
    }

    const recipes = await RecipeModel.find(query).sort({ createdAt: -1 });

    return res.json({
      message: "Recipe kits fetched successfully",
      success: true,
      error: false,
      data: recipes,
    });
  } catch (error) {
    console.error("Fetch Recipes Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to fetch recipe kits",
      error: true,
      success: false,
    });
  }
}

// Update Recipe Kit (Admin only)
export async function updateRecipeController(req, res) {
  try {
    const { _id, id, ...updateData } = req.body;
    const targetId = _id || id || req.params.id;

    if (!targetId) {
      return res.status(400).json({
        message: "Recipe ID is required",
        error: true,
        success: false,
      });
    }

    if (updateData.price !== undefined) {
      updateData.price = Number(updateData.price);
    }
    if (updateData.originalPrice !== undefined) {
      updateData.originalPrice = Number(updateData.originalPrice);
    }

    const updatedRecipe = await RecipeModel.findByIdAndUpdate(
      targetId,
      updateData,
      { new: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({
        message: "Recipe kit not found",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: "Recipe kit updated successfully",
      success: true,
      error: false,
      data: updatedRecipe,
    });
  } catch (error) {
    console.error("Update Recipe Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to update recipe kit",
      error: true,
      success: false,
    });
  }
}

// Delete Recipe Kit (Admin only)
export async function deleteRecipeController(req, res) {
  try {
    const { _id, id } = req.body;
    const targetId = req.params.id || _id || id;

    if (!targetId) {
      return res.status(400).json({
        message: "Recipe ID is required",
        error: true,
        success: false,
      });
    }

    const deletedRecipe = await RecipeModel.findByIdAndDelete(targetId);

    if (!deletedRecipe) {
      return res.status(404).json({
        message: "Recipe kit not found",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: "Recipe kit deleted successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Delete Recipe Error:", error);
    return res.status(500).json({
      message: error.message || "Failed to delete recipe kit",
      error: true,
      success: false,
    });
  }
}
