import { CheckCircle } from "lucide-react";
import { useNavigate,useLocation } from "react-router-dom";

const SuccessPage = () => {
  const navigate = useNavigate();
  const location=useLocation();
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

          {Boolean(location?.state?.text)?location?.state?.text :" payment"}
           Placed Successfully!
        </h2>

        {/* SUB TEXT */}
        <p className="text-gray-600 text-sm mb-6">
          Thank you for your order. Your items will be delivered soon.
        </p>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/dashboard/my-orders")}
            className="w-full bg-green-700 hover:bg-green-800 cursor-pointer
             text-white py-3 rounded-xl font-semibold transition"
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
