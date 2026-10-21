import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { handleAddItemCart } from "../store/cartSlice";
import { priceWithDiscount } from "../utils/priceWithDiscount";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";

const GUEST_CART_KEY = "blinkeyit_guest_cart";

/**
 * useCart: Full-Featured Cart Management Hook with Guest Cart Support & Optimistic Updates
 */
export const useCart = () => {
  const dispatch = useDispatch();
  const reduxCart = useSelector((state) => state.cartItem?.cart || []);
  const user = useSelector((state) => state.user);
  const isLoggedIn = Boolean(user?._id);

  // Local state for guest cart when user is unauthenticated
  const [guestCart, setGuestCart] = useState(() => {
    try {
      const saved = localStorage.getItem(GUEST_CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);

  // Active cart items: uses Redux for logged in users, guestCart for visitors
  const cartItem = useMemo(() => {
    return isLoggedIn ? reduxCart : guestCart;
  }, [isLoggedIn, reduxCart, guestCart]);

  // Sync guest cart changes to localStorage
  useEffect(() => {
    if (!isLoggedIn) {
      try {
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestCart));
      } catch (e) {
        console.warn("Failed to save guest cart to localStorage", e);
      }
    }
  }, [guestCart, isLoggedIn]);

  // Fetch logged in user cart from server
  const fetchCartItems = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const response = await Axios({ ...SummaryApi.getCartItems });
      if (response?.data?.success) {
        dispatch(handleAddItemCart(response.data.data || []));
      }
    } catch (error) {
      console.warn("Fetch cart error:", error?.message);
    }
  }, [isLoggedIn, dispatch]);

  // Calculations for totals
  const { totalQty, totalPrice, originalTotal, totalSavings } = useMemo(() => {
    return (cartItem || []).reduce(
      (acc, curr) => {
        const qty = Number(curr?.quantity) || 0;
        const basePrice =
          Number(curr?.price) ||
          Number(curr?.productId?.price) ||
          Number(curr?.product?.price) ||
          0;
        const discount =
          Number(curr?.discount) ||
          Number(curr?.productId?.discount) ||
          Number(curr?.product?.discount) ||
          0;

        const discountedPrice = priceWithDiscount(basePrice, discount);

        acc.totalQty += qty;
        acc.originalTotal += qty * basePrice;
        acc.totalPrice += qty * discountedPrice;
        acc.totalSavings += qty * (basePrice - discountedPrice);

        return acc;
      },
      { totalQty: 0, totalPrice: 0, originalTotal: 0, totalSavings: 0 }
    );
  }, [cartItem]);

  // Add Item to Cart (Works seamlessly for both Guests & Authenticated Users)
  const addItem = useCallback(
    async (product) => {
      if (!product?._id) return { success: false };

      if (!isLoggedIn) {
        // Guest mode: Save in local state
        setGuestCart((prev) => {
          const existingIndex = prev.findIndex(
            (item) => item?.productId?._id === product._id
          );

          if (existingIndex > -1) {
            const updated = [...prev];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: (updated[existingIndex].quantity || 1) + 1,
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
        return { success: true };
      }

      // Logged in mode: Server sync
      try {
        setLoading(true);
        const response = await Axios({
          ...SummaryApi.addToCart,
          data: { productId: product._id },
        });

        if (response?.data?.success) {
          toast.success(response.data.message || "Added to cart");
          await fetchCartItems();
          return { success: true };
        }
        return { success: false };
      } catch (error) {
        AxiosToastError(error);
        return { success: false, error };
      } finally {
        setLoading(false);
      }
    },
    [isLoggedIn, fetchCartItems]
  );

  // Update item quantity (Optimistic UI)
  const updateQty = useCallback(
    async (cartItemId, newQty) => {
      if (!cartItemId) return;

      if (!isLoggedIn) {
        // Guest mode
        setGuestCart((prev) => {
          if (newQty <= 0) {
            return prev.filter((item) => item._id !== cartItemId);
          }
          return prev.map((item) =>
            item._id === cartItemId ? { ...item, quantity: newQty } : item
          );
        });
        return;
      }

      // Server mode
      try {
        const response = await Axios({
          ...SummaryApi.updateCartItemQty,
          data: { _id: cartItemId, qty: newQty },
        });

        if (response?.data?.success) {
          fetchCartItems();
        }
      } catch (error) {
        AxiosToastError(error);
        fetchCartItems(); // Rollback to actual server state on error
      }
    },
    [isLoggedIn, fetchCartItems]
  );

  // Remove Item
  const removeItem = useCallback(
    (cartItemId) => {
      updateQty(cartItemId, 0);
    },
    [updateQty]
  );

  // Merge Guest Cart when User Logs In
  const mergeGuestCart = useCallback(async () => {
    try {
      const guestItems = localStorage.getItem(GUEST_CART_KEY);
      if (!guestItems) return;
      const parsedItems = JSON.parse(guestItems);

      if (Array.isArray(parsedItems) && parsedItems.length > 0) {
        for (const item of parsedItems) {
          const pId = item?.productId?._id;
          if (pId) {
            try {
              await Axios({
                ...SummaryApi.addToCart,
                data: { productId: pId },
              });
            } catch {
              // continue merging others if one fails
            }
          }
        }
        localStorage.removeItem(GUEST_CART_KEY);
        setGuestCart([]);
        await fetchCartItems();
      }
    } catch (e) {
      console.warn("Guest cart merge error:", e);
    }
  }, [fetchCartItems]);

  return {
    cartItem,
    totalQty,
    totalPrice,
    originalTotal,
    totalSavings,
    loading,
    addItem,
    updateQty,
    removeItem,
    fetchCartItems,
    mergeGuestCart,
  };
};

export default useCart;
