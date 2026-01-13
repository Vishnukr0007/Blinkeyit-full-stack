import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { handleAddItemCart } from "../store/cartSlice";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { priceWithDiscount } from "../utils/priceWithDiscount";
import { handleAddAddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice";

export const GlobalContext = createContext(null);
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();

  const [totalQty, setTotalQty] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [originalTotal, setOriginalTotal] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);

  const cartItem = useSelector((state) => state?.cartItem?.cart || []);
  const user = useSelector((state) => state?.user);

  // ================= FETCH CART =================
  const fetchCartItems = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getCartItems,
      });

      if (response?.data?.success) {
        dispatch(handleAddItemCart(response.data.data));
      }
    } catch (error) {
      console.error("Fetch cart error:", error);
    }
  };

  // ================= UPDATE QTY =================
  const updateCartItemQty = async (id, qty) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateCartItemQty,
        data: { _id: id, qty },
      });

      if (response?.data?.success) {
        toast.success(response.data.message);
        fetchCartItems();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  // ================= CALCULATE TOTALS =================
  useEffect(() => {
    const { qty, discountedTotal, originalTotal } = cartItem.reduce(
      (acc, curr) => {
        const quantity = Number(curr?.quantity) || 0;

        const basePrice =
          Number(curr?.price) ||
          Number(curr?.product?.price) ||
          Number(curr?.productId?.price) ||
          0;

        const discount =
          Number(curr?.discount) ||
          Number(curr?.product?.discount) ||
          Number(curr?.productId?.discount) ||
          0;

        const finalPrice = priceWithDiscount(basePrice, discount);

        acc.qty += quantity;
        acc.originalTotal += quantity * basePrice;
        acc.discountedTotal += quantity * finalPrice;

        return acc;
      },
      { qty: 0, originalTotal: 0, discountedTotal: 0 }
    );

    setTotalQty(qty);
    setTotalPrice(discountedTotal);
    setOriginalTotal(originalTotal);
    setTotalSavings(originalTotal - discountedTotal);
  }, [cartItem]);

  // ================= fetch Address =================

  const fetchAddress=async ()=>{
    try {
      const response =await Axios({
        ...SummaryApi.getAddress
      })

      const {data:  responseData}=response;

      if(responseData.success){
        dispatch(handleAddAddress(responseData.data))
        
      }
      
    } catch (error) {
      AxiosToastError(error)
    }
  }

    const fetchOrderDetails= async()=>{
       try {
          const response= await Axios({
          ...SummaryApi.getOrderItems,
           
         })

      const {data : responseData} =response;
      if(responseData.success){
        dispatch(setOrder(responseData.data))
      }  
        
       } catch (error) {
          AxiosToastError(error)
       }
    }

  // ================= USER CHANGE =================
  useEffect(() => {
    if (user?._id) {
      fetchCartItems(); // login
      fetchAddress();
      fetchOrderDetails();
    } else {
      dispatch(handleAddItemCart([])); // logout
      setTotalQty(0);
      setTotalPrice(0);
      setOriginalTotal(0);
      setTotalSavings(0);
    }
  }, [user,dispatch]);

  return (
    <GlobalContext.Provider
      value={{
        fetchCartItems,
        updateCartItemQty,
        fetchAddress,
        totalQty,
        totalPrice,
        cartItem,
        originalTotal,
        totalSavings,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
