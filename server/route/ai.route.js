import { Router } from "express";
import {
  generateRecipeAI,
  generateBudgetPlanAI,
  chatShoppingAssistantAI,
  visualSearchAI
} from "../controllers/ai.controller.js";

const aiRouter = Router();

aiRouter.post("/recipe", generateRecipeAI);
aiRouter.post("/budget-plan", generateBudgetPlanAI);
aiRouter.post("/chat", chatShoppingAssistantAI);
aiRouter.post("/visual-search", visualSearchAI);

export default aiRouter;
