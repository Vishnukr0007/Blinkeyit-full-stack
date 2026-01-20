import { useSelector } from "react-redux";
import {
  Package,
  IndianRupee,
  MapPin,
  ChevronDown,
  ChevronUp,
  FileText,
  Truck,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";

const STATUS_STEPS = ["PENDING", "SHIPPED", "DELIVERED"];

const MyOrders = () => {
  const orders = useSelector((state) => state?.orders?.order) || [];
  const [openOrderId, setOpenOrderId] = useState(null);

  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
        <Package size={44} className="mb-3 opacity-40" />
        <p className="text-base font-medium">No orders found</p>
        <p className="text-xs mt-1">Your orders will appear here</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-5">
      <h2 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-6">
        My Orders
      </h2>

      <div className="space-y-4">
        {orders.map((order) => {
          const isOpen = openOrderId === order._id;

          return (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* ===== HEADER ===== */}
              <div className="px-4 py-3 flex justify-between items-center">
                <div>
                  <p className="text-[11px] text-gray-500">Order ID</p>
                  <p className="text-xs font-medium">
                    {order.orderId}
                  </p>
                </div>

                <button
                  onClick={() =>
                    setOpenOrderId(isOpen ? null : order._id)
                  }
                  className="flex items-center gap-1 text-xs font-medium text-green-600"
                >
                  {isOpen ? "Hide" : "View"}
                  {isOpen ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
              </div>

              {/* ===== PRODUCT ===== */}
              <div className="px-4 pb-3 flex gap-3">
                <img
                  src={order.product_details?.image?.[0]}
                  alt={order.product_details?.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border"
                />

                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-semibold line-clamp-2">
                    {order.product_details?.name}
                  </h3>

                  <div className="flex items-center gap-1 mt-1 text-gray-700">
                    <IndianRupee size={13} />
                    <span className="text-sm font-medium">
                      {order.totalAmt}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* ===== EXPANDABLE ===== */}
              {isOpen && (
                <div className="border-t px-4 py-4 space-y-4 animate-fadeIn">
                  {/* 🚚 STATUS */}
                  <div>
                    <p className="text-xs font-medium mb-3">
                      Order Status
                    </p>
                    <div className="flex justify-between items-center relative">
                      <div className="absolute top-2 left-0 w-full h-0.5 bg-gray-100 -z-10" />
                      {STATUS_STEPS.map((step, index) => {
                        const currentStatusIndex = STATUS_STEPS.indexOf(order.status || "PENDING");
                        const active = currentStatusIndex >= index && order.status !== "CANCELED";
                        const isCanceled = order.status === "CANCELED";

                        return (
                          <div
                            key={step}
                            className="flex flex-col items-center flex-1"
                          >
                            <div className="bg-white px-2 relative z-10">
                            {isCanceled ? (
                              <XCircle
                                size={16}
                                className="text-red-500"
                              />
                            ) : active ? (
                              <CheckCircle
                                size={16}
                                className="text-green-600"
                              />
                            ) : (
                              <Truck
                                size={16}
                                className="text-gray-300"
                              />
                            )}
                            </div>

                            <span
                              className={`mt-1 text-[10px] sm:text-xs text-center font-medium ${
                                isCanceled ? "text-red-500" :
                                active
                                  ? "text-green-600"
                                  : "text-gray-400"
                              }`}
                            >
                              {isCanceled && index === currentStatusIndex ? "CANCELED" : step.replaceAll("_", " ")}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 📍 ADDRESS */}
                  <div className="flex gap-2">
                    <MapPin
                      size={16}
                      className="text-green-600 mt-0.5"
                    />
                    <div>
                      <p className="text-[11px] text-gray-500">
                        Delivering to
                      </p>
                      <p className="text-xs sm:text-sm font-medium">
                        {order.delivery_address?.fullAddress ||
                          "Saved delivery address"}
                      </p>
                    </div>
                  </div>

                  {/* 📄 INVOICE */}
                  <button
                    className="flex items-center gap-2 text-xs sm:text-sm font-medium text-green-600"
                    onClick={() =>
                      alert("Invoice download integration here")
                    }
                  >
                    <FileText size={15} />
                    Download Invoice
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
