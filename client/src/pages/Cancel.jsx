import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-md p-6 text-center">

        {/* CANCEL ICON */}
        <div className="flex justify-center mb-4">
          <XCircle
            size={72}
            className="text-red-600"
          />
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Payment Cancelled
        </h2>

        {/* SUB TEXT */}
        <p className="text-gray-600 text-sm mb-6">
          Your payment was not completed. Don’t worry, no amount has been
          deducted.
        </p>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition"
          >
            Retry Payment
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full border border-gray-300 hover:bg-gray-100 py-3 rounded-xl font-semibold text-gray-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </section>
  );
};

export default Cancel;
