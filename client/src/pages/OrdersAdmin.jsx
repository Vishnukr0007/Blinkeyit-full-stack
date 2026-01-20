import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import {
  Package,
  IndianRupee,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ChevronDown,
  User,
  Phone,
  Mail,
} from "lucide-react";
import DisplayPriceInRupees from "../utils/DisplayPriceInRupees";
import Loading from "../components/Loading";

const STATUS_OPTIONS = ["PENDING", "SHIPPED", "DELIVERED", "CANCELED"];

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getAllAdminOrders,
      });
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateOrderStatus,
        data: {
          orderId,
          status: newStatus,
        },
      });

      if (response.data.success) {
        toast.success("Order status updated");
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING": return <Clock className="text-amber-500" size={18} />;
      case "SHIPPED": return <Truck className="text-blue-500" size={18} />;
      case "DELIVERED": return <CheckCircle className="text-green-500" size={18} />;
      case "CANCELED": return <XCircle className="text-red-500" size={18} />;
      default: return <Package size={18} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "bg-amber-50 text-amber-700 border-amber-200";
      case "SHIPPED": return "bg-blue-50 text-blue-700 border-blue-200";
      case "DELIVERED": return "bg-green-50 text-green-700 border-green-200";
      case "CANCELED": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="bg-gray-50 min-h-screen py-4 sm:py-8">
      <div className="container mx-auto px-4 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Order Management
            </h1>
            <p className="text-gray-500 text-[11px] sm:text-xs mt-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Manage and track all customer orders
            </p>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-50">
            <div className="bg-green-50 p-2 sm:p-2.5 rounded-xl">
              <Package className="text-green-600" size={20} />
            </div>
            <div className="flex md:block items-baseline gap-2">
              <span className="block font-bold text-xl sm:text-2xl text-gray-800 leading-none">{orders.length}</span>
              <span className="text-gray-400 text-[9px] uppercase font-bold tracking-widest">Total Orders</span>
            </div>
          </div>
        </div>

        {!orders.length ? (
          <div className="bg-white rounded-2xl p-10 sm:p-20 text-center border-2 border-dashed border-gray-200 shadow-sm">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="text-gray-300" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">No orders found</h3>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto text-sm">When customers place orders, they will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
                {/* Order Header */}
                <div className="bg-gray-50/50 px-5 py-4 sm:px-8 sm:py-5 border-b border-gray-100/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                    <div className="bg-white py-1.5 px-3 rounded-xl border border-gray-100 shadow-xs">
                      <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black mb-0.5">Order ID</p>
                      <p className="text-xs font-mono font-bold text-gray-800">#{order.orderId}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black mb-0.5">Order Date</p>
                      <p className="text-xs font-bold text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit", month: "short", year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] sm:text-xs font-black tracking-wide shadow-xs whitespace-nowrap ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>

                    <div className="relative flex-1 sm:flex-none">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="appearance-none bg-green-600 hover:bg-green-700 text-white text-[10px] sm:text-xs font-bold py-2 sm:py-2.5 px-4 sm:px-6 pr-8 sm:pr-10 rounded-full cursor-pointer transition-all shadow-md active:scale-95 outline-none w-full"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt} className="bg-white text-gray-800 font-medium text-sm">
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white/80 pointer-events-none" size={14} />
                    </div>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-5 sm:p-8">
                  <div className="grid lg:grid-cols-12 gap-6 sm:gap-10">
                    {/* Product Details Section */}
                    <div className="lg:col-span-7 flex flex-row gap-4 sm:gap-8 items-start">
                      <div className="relative shrink-0 transition-transform duration-500 h-24 w-24 sm:h-32 sm:w-32">
                        <img
                          src={order.product_details?.image?.[0]}
                          alt={order.product_details?.name}
                          className="w-full h-full rounded-2xl object-cover border-2 border-white shadow-md"
                        />
                        <div className="absolute -top-2 -right-2 bg-green-600 text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-sm border border-green-500">
                          QTY: {order.quantity || 1}
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-3 sm:space-y-4">
                        <div>
                          <h3 className="text-sm sm:text-lg font-bold text-gray-900 leading-tight group-hover:text-green-600 transition-colors line-clamp-2">
                            {order.product_details?.name}
                          </h3>
                        </div>

                        <div className="flex items-center gap-4 sm:gap-8 py-2.5 sm:py-3 px-4 bg-gray-50 rounded-2xl border border-gray-100 w-fit">
                          <div>
                            <p className="text-[9px] text-gray-400 font-black uppercase mb-0.5 tracking-widest">Amount</p>
                            <div className="flex items-center gap-0.5 text-green-600 font-black text-base sm:text-xl">
                              <IndianRupee size={14} className="sm:hidden" />
                              <IndianRupee size={18} className="hidden sm:block" />
                              <span>{order.totalAmt}</span>
                            </div>
                          </div>
                          <div className="w-px h-6 sm:h-8 bg-gray-200"></div>
                          <div>
                            <p className="text-[9px] text-gray-400 font-black uppercase mb-0.5 tracking-widest">Payment</p>
                            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-gray-600">
                              <span className={`w-1.5 h-1.5 rounded-full ${order.payment_status === "PAID" ? "bg-green-500" : "bg-amber-500"}`}></span>
                              {order.payment_status}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Customer & Shipping Section */}
                    <div className="lg:col-span-5">
                      <div className="bg-white/50 p-5 sm:p-6 rounded-2xl border border-gray-100 relative overflow-hidden h-full">
                        <div className="flex items-center gap-3 mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-gray-100">
                          <div className="bg-green-50 p-2 rounded-xl text-green-600 shadow-xs">
                            <User size={16} sm:size={18} className="font-bold" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">Customer</p>
                            <p className="text-xs sm:text-sm font-bold text-gray-800">{order.userId?.name || "Customer"}</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
                            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50/50 rounded-xl border border-gray-100 flex-1 min-w-0">
                              <Mail size={12} className="text-gray-400 shrink-0" />
                              <span className="text-[10px] sm:text-xs font-semibold text-gray-600 truncate">{order.userId?.email || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50/50 rounded-xl border border-gray-100 shrink-0">
                              <Phone size={12} className="text-gray-400 shrink-0" />
                              <span className="text-[10px] sm:text-xs font-semibold text-gray-600">{order.userId?.mobile || "N/A"}</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 sm:gap-4 pt-1">
                            <div className="bg-rose-50 p-2 rounded-xl text-rose-500 mt-0.5 shrink-0">
                              <MapPin size={16} sm:size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1.5">Destination</p>
                              <div className="text-[10px] sm:text-[11px] font-bold text-gray-700 leading-relaxed uppercase tracking-tight">
                                {order.delivery_address ? (
                                  <>
                                    <span className="block text-gray-900 mb-0.5 normal-case font-black text-xs">{order.delivery_address.fullName}</span>
                                    <span className="font-medium text-gray-500 block">
                                      {order.delivery_address.address_line}, {order.delivery_address.city}, {order.delivery_address.state} - {order.delivery_address.pincode}
                                    </span>
                                    <span className="inline-block mt-2 text-[8px] px-1.5 py-0.5 bg-green-50 text-green-600 rounded-md font-black border border-green-100">
                                      {order.delivery_address.addressType}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-gray-400 italic font-medium normal-case">No address provided</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
export default OrdersAdmin;
