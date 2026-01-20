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
  XCircle,
  Calendar,
} from "lucide-react";
import { useState } from "react";

const STATUS_STEPS = ["PENDING", "SHIPPED", "DELIVERED"];

const MyOrders = () => {
  const orders = useSelector((state) => state?.orders?.order) || [];
  const [openOrderId, setOpenOrderId] = useState(null);

  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mb-6">
          <Package size={48} className="text-gray-200" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">No orders found</h3>
        <p className="text-gray-500 mt-2 max-w-xs text-sm">When you place an order, it will appear here with all its details.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-green-600 p-2 rounded-xl text-white shadow-lg shadow-green-100">
           <Package size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            My Orders
          </h2>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Tracking {orders.length} active orders</p>
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const isOpen = openOrderId === order._id;

          return (
            <div
              key={order._id}
              className={`bg-white rounded-3xl border transition-all duration-300 ${
                isOpen ? "border-green-100 shadow-xl shadow-green-50/50" : "border-gray-100 shadow-sm hover:shadow-md"
              } overflow-hidden`}
            >
              {/* ===== HEADER ===== */}
              <div className="px-5 py-4 sm:px-8 sm:py-5 flex justify-between items-center bg-gray-50/50 border-b border-gray-100/50">
                <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                  <div className="bg-white py-1.5 px-3 rounded-lg border border-gray-100 shadow-xs">
                    <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black mb-0.5">Order ID</p>
                    <p className="text-[10px] sm:text-xs font-mono font-bold text-gray-800">#{order.orderId}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-gray-400" />
                    <p className="text-[10px] sm:text-xs font-bold text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setOpenOrderId(isOpen ? null : order._id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black transition-all ${
                    isOpen ? "bg-green-600 text-white shadow-lg shadow-green-200" : "bg-white text-green-600 border border-green-100 hover:bg-green-50"
                  }`}
                >
                  {isOpen ? "Close" : "Details"}
                  {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>

              {/* ===== SUMMARY CONTENT ===== */}
              <div className="p-5 sm:p-8 flex items-start gap-4 sm:gap-6">
                <div className="shrink-0 relative">
                  <img
                    src={order.product_details?.image?.[0]}
                    alt={order.product_details?.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white shadow-md"
                  />
                  <div className="absolute -top-2 -right-2 bg-green-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-sm border border-green-500">
                    QTY: {order.quantity || 1}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-lg font-extrabold text-gray-900 leading-tight mb-2 line-clamp-2">
                    {order.product_details?.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <div className="flex items-center gap-1.5 text-green-600 font-black text-base sm:text-xl">
                      <IndianRupee size={16} className="shrink-0" />
                      <span>{order.totalAmt}</span>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg border border-gray-100">
                      <div className={`w-1.5 h-1.5 rounded-full ${order.status === "DELIVERED" ? "bg-green-500" : order.status === "CANCELED" ? "bg-red-500" : "bg-amber-500"}`}></div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-600">{order.status || "PENDING"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== EXPANDABLE SECTION ===== */}
              {isOpen && (
                <div className="px-5 pb-5 sm:px-8 sm:pb-8 space-y-8 animate-fadeIn">
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>

                  {/* 🚚 STATUS STEPPER */}
                  <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 text-center">Tracking Details</p>
                    <div className="flex justify-between items-center relative max-w-sm mx-auto">
                      <div className="absolute top-[15px] left-0 w-full h-[2px] bg-gray-200 -z-0" />
                      {STATUS_STEPS.map((step, index) => {
                        const currentStatusIndex = STATUS_STEPS.indexOf(order.status || "PENDING");
                        const active = currentStatusIndex >= index && order.status !== "CANCELED";
                        const isCanceled = order.status === "CANCELED";

                        return (
                          <div key={step} className="flex flex-col items-center relative z-10 flex-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                              isCanceled && index === currentStatusIndex ? "bg-red-50 border-red-500 text-red-500" :
                              active ? "bg-green-600 border-green-600 text-white shadow-lg shadow-green-100" : "bg-white border-gray-200 text-gray-300"
                            }`}>
                              {isCanceled && index === currentStatusIndex ? <XCircle size={16} /> :
                               active ? <CheckCircle size={16} /> : <Truck size={16} />}
                            </div>
                            <span className={`mt-2 text-[9px] sm:text-[10px] font-black uppercase tracking-tight text-center ${
                              isCanceled && index === currentStatusIndex ? "text-red-500" :
                              active ? "text-green-700" : "text-gray-400"
                            }`}>
                              {isCanceled && index === currentStatusIndex ? "CANCELED" : step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* 📍 DELIVERY ADDRESS */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group/addr">
                       <MapPin size={40} className="absolute -right-2 -bottom-2 text-green-50 transition-transform group-hover/addr:scale-110" />
                       <div className="relative">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="bg-green-50 p-1.5 rounded-lg text-green-600">
                               <MapPin size={14} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Shipping To</p>
                          </div>
                          <div className="space-y-1">
                            {order.delivery_address ? (
                              <>
                                <p className="text-xs font-black text-gray-900">{order.delivery_address.fullName}</p>
                                <p className="text-[11px] font-bold text-gray-600 leading-relaxed uppercase tracking-tight">
                                  {order.delivery_address.address_line},<br />
                                  {order.delivery_address.city}, {order.delivery_address.state} - {order.delivery_address.pincode}
                                </p>
                                <span className="inline-block mt-2 text-[8px] px-1.5 py-0.5 bg-green-50 text-green-600 rounded-md font-black border border-green-100">
                                  {order.delivery_address.addressType || "HOME"}
                                </span>
                              </>
                            ) : (
                              <p className="text-[11px] font-bold text-gray-400 italic">No specific address details found</p>
                            )}
                          </div>
                       </div>
                    </div>

                    {/* 📄 ACTIONS */}
                    <div className="flex flex-col gap-3">
                       <button
                         onClick={() => alert("Redirecting to support...")}
                         className="flex items-center justify-between w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl text-xs font-black text-gray-700 hover:border-green-200 hover:bg-green-50/30 transition-all shadow-sm group/btn"
                       >
                         Need Help with Order?
                         <ChevronDown size={14} className="-rotate-90 text-gray-400 group-hover/btn:text-green-500" />
                       </button>

                       <button
                         onClick={() => alert("Invoice download integration here")}
                         className="flex items-center justify-between w-full px-5 py-4 bg-green-600 rounded-2xl text-xs font-black text-white hover:bg-green-700 transition-all shadow-lg shadow-green-100 group/inv"
                       >
                         <div className="flex items-center gap-3">
                           <FileText size={16} />
                           Download Invoice
                         </div>
                         <ChevronDown size={14} className="-rotate-90 opacity-60 group-hover/inv:opacity-100" />
                       </button>
                    </div>
                  </div>
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
