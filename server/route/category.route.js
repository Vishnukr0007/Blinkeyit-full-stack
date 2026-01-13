import {Router} from "express"
import auth from '../middleware/auth.js'
import { AddCategoryController, deleteCategoryController, getCategoryConroller, updateCategoryController } from "../controllers/category.controller.js"
const categoryRouter=Router()

categoryRouter.post("/add-category",auth,AddCategoryController)
categoryRouter.get("/get",getCategoryConroller)
categoryRouter.put('/update',auth,updateCategoryController)
categoryRouter.delete("/delete",auth,deleteCategoryController)

export default categoryRouter