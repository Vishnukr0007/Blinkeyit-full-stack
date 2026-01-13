import {Router} from "express"
import auth from "../middleware/auth.js"
import { AddSubCategoryController, deleteSubCategoryController, getSubCategoryController, updateSubCategoryController } from "../controllers/subcategory.controller.js"


const subCategoryRouter=Router()

subCategoryRouter.post("/create",auth,AddSubCategoryController)
subCategoryRouter.post("/get",auth,getSubCategoryController)
subCategoryRouter.put("/update",auth,updateSubCategoryController)
subCategoryRouter.delete("/delete",auth,deleteSubCategoryController)

export default subCategoryRouter
