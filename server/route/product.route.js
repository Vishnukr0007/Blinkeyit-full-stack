import {Router} from 'express'
import auth from '../middleware/auth.js'
import { createProductController, deleteProductDetails, getProductByCategory, getProductByCategoryAndSubcategory, getProductController, getProductDetails, searchProduct, updateProductDetails } from '../controllers/product.controller.js'
import { admin } from '../middleware/admin.js'

const productRouter=Router()
productRouter.post("/create",auth,admin, createProductController)
productRouter.post("/get",auth,getProductController)
productRouter.post("/get-product-by-category",getProductByCategory);
productRouter.post("/get-product-by-category-and-subcategory",getProductByCategoryAndSubcategory);
productRouter.post("/get-product-details",getProductDetails);
productRouter.put("/update-product-details",auth,admin,updateProductDetails)
productRouter.delete("/delete-product",auth,admin,deleteProductDetails)
productRouter.post('/search-product',searchProduct);
export default productRouter