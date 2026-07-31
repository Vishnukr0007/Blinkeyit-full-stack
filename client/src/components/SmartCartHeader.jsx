import { FaHeartbeat, FaTruck, FaLeaf, FaDumbbell, FaShieldAlt } from "react-icons/fa";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";

const SmartCartHeader = ({ totalPrice = 0, originalTotal = 0, totalSavings = 0 }) => {
  const freeDeliveryThreshold = 250;
  const remainingForFreeDelivery = Math.max(freeDeliveryThreshold - totalPrice, 0);
  const freeDeliveryProgress = Math.min((totalPrice / freeDeliveryThreshold) * 100, 100);

  return (
    <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 p-4 rounded-2xl border border-emerald-100 space-y-3 mb-4">
      {/* FREE DELIVERY PROGRESS BAR */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="flex items-center gap-1.5 text-emerald-900">
            <FaTruck className="text-emerald-600" />
            {remainingForFreeDelivery === 0 ? (
              <strong className="text-emerald-700">🎉 FREE Express Delivery Unlocked!</strong>
            ) : (
              <span>
                Add <strong>{DisplayPriceInRupees(remainingForFreeDelivery)}</strong> more for FREE Delivery
              </span>
            )}
          </span>
          <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded font-extrabold">
            {Math.round(freeDeliveryProgress)}%
          </span>
        </div>

        <div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
          <div
            style={{ width: `${freeDeliveryProgress}%` }}
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
          />
        </div>
      </div>

      {/* HEALTH & DIETARY SMART BADGES */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-emerald-100 text-[11px]">
        <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 text-emerald-800 font-bold shadow-2xs">
          <FaHeartbeat className="text-rose-500" />
          <span>Health Score: 84% (High)</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-0.5 rounded font-bold">
            <FaLeaf size={9} /> 100% Veg Cart
          </span>
          <span className="flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
            <FaDumbbell size={9} /> High Protein
          </span>
        </div>
      </div>

      {totalSavings > 0 && (
        <div className="bg-emerald-600 text-white text-xs font-bold text-center py-1.5 rounded-xl shadow-xs">
          💰 Smart Cart Savings: You save {DisplayPriceInRupees(totalSavings)} on this order!
        </div>
      )}
    </div>
  );
};

export default SmartCartHeader;
