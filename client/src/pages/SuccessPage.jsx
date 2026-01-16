import { CheckCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";

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
          // Optional: Clear any local text if needed or just let the user see success
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
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-md p-6 text-center">

        {/* SUCCESS ICON */}
        <div className="flex justify-center mb-4">
          <CheckCircle
            size={72}
            className="text-green-600"
          />
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 p-2">
          {Boolean(location?.state?.text) ? location?.state?.text : "Payment"} Successful!
        </h2>

        {/* SUB TEXT */}
        <p className="text-gray-600 text-sm mb-6">
            {loading ? "Verifying your order details..." : "Thank you for your order. Your items will be delivered soon."}
        </p>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/dashboard/my-orders")}
            className="w-full bg-green-700 hover:bg-green-800 cursor-pointer text-white py-3 rounded-xl font-semibold transition"
          >
            View My Orders
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full border border-gray-300 hover:bg-gray-100 py-3 cursor-pointer rounded-xl font-semibold text-gray-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </section>
  );
};

export default SuccessPage;
