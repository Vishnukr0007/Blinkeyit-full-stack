import { useEffect, useState } from "react";
import ButtonLoader from "./ButtonLoader.jsx";
import { FiMinus, FiPlus } from "react-icons/fi";
import { useGlobalContext } from "../provider/GlobalProvider.jsx";

const AddTocartButton = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [isAvailableCart, setIsAvailable] = useState(false);
  const [qty, setQty] = useState(0);
  const [cartItemDetail, setCartItemDetail] = useState(null);

  const { cartItem = [], updateCartItemQty, addItemToCart } = useGlobalContext();

  // Find if this product is in the current active cart
  useEffect(() => {
    if (!data?._id) return;

    const itemInCart = cartItem.find(
      (item) => (item?.productId?._id || item?.productId) === data._id
    );

    if (itemInCart) {
      setIsAvailable(true);
      setCartItemDetail(itemInCart);
      setQty(Number(itemInCart.quantity) || 1);
    } else {
      setIsAvailable(false);
      setCartItemDetail(null);
      setQty(0);
    }
  }, [cartItem, data?._id]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setLoading(true);
      await addItemToCart(data);
    } finally {
      setLoading(false);
    }
  };

  const increaseQty = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const targetId = cartItemDetail?._id || `guest_${data?._id}`;
    const newQty = qty + 1;
    setQty(newQty); // optimistic UI
    updateCartItemQty(targetId, newQty);
  };

  const decreaseQty = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const targetId = cartItemDetail?._id || `guest_${data?._id}`;
    if (qty <= 1) {
      setQty(0);
      setIsAvailable(false);
      updateCartItemQty(targetId, 0);
      return;
    }

    const newQty = qty - 1;
    setQty(newQty); // optimistic UI
    updateCartItemQty(targetId, newQty);
  };

  return (
    <div className="w-fit">
      {isAvailableCart && qty > 0 ? (
        <div className="flex bg-green-700 hover:bg-green-600 rounded-full items-center justify-between p-1 px-2.5 gap-3 shadow-xs transition-all active:scale-95">
          <button
            onClick={decreaseQty}
            title="Decrease quantity"
            className="text-white hover:text-green-100 transition cursor-pointer p-0.5"
          >
            <FiMinus size={13} />
          </button>
          <span className="text-white text-xs font-bold min-w-[14px] text-center select-none">
            {qty}
          </span>
          <button
            onClick={increaseQty}
            title="Increase quantity"
            className="text-white hover:text-green-100 transition cursor-pointer p-0.5"
          >
            <FiPlus size={13} />
          </button>
        </div>
      ) : (
        <div className="flex justify-end">
          <button
            className="px-5 py-1.5 text-[11px] md:text-xs font-bold text-green-700 bg-green-50 border border-green-600 rounded-full hover:bg-green-700 hover:text-white active:scale-95 transition-all duration-200 cursor-pointer shadow-2xs"
            onClick={handleAddToCart}
            disabled={loading}
          >
            {loading ? <ButtonLoader /> : "ADD"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddTocartButton;
