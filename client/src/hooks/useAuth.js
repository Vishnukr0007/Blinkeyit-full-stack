import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { setUserDetails, logout as logoutAction } from "../store/userSlice";
import { handleAddItemCart } from "../store/cartSlice";
import { handleAddAddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";

/**
 * useAuth: Centralized Authentication & Session Management Hook
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [authLoading, setAuthLoading] = useState(false);

  const isLoggedIn = Boolean(user?._id);
  const isAdmin = user?.role === "ADMIN";

  // Fetch and update user profile in Redux
  const fetchUserProfile = useCallback(async () => {
    try {
      setAuthLoading(true);
      const response = await Axios({ ...SummaryApi.userDetails });
      if (response?.data?.success && response?.data?.data) {
        dispatch(setUserDetails(response.data.data));
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.warn("Failed to fetch user profile:", error?.message);
      return null;
    } finally {
      setAuthLoading(false);
    }
  }, [dispatch]);

  // Login handler
  const login = useCallback(
    async (email, password) => {
      try {
        setAuthLoading(true);
        const response = await Axios({
          ...SummaryApi.login,
          data: { email, password },
        });

        if (response.data.error) {
          toast.error(response.data.message || "Login failed");
          return { success: false, message: response.data.message };
        }

        if (response.data.success) {
          const { accesstoken, refreshtoken } = response.data.data;
          if (accesstoken) localStorage.setItem("accesstoken", accesstoken);
          if (refreshtoken) localStorage.setItem("refreshtoken", refreshtoken);

          toast.success(response.data.message || "Welcome back!");
          await fetchUserProfile();
          return { success: true };
        }
        return { success: false };
      } catch (error) {
        AxiosToastError(error);
        return { success: false, error };
      } finally {
        setAuthLoading(false);
      }
    },
    [fetchUserProfile]
  );

  // Logout handler (safely clears user session without destroying other storage)
  const logout = useCallback(async () => {
    try {
      setAuthLoading(true);
      const response = await Axios({ ...SummaryApi.logout });
      if (response?.data?.success) {
        toast.success(response.data.message || "Logged out successfully");
      }
    } catch (error) {
      console.warn("Logout request error:", error?.message);
    } finally {
      // Clear auth tokens specifically
      localStorage.removeItem("accesstoken");
      localStorage.removeItem("refreshtoken");

      // Reset Redux states
      dispatch(logoutAction());
      dispatch(handleAddItemCart([]));
      dispatch(handleAddAddress([]));
      dispatch(setOrder([]));

      setAuthLoading(false);
      navigate("/");
    }
  }, [dispatch, navigate]);

  return {
    user,
    isLoggedIn,
    isAdmin,
    authLoading,
    fetchUserProfile,
    login,
    logout,
  };
};

export default useAuth;
