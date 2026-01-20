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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Order Management
          </h1>
          <p className="text-gray-500 text-sm mt-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            Manage and track all customer orders in real-time
          </p>
        </div>
        <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
          <div className="bg-green-50 p-2 rounded-xl">
            <Package className="text-green-600" size={24} />
          </div>
          <div>
            <span className="block font-bold text-2xl text-gray-800 leading-none">{orders.length}</span>
            <span className="text-gray-400 text-xs uppercase font-bold tracking-wider">Total Orders</span>
          </div>
        </div>
      </div>

      {!orders.length ? (
        <div className="bg-white rounded-[2.5rem] p-16 text-center border-2 border-dashed border-gray-200 shadow-sm">
          <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="text-gray-300" size={48} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">No orders found</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">When customers place orders, they will appear here with all details.</p>
        </div>
      ) : (
        <div className="grid gap-8">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
              {/* Order Header */}
              <div className="bg-gray-50/80 px-8 py-5 border-b border-gray-100 flex flex-wrap justify-between items-center gap-6">
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="bg-white py-2 px-4 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">Order ID</p>
                    <p className="text-sm font-mono font-bold text-gray-800">#{order.orderId}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">Order Date</p>
                    <p className="text-sm font-bold text-gray-800">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "long", year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-black tracking-wide shadow-sm ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>

                  <div className="relative group/select">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="appearance-none bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-6 pr-10 rounded-full cursor-pointer transition-all shadow-md active:scale-95 outline-none"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-white text-gray-800 font-medium">
                          {opt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 pointer-events-none group-hover/select:text-white transition-colors" size={14} />
                  </div>
                </div>
              </div>

              {/* Order Body */}
              <div className="p-8">
                <div className="grid lg:grid-cols-12 gap-10">
                  {/* Product Details Section */}
                  <div className="lg:col-span-7 flex flex-col md:flex-row gap-8 items-start">
                    <div className="relative group-hover:scale-105 transition-transform duration-500 w-full md:w-auto">
                      <img
                        src={order.product_details?.image?.[0]}
                        alt={order.product_details?.name}
                        className="w-full md:w-36 h-48 md:h-36 rounded-[1.5rem] object-cover border-4 border-white shadow-lg"
                      />
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-black text-indigo-600 shadow-sm border border-indigo-50">
                        QTY: {order.quantity || 1}
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-4 w-full">
                      <div>
                        <h3 className="text-xl font-extrabold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">
                          {order.product_details?.name}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-wider">Product Category Tag</p>
                      </div>

                      <div className="flex items-center gap-8 py-3 px-4 bg-gray-50 rounded-2xl border border-gray-100 w-fit">
                        <div>
                          <p className="text-[10px] text-gray-400 font-black uppercase mb-0.5 tracking-tighter">Amount Paid</p>
                          <div className="flex items-center gap-1 text-indigo-600 font-black text-xl">
                            <IndianRupee size={18} />
                            <span>{order.totalAmt}</span>
                          </div>
                        </div>
                        <div className="w-px h-8 bg-gray-200"></div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-black uppercase mb-0.5 tracking-tighter">Payment Status</p>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                            <span className={`w-2 h-2 rounded-full ${order.payment_status === "PAID" ? "bg-green-500" : "bg-amber-500"}`}></span>
                            {order.payment_status}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer & Shipping Section */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-indigo-50/30 p-6 rounded-[1.5rem] border border-indigo-100/50 relative overflow-hidden group/info">
                      <div className="absolute top-0 right-0 -m-4 w-24 h-24 bg-indigo-50 rounded-full opacity-20 group-hover/info:scale-110 transition-transform"></div>
                      
                      <div className="flex items-center gap-4 mb-5 pb-4 border-b border-indigo-100/30">
                        <div className="bg-white p-2.5 rounded-2xl shadow-sm text-indigo-600">
                          <User size={20} className="font-bold" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest leading-none mb-1">Customer Details</p>
                          <p className="text-sm font-bold text-gray-800">{order.userId?.name || "Anonymous Customer"}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl shadow-xs border border-gray-50 flex-1">
                            <Mail size={14} className="text-indigo-400" />
                            <span className="text-xs font-semibold text-gray-600 truncate">{order.userId?.email || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl shadow-xs border border-gray-50">
                            <Phone size={14} className="text-indigo-400" />
                            <span className="text-xs font-semibold text-gray-600">{order.userId?.mobile || "N/A"}</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 pt-2">
                          <div className="bg-rose-50 p-2.5 rounded-2xl text-rose-500 shadow-sm mt-1">
                            <MapPin size={20} />
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] text-rose-400 font-black uppercase tracking-widest leading-none mb-2">Delivery Destination</p>
                            <p className="text-xs font-bold text-gray-700 leading-relaxed">
                              {order.delivery_address ? (
                                <>
                                  <span className="block text-[11px] text-gray-900 mb-0.5">{order.delivery_address.fullName}</span>
                                  <span className="font-medium text-gray-600 uppercase tracking-tight">
                                    {order.delivery_address.address_line}, {order.delivery_address.city}, {order.delivery_address.state} - {order.delivery_address.pincode}
                                  </span>
                                  <span className="block mt-1 text-[10px] text-indigo-500 font-black">{order.delivery_address.addressType} ADDRESS</span>
                                </>
                              ) : (
                                "No delivery address details provided"
                              )}
                            </p>
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
  );
};
export default OrdersAdmin;
