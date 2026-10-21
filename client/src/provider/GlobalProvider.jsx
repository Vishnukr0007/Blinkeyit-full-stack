import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { handleAddItemCart } from "../store/cartSlice";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { priceWithDiscount } from "../utils/priceWithDiscount";
import { handleAddAddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice";

const GUEST_CART_KEY = "blinkeyit_guest_cart";

export const GlobalContext = createContext(null);
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();

  const reduxCart = useSelector((state) => state?.cartItem?.cart || []);
  const user = useSelector((state) => state?.user);
  const isLoggedIn = Boolean(user?._id);

  // Local state for guest items
  const [guestCart, setGuestCart] = useState(() => {
    try {
      const saved = localStorage.getItem(GUEST_CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Effective cart
  const cartItem = useMemo(() => {
    return isLoggedIn ? reduxCart : guestCart;
  }, [isLoggedIn, reduxCart, guestCart]);

  // Sync guest cart to localStorage
  useEffect(() => {
    if (!isLoggedIn) {
      try {
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestCart));
      } catch (err) {
        console.warn("Could not save guest cart", err);
      }
    }
  }, [guestCart, isLoggedIn]);

  // ================= FETCH CART (LOGGED IN) =================
  const fetchCartItems = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const response = await Axios({
        ...SummaryApi.getCartItems,
      });

      if (response?.data?.success) {
        dispatch(handleAddItemCart(response.data.data || []));
      }
    } catch (error) {
      console.warn("Fetch cart error:", error?.message);
    }
  }, [isLoggedIn, dispatch]);

  // ================= ADD TO CART (GUEST + AUTH) =================
  const addItemToCart = useCallback(
    async (product) => {
      if (!product?._id) return;

      if (!isLoggedIn) {
        // Guest mode: save to guestCart
        setGuestCart((prev) => {
          const idx = prev.findIndex(
            (item) => item?.productId?._id === product._id
          );
          if (idx > -1) {
            const updated = [...prev];
            updated[idx] = {
              ...updated[idx],
              quantity: (updated[idx].quantity || 1) + 1,
            };
            return updated;
          }
          return [
            ...prev,
            {
              _id: `guest_${product._id}`,
              productId: product,
              quantity: 1,
            },
          ];
        });
        toast.success(`Added ${product.name} to cart`);
        return;
      }

      // Logged-in mode
      try {
        const response = await Axios({
          ...SummaryApi.addToCart,
          data: { productId: product._id },
        });

        if (response?.data?.success) {
          toast.success(response.data.message || "Added to cart");
          fetchCartItems();
        }
      } catch (error) {
        AxiosToastError(error);
      }
    },
    [isLoggedIn, fetchCartItems]
  );

  // ================= UPDATE QTY (GUEST + AUTH) =================
  const updateCartItemQty = useCallback(
    async (id, qty) => {
      if (!id) return;

      if (!isLoggedIn) {
        setGuestCart((prev) => {
          if (qty <= 0) {
            return prev.filter((item) => item._id !== id);
          }
          return prev.map((item) =>
            item._id === id ? { ...item, quantity: qty } : item
          );
        });
        return;
      }

      try {
        const response = await Axios({
          ...SummaryApi.updateCartItemQty,
          data: { _id: id, qty },
        });

        if (response?.data?.success) {
          fetchCartItems();
        }
      } catch (error) {
        AxiosToastError(error);
      }
    },
    [isLoggedIn, fetchCartItems]
  );

  // ================= CALCULATE TOTALS =================
  const { totalQty, totalPrice, originalTotal, totalSavings } = useMemo(() => {
    return (cartItem || []).reduce(
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

        acc.totalQty += quantity;
        acc.originalTotal += quantity * basePrice;
        acc.totalPrice += quantity * finalPrice;
        acc.totalSavings += quantity * (basePrice - finalPrice);

        return acc;
      },
      { totalQty: 0, totalPrice: 0, originalTotal: 0, totalSavings: 0 }
    );
  }, [cartItem]);

  // ================= FETCH ADDRESS =================
  const fetchAddress = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const response = await Axios({
        ...SummaryApi.getAddress,
      });

      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(handleAddAddress(responseData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    }
  }, [isLoggedIn, dispatch]);

  // ================= FETCH ORDER DETAILS =================
  const fetchOrderDetails = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const response = await Axios({
        ...SummaryApi.getOrderItems,
      });

      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(setOrder(responseData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    }
  }, [isLoggedIn, dispatch]);

  // ================= MERGE GUEST CART ON LOGIN =================
  const mergeGuestCart = useCallback(async () => {
    try {
      const guestItems = localStorage.getItem(GUEST_CART_KEY);
      if (!guestItems) return;
      const parsed = JSON.parse(guestItems);

      if (Array.isArray(parsed) && parsed.length > 0) {
        for (const item of parsed) {
          const pId = item?.productId?._id;
          if (pId) {
            try {
              await Axios({
                ...SummaryApi.addToCart,
                data: { productId: pId },
              });
            } catch {
              // continue merging next item
            }
          }
        }
        localStorage.removeItem(GUEST_CART_KEY);
        setGuestCart([]);
        fetchCartItems();
      }
    } catch (err) {
      console.warn("Guest cart merge error:", err);
    }
  }, [fetchCartItems]);

  // ================= USER STATE CHANGE =================
  useEffect(() => {
    if (user?._id) {
      fetchCartItems();
      fetchAddress();
      fetchOrderDetails();
      mergeGuestCart();
    } else {
      dispatch(handleAddItemCart([]));
    }
  }, [user?._id, fetchCartItems, fetchAddress, fetchOrderDetails, mergeGuestCart, dispatch]);

  return (
    <GlobalContext.Provider
      value={{
        fetchCartItems,
        updateCartItemQty,
        addItemToCart,
        fetchAddress,
        fetchOrderDetails,
        totalQty,
        totalPrice,
        cartItem,
        originalTotal,
        totalSavings,
        isLoggedIn,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
