import { Router } from "express";
import jwt from "jsonwebtoken";
import auth from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import {
  generateAIGroceryPlanController,
  saveGroceryPlanController,
  getMyGroceryPlansController,
  getPublicTemplatesController,
  getGroceryPlanByIdController,
  updateGroceryPlanController,
  deleteGroceryPlanController,
  useGroceryPlanController,
  adminGetAllPlansController,
  adminCreateTemplateController,
  adminUpdatePlanController,
  adminDeletePlanController,
  adminTogglePublishController,
  adminToggleFeaturedController,
  adminGetStatsController,
} from "../controllers/groceryPlan.controller.js";

const groceryPlanRouter = Router();

// Optional Auth Helper for AI generation
const optionalAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies.acesstoken || req.headers.authorization?.split(" ")[1];
    if (token) {
      const decode = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
      if (decode) {
        req.userId = decode.id;
      }
    }
  } catch (error) {
    // If token invalid or expired, continue as guest
  }
  next();
};

/* ==================== PUBLIC & USER ROUTES ==================== */
// AI Generation
groceryPlanRouter.post("/generate", optionalAuth, generateAIGroceryPlanController);

// Public Templates
groceryPlanRouter.get("/templates", getPublicTemplatesController);

// Plan Details
groceryPlanRouter.get("/details/:id", getGroceryPlanByIdController);

// Conversion Tracker (1-click add to cart)
groceryPlanRouter.post("/use/:id", useGroceryPlanController);

// User Saved Plans (Auth Required)
groceryPlanRouter.post("/save", auth, saveGroceryPlanController);
groceryPlanRouter.get("/my-plans", auth, getMyGroceryPlansController);
groceryPlanRouter.put("/update/:id", auth, updateGroceryPlanController);
groceryPlanRouter.delete("/delete/:id", auth, deleteGroceryPlanController);

/* ==================== ADMIN MAINTENANCE & CRUD ROUTES ==================== */
groceryPlanRouter.get("/admin/stats", auth, admin, adminGetStatsController);
groceryPlanRouter.get("/admin/all", auth, admin, adminGetAllPlansController);
groceryPlanRouter.post("/admin/template", auth, admin, adminCreateTemplateController);
groceryPlanRouter.put("/admin/update/:id", auth, admin, adminUpdatePlanController);
groceryPlanRouter.delete("/admin/delete/:id", auth, admin, adminDeletePlanController);
groceryPlanRouter.patch("/admin/toggle-publish/:id", auth, admin, adminTogglePublishController);
groceryPlanRouter.patch("/admin/toggle-featured/:id", auth, admin, adminToggleFeaturedController);

export default groceryPlanRouter;
