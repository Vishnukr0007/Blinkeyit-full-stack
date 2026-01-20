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
        // Update local state to avoid refetching
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
      case "PENDING":
        return <Clock className="text-amber-500" size={18} />;
      case "SHIPPED":
        return <Truck className="text-blue-500" size={18} />;
      case "DELIVERED":
        return <CheckCircle className="text-green-500" size={18} />;
      case "CANCELED":
        return <XCircle className="text-red-500" size={18} />;
      default:
        return <Package size={18} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "SHIPPED":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "DELIVERED":
        return "bg-green-50 text-green-700 border-green-200";
      case "CANCELED":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Order Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and track all customer orders
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
          <Package className="text-green-600" />
          <span className="font-semibold text-lg">{orders.length}</span>
          <span className="text-gray-500 text-sm">Total Orders</span>
        </div>
      </div>

      {!orders.length ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
          <Package className="mx-auto text-gray-300 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-700">
            No orders found
          </h3>
          <p className="text-gray-500 mt-2">When customers place orders, they will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Top Banner */}
              <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2 rounded-lg border border-gray-100">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                      Order ID
                    </p>
                    <p className="text-sm font-mono font-medium text-gray-700">
                      #{order.orderId}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                      Placed On
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>

                  <div className="relative group">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="appearance-none bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 px-4 pr-8 rounded-full cursor-pointer transition-colors outline-none"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-white text-gray-800">
                          {opt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none" size={14} />
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Product & Payment Info */}
                  <div className="flex gap-4">
                    <img
                      src={order.product_details?.image?.[0]}
                      alt={order.product_details?.name}
                      className="w-24 h-24 rounded-2xl object-cover border border-gray-100"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 line-clamp-2 leading-tight">
                        {order.product_details?.name}
                      </h3>
                      <div className="mt-3 flex items-center gap-2 text-green-600 font-bold text-lg">
                        <IndianRupee size={16} />
                        <span>{order.totalAmt}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <CheckCircle size={12} className="text-blue-500" />
                        {order.payment_status}
                      </p>
                    </div>
                  </div>

                  {/* Customer & Address Info */}
                  <div className="space-y-3 bg-gray-50/30 p-4 rounded-2xl border border-gray-100/50">
                    <div className="flex items-start gap-3">
                      <User size={16} className="text-gray-400 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800 leading-tight">
                          {order.userId?.name || "Customer"}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                          <span className="text-[11px] text-gray-500 flex items-center gap-1">
                            <Mail size={10} /> {order.userId?.email}
                          </span>
                          <span className="text-[11px] text-gray-500 flex items-center gap-1">
                            <Phone size={10} /> {order.userId?.mobile}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 pt-2 border-t border-gray-100">
                      <MapPin size={16} className="text-red-500 mt-1" />
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">
                          Delivery Address
                        </p>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {order.delivery_address?.fullAddress || "No address provided"}
                        </p>
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
