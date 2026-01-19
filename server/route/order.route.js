import {Router} from "express"
import { cashOnDeliveryController, getAllOrdersController, getOrderDetailsController, paymentController, updateOrderStatusController, verifyPaymentController, webhookStripe } from "../controllers/order.controller.js";
import auth from "../middleware/auth.js"
import { admin } from "../middleware/admin.js";


const orderRouter=Router();

orderRouter.post("/cash-on-delivery",auth,cashOnDeliveryController);
orderRouter.post("/checkout",auth,paymentController);
orderRouter.post("/webhook",webhookStripe);
orderRouter.get("/order-list",auth,getOrderDetailsController)
orderRouter.post("/verify-payment",auth, verifyPaymentController)
orderRouter.get("/admin-order-list",auth,admin,getAllOrdersController)
orderRouter.post("/update-order-status",auth,admin,updateOrderStatusController)

 

export default orderRouter