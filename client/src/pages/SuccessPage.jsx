import { CheckCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import LiveDeliveryTracker from "../components/LiveDeliveryTracker";

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  
  // Get Session ID from URL
  const queryParams = new URLSearchParams(location.search);
  const session_id = queryParams.get("session_id");

  useEffect(() => {
    const verifyPayment = async () => {
      if (session_id) {
        setLoading(true);
        try {
          const response = await Axios({
            ...SummaryApi.payment_url_verify,
            params: { session_id: session_id }
          });
          console.log("Payment Verified", response.data);
        } catch (error) {
          console.error("Verification Failed", error);
        } finally {
          setLoading(false);
        }
      }
    };

    verifyPayment();
  }, [session_id]);

  return (
    <section className="min-h-screen py-10 bg-gray-50 px-4 container mx-auto">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl shadow-md p-6 text-center">
          {/* SUCCESS ICON */}
          <div className="flex justify-center mb-3">
            <CheckCircle
              size={64}
              className="text-green-600 animate-bounce"
            />
          </div>

          {/* TITLE */}
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            {Boolean(location?.state?.text) ? location?.state?.text : "Order"} Confirmed!
          </h2>

          {/* SUB TEXT */}
          <p className="text-gray-600 text-sm mb-4">
              {loading ? "Verifying your order details..." : "Thank you for your order. Your 8-minute express delivery is underway!"}
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/dashboard/my-orders")}
              className="flex-1 bg-green-700 hover:bg-green-800 cursor-pointer text-white py-3 rounded-xl font-semibold transition"
            >
              View My Orders
            </button>

            <button
              onClick={() => navigate("/")}
              className="flex-1 border border-gray-300 hover:bg-gray-100 py-3 cursor-pointer rounded-xl font-semibold text-gray-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>

        {/* LIVE DELIVERY TRACKER & DRIVER MAP */}
        <LiveDeliveryTracker orderId={session_id ? session_id.slice(-8) : "ORD-8921"} />
      </div>
    </section>
  );
};

export default SuccessPage;
