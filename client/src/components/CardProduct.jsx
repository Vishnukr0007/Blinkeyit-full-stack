import { Link } from "react-router-dom";
import { Timer } from "lucide-react";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { valideURLConvert } from "../utils/validURLConverte.js";
import { priceWithDiscount } from "../utils/priceWithDiscount.js";
import AddTocartButton from "./AddTocartButton.jsx";

const CardProduct = ({ data }) => {
  if (!data) return null;

  const url = `/product/${valideURLConvert(data.name)}-${valideURLConvert(
    data._id
  )}`;


  return (
    <Link
      to={url}
      className="
    relative
    w-full
    min-h-[300px] md:min-h-[340px]
    p-4
    flex flex-col gap-3
    rounded-2xl
    bg-white
    border border-gray-100
    shadow-sm
    hover:shadow-lg
    hover:border-green-100
    transition-all
    duration-300
    cursor-pointer
  "
    >
      {/* 🔥 DISCOUNT BADGE (TOP) */}
      {data.discount > 0 && (
        <span
          className="
      absolute top-2 left-2
      bg-green-600 text-white
      text-[10px] md:text-xs
      font-semibold
      px-2 py-0.5
      rounded-full
      z-10
    "
        >
          {data.discount}% OFF
        </span>
      )}

      {/* IMAGE */}
      <div className="h-32 md:h-40 flex items-center justify-center bg-gray-50/30 rounded-lg overflow-hidden">
        <img
          src={data.image?.[0] || "/placeholder.png"}
          alt={data.name}
          className="max-h-full w-full object-contain p-2 transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* DELIVERY TIMER */}
      <div className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] md:text-xs text-neutral-600 bg-gray-100 w-fit">
        <Timer size={12} />
        <span>10 mins</span>
      </div>

      {/* PRODUCT NAME */}
      <p className="text-xs md:text-sm font-medium line-clamp-2 text-gray-900">
        {data.name}
      </p>

      {/* UNIT */}
      <span className="text-[10px] md:text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded w-fit">
        {data.unit}
      </span>

      {/* PRICE + ADD */}
      <div className="mt-auto flex items-center justify-between gap-3">
        {/* PRICE BLOCK */}
        <div className="flex flex-col">
          <span className="text-sm md:text-md font-bold text-gray-900 leading-none">
            {DisplayPriceInRupees(priceWithDiscount(data.price, data.discount))}
          </span>

          {data.discount > 0 && (
            <span className="text-[10px] md:text-xs text-gray-400 line-through">
              {DisplayPriceInRupees(data.price)}
            </span>
          )}
        </div>

        {data.stock === 0 ? (
          <div
            className="
    inline-flex items-center
    gap-1.5
    px-2.5 py-1
    rounded-md
    bg-red-100
    text-red-600
    text-[10px] md:text-xs
    font-medium
  "
          >
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            Out of Stock
          </div>
        ) : (
          <>
       <AddTocartButton data={data} />
          </>
        )}
      </div>
    </Link>
  );
};

export default CardProduct;
