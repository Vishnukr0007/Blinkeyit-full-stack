import {Router} from "express"
import { cashOnDeliveryController, getOrderDetailsController, paymentController,webhookStripe, verifyPaymentController  } from "../controllers/order.controller.js";
import auth from "../middleware/auth.js"


const orderRouter=Router();

orderRouter.post("/cash-on-delivery",auth,cashOnDeliveryController);
orderRouter.post("/checkout",auth,paymentController);
orderRouter.post("/webhook",webhookStripe);
orderRouter.get("/order-list",auth,getOrderDetailsController)
orderRouter.post("/verify-payment",auth, verifyPaymentController)

 

export default orderRouter