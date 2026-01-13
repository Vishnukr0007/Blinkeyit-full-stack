import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./userSlice";
import productReducer from './productSlice'
import cartReducer from "./cartSlice"
import addressReducer from "./addressSlice"
import orderReducr from "./orderSlice"
export const store = configureStore({
  reducer: {
    user : userReducer,
    product: productReducer,
    cartItem:cartReducer,
    address:addressReducer,
    orders:orderReducr
  },
})
