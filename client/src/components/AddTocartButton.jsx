import AxiosToastError from "../utils/AxiosToastError.js";
import { useEffect, useState } from "react";
import Axios from "../utils/Axios.js";
import SummaryApi from "../common/SummaryApi.js";
import toast from "react-hot-toast";
import { useGlobalContext } from "../provider/GlobalProvider.jsx";
import ButtonLoader from "./ButtonLoader.jsx";
import { useSelector } from "react-redux";
 import { FiMinus, FiPlus } from "react-icons/fi";

const AddTocartButton = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const cartItem = useSelector((state) => state.cartItem.cart);
  const [isAvailableCart, setIsAvailable] = useState(false);
  const [qty,setQty]=useState(0)
  const [cartItemDetail,setCartItemDetail]=useState(null)
  const { fetchCartItems, updateCartItemQty } = useGlobalContext();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.addToCart,
        data: {
          productId: data?._id,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        if (fetchCartItems) {
          fetchCartItems();
        }
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };
 useEffect(() => {
  if (!data?._id) return;

  const product = cartItem.find(
    (item) => item?.productId?._id === data?._id
  );

  if (product) {
    setIsAvailable(true);
    setCartItemDetail(product);
    setQty(Number(product.quantity) || 1);
  } else {
    setIsAvailable(false);
    setCartItemDetail(null);
    setQty(1);
  }
}, [cartItem, data?._id]);


  const increaseQty = (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (!cartItemDetail?._id) return;

  const newQty = qty + 1;

  setQty(newQty); // optimistic UI
  updateCartItemQty(cartItemDetail._id, newQty);
};

const decreaseQty = (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (!cartItemDetail?._id) return;

  if (qty <= 1) {
    // OPTIONAL: remove item from cart
    updateCartItemQty(cartItemDetail?._id, 0);
    return;
  }

  const newQty = qty - 1;

  setQty(newQty); // optimistic UI
  updateCartItemQty(cartItemDetail?._id, newQty);
};


  return (
    <div className="w-full max-w-[150px]">
      {isAvailableCart ? (
        <div  className=" flex bg-green-700 hover:bg-green-600 rounded-full  justify-between p-1 px-2 gap-1">
          <button onClick={decreaseQty}className=" text-white cursor-pointer"><FiMinus size={15}/></button>
          <p className="text-white text-sm ">{qty}</p>
          <button onClick={increaseQty}className="text-white cursor-pointer"><FiPlus size={15}/></button>
        </div>
      ) : (
        <div>
          {/* ADD BUTTON */}
          <button
            className="
        px-4 py-1.5
        text-[11px] md:text-xs
        font-semibold
        text-green-600
        border border-green-600
        rounded-full
        hover:bg-green-50
        active:scale-95
        transition
        cursor-pointer
      "
            onClick={handleAddToCart}
          >
            {loading ? <ButtonLoader /> : " ADD" } 
          </button>
        </div>
      )}
    </div>
  );
};
export default AddTocartButton;
