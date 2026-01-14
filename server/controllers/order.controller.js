import mongoose from "mongoose";
import OrderModel from "../models/order.model.js";
import CartProductModel from "../models/cartproduct.model.js";
import UserModel from "../models/user.model.js";
import Stripe from "../config/stripe.js";
import { priceWithDiscount } from "../utils/priceWithDiscount.js";
import ProductModel from "../models/product.model.js";

export const cashOnDeliveryController = async (req, res) => {
  try {
    const userId = req.userId;

    const { list_items, totalAmt, addressId, subTotalAmt } = req.body;

    // ✅ Basic validation
    if (!list_items || list_items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
        success: false,
        error: true,
      });
    }

    if (!addressId) {
      return res.status(400).json({
        message: "Delivery address is required",
        success: false,
        error: true,
      });
    }

    // ✅ Create orders
    const payLoad = list_items.map((el) => {
      const objectId = new mongoose.Types.ObjectId();

      return {
        userId,
        orderId: `ORD-${objectId}`,
        productId: el.productId._id,
        product_details: {
          name: el.productId.name,
          image: el.productId.image,
        },
        paymentId: "",
        payment_status: "CASH ON DELIVERY",
        delivery_address: addressId,
        subTotalAmt,
        totalAmt,
      };
    });

    // ✅ FIX: no `new`
    const generateOrder = await OrderModel.insertMany(payLoad);

    // ✅ Clear cart
    await CartProductModel.deleteMany({ userId });
    await UserModel.updateOne({ _id: userId }, { $set: { shopping_cart: [] } });

    return res.json({
      message: "Order placed successfully",
      success: true,
      error: false,
      data: generateOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error: true,
    });
  }
};

/* ================= STRIPE PAYMENT CONTROLLER ================= */
export const paymentController = async (req, res) => {
  try {
    const userId = req.userId;
    const { list_items, addressId } = req.body;

    if (!list_items?.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!addressId) {
      return res.status(400).json({ message: "Address required" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const line_items = [];

    for (const item of list_items) {
      // ✅ FETCH FROM PRODUCT MODEL
      const product = await ProductModel.findById(item.productId);

      if (!product) continue;

      const finalPrice =
        priceWithDiscount(product.price, product.discount) * 100;

      line_items.push({
        price_data: {
          currency: "inr",
          product_data: {
            name: product.name,
            images: product.image, // must be array
            metadata: {
              productId: product._id.toString(),
            },
          },
          unit_amount: Math.round(finalPrice),
        },
        quantity: item.quantity,
      });
    }

    if (!line_items.length) {
      return res.status(400).json({ message: "No valid products found" });
    }

    const session = await Stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,

      payment_intent_data: {
        metadata: {
          userId: userId.toString(),
          addressId: addressId.toString(),
        },
      },

      line_items,

      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    return res.status(200).json({
      success: true,
      id: session.id,
    });
  } catch (error) {
    console.error("❌ Stripe Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Payment failed",
    });
  }
};

export const getOrderProductItems = async (
  line_items,
  session,
  userId,
  addressId
) => {
  const productList = [];

  for (const item of line_items.data) {
    const product = await Stripe.products.retrieve(item.price.product);

    productList.push({
      userId,
      orderId: `ORD-${new mongoose.Types.ObjectId()}`,
      productId: product.metadata.productId,
      product_details: {
        name: product.name,
        image: product.images,
      },
      paymentId: session.payment_intent,
      payment_status: "PAID",
      delivery_address: addressId,
      subTotalAmt: item.amount_total / 100,
      totalAmt: item.amount_total / 100,
    });
  }

  return productList;
};

//http://localhost:8080/api/order/webhook

export const webhookStripe = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

  let event;

  try {
    event = Stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("❌ Webhook signature failed:", err.message);
    return res.status(400).send("Webhook Error");
  }

  // ✅ ACK STRIPE IMMEDIATELY
  res.status(200).json({ received: true });

  if (event.type !== "checkout.session.completed") return;

  try {
    const session = event.data.object;

    const userId = session.metadata.userId;
    const addressId = session.metadata.addressId;
    

    const line_items = await Stripe.checkout.sessions.listLineItems(session.id);

    const orderProduct = await getOrderProductItems(
      line_items,
      session,
      userId,
      addressId,
    );

    // ✅ SAVE ORDER
    const order = await OrderModel.insertMany(orderProduct);

    if (order) {
      // ✅ CLEAR USER SHOPPING CART
      const removeCartItems = await UserModel.updateOne({_id: userId},{ $set: { shopping_cart: [] }  },
       
      );

      // ✅ CLEAR CART COLLECTION
      const removeCartProductDB = await CartProductModel.deleteMany({ userId });
    }

    console.log("✅ Order saved, cart cleared, user updated");
  } catch (err) {
    console.error("❌ Webhook processing error:", err);
  }
};

export const getOrderDetailsController = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    const orderlist = await OrderModel.find({ userId }).populate("delivery_address")
      .sort({ createdAt: -1 });

    return res.json({
      message: "Order List",
      error: false,
      success: true,
      data: orderlist,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to fetch orders",
      error: true,
      success: false,
    });
  }
};
