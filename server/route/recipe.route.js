import { Router } from "express";
import auth from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import {
  createRecipeController,
  getRecipeController,
  updateRecipeController,
  deleteRecipeController,
} from "../controllers/recipe.controller.js";

const recipeRouter = Router();

// Public / All authenticated users can view recipes
recipeRouter.get("/get", getRecipeController);
recipeRouter.post("/get", getRecipeController);

// Admin only routes
recipeRouter.post("/create", auth, admin, createRecipeController);
recipeRouter.put("/update", auth, admin, updateRecipeController);
recipeRouter.delete("/delete", auth, admin, deleteRecipeController);
recipeRouter.delete("/delete/:id", auth, admin, deleteRecipeController);

export default recipeRouter;
