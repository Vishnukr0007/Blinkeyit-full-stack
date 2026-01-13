import { useState } from "react";
import { useGlobalContext } from "../provider/GlobalProvider";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import AddAddress from "../components/AddAddress";
import { useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

const CheckoutPage = () => {
  const {
    cartItem = [],
    totalPrice = 0,
    originalTotal = 0,
    totalSavings = 0,
    fetchCartItems,
  } = useGlobalContext();

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [openAddress, setOpenAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const addressList = useSelector((state) => state?.address?.addressList) || [];

  const navigate = useNavigate();

  /* ================= CASH ON DELIVERY ================= */
  const handleCashOnDelivery = async () => {
    try {
      if (!selectedAddress) return toast.error("Select delivery address");
      if (cartItem.length === 0) return toast.error("Cart is empty");

      const response = await Axios({
        ...SummaryApi.cashOnDeliveryOrder,
        data: {
          list_items: cartItem,
          addressId: selectedAddress._id,
          subTotalAmt: originalTotal,
          totalAmt: totalPrice,
        },
      });

      if (response?.data?.success) {
        toast.success("Order placed successfully");
        fetchCartItems?.();
        navigate("/success");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

 const handleOnlinePayment = async () => {
  try {
    if (!selectedAddress) return toast.error("Select delivery address");
    if (!cartItem.length) return toast.error("Cart is empty");

    const toastId = toast.loading("Redirecting to payment...");

    const stripe = await loadStripe(
      import.meta.env.VITE_STRIPE_PUBLIC_KEY
    );

    if (!stripe) {
      toast.dismiss(toastId);
      return toast.error("Stripe failed to load");
    }

    const response = await Axios.post(
      SummaryApi.payment_url.url,
      {
        list_items: cartItem,
        addressId: selectedAddress._id,
      },
      {
        withCredentials: true,
      }
    );

    toast.dismiss(toastId);

    if (!response?.data?.id) {
      return toast.error("Payment session not created");
    }

    await stripe.redirectToCheckout({
      sessionId: response.data.id,
    });
  } catch (error) {
    toast.dismiss();
    AxiosToastError(error);
  }
};



  return (
    <section className="bg-gray-50 min-h-screen py-6">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ADDRESS */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl shadow">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold">Delivery Address</h3>
            <button
              onClick={() => setOpenAddress(true)}
              className="text-green-700"
            >
              + Add Address
            </button>
          </div>

          {addressList.map(
            (address) =>
              address.status && (
                <label
                  key={address._id}
                  className={`block border p-4 rounded-xl cursor-pointer mb-3 ${
                    selectedAddress?._id === address._id
                      ? "border-green-700 bg-green-50"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    checked={selectedAddress?._id === address._id}
                    onChange={() => setSelectedAddress(address)}
                  />
                  <p className="font-medium">{address.fullName}</p>
                  <p className="text-sm text-gray-600">
                    {address.address_line}, {address.city}
                  </p>
                </label>
              )
          )}
        </div>

        {openAddress && <AddAddress close={() => setOpenAddress(false)} />}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          {/* TITLE */}
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Bill details
          </h3>

          {/* BILL ROWS */}
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Items total</span>
              <span className="font-medium">
                {DisplayPriceInRupees(originalTotal)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Delivery charge</span>
              <span className="text-green-700 font-medium">FREE</span>
            </div>

            <div className="flex justify-between">
              <span>Handling charge</span>
              <span>{DisplayPriceInRupees(0)}</span>
            </div>

            {totalSavings > 0 && (
              <div className="flex justify-between text-green-700 font-medium">
                <span>You saved</span>
                <span>- {DisplayPriceInRupees(totalSavings)}</span>
              </div>
            )}

            <div className="border-t pt-3 flex justify-between text-base font-semibold text-gray-900">
              <span>Grand total</span>
              <span>{DisplayPriceInRupees(totalPrice)}</span>
            </div>
          </div>

          {/* PAYMENT METHOD */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Payment method
            </h4>

            <div className="space-y-3">
              {/* COD */}
              <label
                className={`flex items-center justify-between border rounded-xl px-4 py-3 cursor-pointer transition
        ${
          paymentMethod === "COD"
            ? "border-green-700 bg-green-50"
            : "hover:border-gray-300"
        }`}
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Cash on Delivery
                  </p>
                  <p className="text-xs text-gray-500">
                    Pay when order arrives
                  </p>
                </div>
                <input
                  type="radio"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
              </label>

              {/* ONLINE */}
              <label
                className={`flex items-center justify-between border rounded-xl px-4 py-3 cursor-pointer transition
        ${
          paymentMethod === "ONLINE"
            ? "border-green-700 bg-green-50"
            : "hover:border-gray-300"
        }`}
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Online payment
                  </p>
                  <p className="text-xs text-gray-500">
                    UPI / Card / Net Banking
                  </p>
                </div>
                <input
                  type="radio"
                  checked={paymentMethod === "ONLINE"}
                  onChange={() => setPaymentMethod("ONLINE")}
                />
              </label>
            </div>
          </div>

          {/* PLACE ORDER BUTTON */}
          <button
            onClick={
              paymentMethod === "COD"
                ? handleCashOnDelivery
                : handleOnlinePayment
            }
            className="w-full mt-6 bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-semibold transition"
          >
            Place order
          </button>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
