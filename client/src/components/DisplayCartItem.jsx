import { IoClose } from "react-icons/io5";
import { FaCaretRight } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import { priceWithDiscount } from "../utils/priceWithDiscount";
import AddTocartButton from "./AddTocartButton";
import EmptyCartImage from "../assets/empty_cart.webp";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const DisplayCartItem = ({ close }) => {
  const user =useSelector(state=>state?.user)
  const naviagate=useNavigate()
  const {
    cartItem = [],
    totalQty = 0,
    totalPrice = 0,
    originalTotal = 0,
    totalSavings = 0,
  } = useGlobalContext();

  const  redirectToCheckoutPage=()=>{
    if(user?._id){

      naviagate("/checkout")
      if(close){
      close()
       }
       return 
    }
    
   
    toast("please Login")

  }

  return (
    <div className="fixed inset-0 z-50 flex bg-black/60">
      {/* ================= RIGHT DRAWER ================= */}
      <div className="bg-slate-50 w-full max-w-sm ml-auto h-full flex flex-col animate-slideIn">

        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between px-4 py-3 bg-white shadow-sm">
          <h2 className="font-semibold text-base">
            My Cart ({totalQty})
          </h2>

          <Link to="/" className="lg:hidden cursor-pointer">
            <IoClose size={22} />
          </Link>

          <button
            onClick={close}
            className="hidden lg:block cursor-pointer"
          >
            <IoClose size={22} />
          </button>
        </div>

        {/* ================= SAVINGS BAR ================= */}
        {totalSavings > 0 && (
          <div className="bg-blue-100 border border-blue-200 px-3 py-3 mt-3 mx-4 rounded-2xl">
            <p className="text-sm font-medium text-blue-700">
              🎉 You saved {DisplayPriceInRupees(totalSavings)} on this order
            </p>
          </div>
        )}

        {/* ================= CART ITEMS ================= */}
        <div className="flex-1 overflow-y-auto bg-slate-100 px-3 py-3 space-y-3">
          {cartItem.length === 0 ? (
            <div className="flex flex-col items-center mt-24 text-gray-500">
              <img
                src={EmptyCartImage}
                alt="Empty cart"
                className="w-40 opacity-80"
              />
              <p className="text-sm mt-3 p-2">Your cart is empty</p>
              <Link onClick={close} to={"/"} className="block bg-green-700 hover:bg-green-600 px-4 py-2 rounded text-white cursor-pointer">Shop Now</Link>
            </div>
          ) : (
            cartItem.map((item) => {
              const price = Number(item?.productId?.price) || 0;
              const discount = Number(item?.productId?.discount) || 0;
              const finalPrice = priceWithDiscount(price, discount);

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-xl p-1 shadow-sm flex gap-2"
                >
                  {/* IMAGE */}
                  <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <img
                      src={item?.productId?.image?.[0]}
                      alt={item?.productId?.name}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="flex-1 flex flex-col gap-2">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                      {item?.productId?.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {item?.productId?.unit}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      {/* PRICE */}
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">
                          {DisplayPriceInRupees(item.quantity * finalPrice)}
                        </p>

                        {discount > 0 && (
                          <p className="text-xs text-gray-400 line-through">
                            {DisplayPriceInRupees(item.quantity * price)}
                          </p>
                        )}
                      </div>

                      {/* QTY CONTROL */}
                      <div className="px-5">
                        <AddTocartButton data={item?.productId} />
                      </div>
                      
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ================= PRICE BREAKDOWN ================= */}
        {cartItem.length > 0 && (
          <div className="bg-white px-4 py-2 text-sm space-y-1 rounded-2xl mx-3">
            <h3 className="font-semibold text-black">Bill Details</h3>
            <div className="flex justify-between text-gray-600 ">
              <span>Items total</span>
              <span>{DisplayPriceInRupees(originalTotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600 ">
              <span>Delivery charge</span>
              <span className="flex gap-1 " > <p className="line-through">₹25 </p> <p className="text-blue-600">FREE</p></span> 
            </div>
            <div className="flex justify-between text-gray-600 ">
              <span>Handling charge</span>
              <span>{DisplayPriceInRupees(0)}</span>
            </div>

            {totalSavings > 0 && (
              <div className="flex justify-between text-blue-700">
                <span>You saved</span>
                <span>- {DisplayPriceInRupees(totalSavings)}</span>
              </div>
            )}

            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Grand Total</span>
              <span>{DisplayPriceInRupees(totalPrice)}</span>
            </div>
          </div>
        )}

        {/* ================= FOOTER ================= */}
        {totalQty > 0 && (
          <div className="bg-white p-4 sticky bottom-0">
            <div className="flex items-center justify-between bg-green-700 hover:bg-green-800 text-white px-5 py-4 rounded-xl transition active:scale-[0.98]">
              <div className="leading-tight">
                <p className="text-xs opacity-90">Total Amount</p>
                <p className="text-lg font-semibold">
                  {DisplayPriceInRupees(totalPrice)}
                </p>
              </div>
             
              <button onClick={redirectToCheckoutPage}  className="bg-white text-green-700 px-5 py-2 rounded-lg cursor-pointer text-sm font-semibold hover:bg-green-50 transition flex items-center gap-1">
                Proceed <FaCaretRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayCartItem;
