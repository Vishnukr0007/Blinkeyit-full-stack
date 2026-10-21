import { IoClose } from "react-icons/io5";
import { FaCaretRight } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import { priceWithDiscount } from "../utils/priceWithDiscount";
import AddTocartButton from "./AddTocartButton";
import EmptyCartImage from "../assets/empty_cart.webp";
import { useSelector } from "react-redux";
import SmartCartHeader from "./SmartCartHeader";
import toast from "react-hot-toast";

const DisplayCartItem = ({ close }) => {
  const user = useSelector((state) => state?.user);
  const navigate = useNavigate();

  const {
    cartItem = [],
    totalQty = 0,
    totalPrice = 0,
    originalTotal = 0,
    totalSavings = 0,
  } = useGlobalContext();

  const handleCloseDrawer = () => {
    if (typeof close === "function") {
      close();
    } else {
      window.history.back();
    }
  };

  const redirectToCheckoutPage = () => {
    if (user?._id) {
      navigate("/checkout");
      if (close) close();
      return;
    }

    toast("Please log in to proceed with checkout", { icon: "🔐" });
    navigate("/login", { state: { redirectTo: "/checkout" } });
    if (close) close();
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-xs transition-opacity duration-300">
      {/* Background click to dismiss */}
      <div className="flex-1" onClick={handleCloseDrawer} />

      {/* ================= RIGHT DRAWER ================= */}
      <div className="bg-slate-50 w-full max-w-md ml-auto h-full flex flex-col shadow-2xl animate-slideIn">
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100 shadow-xs">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-base text-gray-900">
              My Cart
            </h2>
            <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {totalQty} {totalQty === 1 ? "Item" : "Items"}
            </span>
          </div>

          <button
            onClick={handleCloseDrawer}
            title="Close cart"
            className="p-1 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition cursor-pointer"
          >
            <IoClose size={22} />
          </button>
        </div>

        {/* ================= SMART CART HEALTH & DELIVERY BAR ================= */}
        {cartItem.length > 0 && (
          <div className="px-3 pt-3">
            <SmartCartHeader
              totalPrice={totalPrice}
              originalTotal={originalTotal}
              totalSavings={totalSavings}
            />
          </div>
        )}

        {/* ================= CART ITEMS LIST ================= */}
        <div className="flex-1 overflow-y-auto bg-slate-100 px-4 py-3 space-y-3">
          {cartItem.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-24 text-gray-500 text-center px-4">
              <img
                src={EmptyCartImage}
                alt="Empty cart"
                className="w-44 object-contain opacity-90 mb-2"
              />
              <h3 className="text-lg font-bold text-gray-800">Your cart is empty</h3>
              <p className="text-xs text-gray-500 max-w-xs mt-1 mb-6">
                Explore thousands of items and get them delivered in 10 minutes.
              </p>
              <button
                onClick={handleCloseDrawer}
                className="bg-green-700 hover:bg-green-800 px-6 py-2.5 rounded-xl font-semibold text-white shadow-md transition active:scale-95 cursor-pointer text-sm"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItem.map((item) => {
              const product = item?.productId || item?.product || {};
              const price = Number(product.price) || 0;
              const discount = Number(product.discount) || 0;
              const finalPrice = priceWithDiscount(price, discount);

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl p-3 shadow-xs border border-gray-100 flex gap-3 transition hover:shadow-sm"
                >
                  {/* IMAGE */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden">
                    <img
                      src={product.image?.[0] || "/placeholder.png"}
                      alt={product.name || "Product"}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
                        {product.name}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {product.unit}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* PRICE */}
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs sm:text-sm font-bold text-gray-900">
                          {DisplayPriceInRupees(item.quantity * finalPrice)}
                        </span>
                        {discount > 0 && (
                          <span className="text-[10px] text-gray-400 line-through">
                            {DisplayPriceInRupees(item.quantity * price)}
                          </span>
                        )}
                      </div>

                      {/* QTY CONTROL */}
                      <AddTocartButton data={product} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ================= FOOTER / CHECKOUT BAR ================= */}
        {cartItem.length > 0 && (
          <div className="bg-white p-4 border-t border-gray-100 shadow-lg space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">{DisplayPriceInRupees(totalPrice)}</span>
            </div>

            {totalSavings > 0 && (
              <div className="flex items-center justify-between text-xs text-green-700 bg-green-50 px-2 py-1 rounded-lg font-medium">
                <span>Total Savings</span>
                <span className="font-bold">-{DisplayPriceInRupees(totalSavings)}</span>
              </div>
            )}

            <button
              onClick={redirectToCheckoutPage}
              className="w-full flex items-center justify-between bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 px-5 rounded-2xl shadow-md transition active:scale-98 cursor-pointer"
            >
              <div className="text-left">
                <p className="text-sm leading-none">{DisplayPriceInRupees(totalPrice)}</p>
                <p className="text-[10px] font-normal opacity-90 mt-0.5">TOTAL</p>
              </div>

              <div className="flex items-center gap-1 text-sm font-bold">
                <span>Proceed to Checkout</span>
                <FaCaretRight size={16} />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayCartItem;
