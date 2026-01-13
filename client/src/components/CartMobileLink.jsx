import { FaCartShopping } from "react-icons/fa6";
import { useGlobalContext } from "../provider/GlobalProvider";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { Link, useLocation } from "react-router-dom";

const CartMobileLink = () => {
  const { totalQty, totalPrice } = useGlobalContext();
  const location = useLocation();

  // ✅ Hide if cart empty OR already on cart page
  if (!totalQty || location.pathname === "/cart") return null;

  return (
    <Link
      to="/cart"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50
                 w-[92%] max-w-md lg:hidden"
    >
      <button
        className="
          w-full flex items-center justify-between
          bg-green-700 hover:bg-green-800
          text-white
          px-4 py-3
          rounded-2xl
          shadow-lg
          transition
          active:scale-[0.98]
        "
      >
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <FaCartShopping size={18} />
          </div>

          <div className="text-left leading-tight">
            <p className="text-sm font-semibold">
              {totalQty} {totalQty === 1 ? "item" : "items"}
            </p>
            <p className="text-xs opacity-90">
              {DisplayPriceInRupees(totalPrice)}
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="text-sm font-semibold">
          View Cart →
        </div>
      </button>
    </Link>
  );
};

export default CartMobileLink;
