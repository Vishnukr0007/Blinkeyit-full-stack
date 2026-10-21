import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { handleAddAddress } from "../store/addressSlice";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";

/**
 * useAddress: Reusable Address Management Hook
 */
export const useAddress = () => {
  const dispatch = useDispatch();
  const addressList = useSelector((state) => state.address?.addressList || []);
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Fetch all active addresses
  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Axios({ ...SummaryApi.getAddress });
      if (response?.data?.success) {
        const list = response.data.data || [];
        dispatch(handleAddAddress(list));
        // Auto-select first address if none selected
        if (list.length > 0 && !selectedAddress) {
          setSelectedAddress(list[0]);
        }
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, selectedAddress]);

  // Add new address
  const addAddress = useCallback(
    async (addressData) => {
      try {
        setLoading(true);
        const response = await Axios({
          ...SummaryApi.createAddress,
          data: addressData,
        });

        if (response?.data?.success) {
          toast.success(response.data.message || "Address saved successfully");
          await fetchAddresses();
          return { success: true, data: response.data.data };
        }
        return { success: false };
      } catch (error) {
        AxiosToastError(error);
        return { success: false, error };
      } finally {
        setLoading(false);
      }
    },
    [fetchAddresses]
  );

  // Update address
  const updateAddress = useCallback(
    async (addressData) => {
      try {
        setLoading(true);
        const response = await Axios({
          ...SummaryApi.updateAddress,
          data: addressData,
        });

        if (response?.data?.success) {
          toast.success(response.data.message || "Address updated successfully");
          await fetchAddresses();
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
    [fetchAddresses]
  );

  // Remove/Disable address
  const removeAddress = useCallback(
    async (id) => {
      try {
        setLoading(true);
        const response = await Axios({
          ...SummaryApi.disableAddress,
          data: { _id: id },
        });

        if (response?.data?.success) {
          toast.success(response.data.message || "Address removed");
          await fetchAddresses();
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
    [fetchAddresses]
  );

  return {
    addressList,
    loading,
    selectedAddress,
    setSelectedAddress,
    fetchAddresses,
    addAddress,
    updateAddress,
    removeAddress,
  };
};

export default useAddress;
