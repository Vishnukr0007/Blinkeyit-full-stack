import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import SummaryApi from "../common/SummaryApi";
import { LiaAngleRightSolid, LiaAngleLeftSolid } from "react-icons/lia";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import image1 from "../assets/minute_delivery.png";
import image2 from "../assets/Best_Prices_Offers.png";
import image3 from "../assets/Wide_Assortment.png";
import { priceWithDiscount } from "../utils/priceWithDiscount";
import AddTocartButton from "../components/AddTocartButton";

const ProductDisplaypage = () => {
  const params = useParams();
  const productId = params?.product?.split("-")?.pop();
  const [loading, setLoading] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);

  const [image, setImage] = useState(0);
  const thumbnailRef = useRef(null);
  const [data, setData] = useState({
    name: "",
    image: [],
  });

  const fetchProductDetails = async () => {
    if (!productId) return;

    try {
      setLoading(true);

      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          productId: productId,
        },
      });

      const { data: responseData } = response;

      if (responseData?.success) {
        setData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const scrollLeft = () => {
    if (!thumbnailRef.current) return;
    thumbnailRef.current.scrollBy({
      left: -120, // scroll amount
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    if (!thumbnailRef.current) return;
    thumbnailRef.current.scrollBy({
      left: 120,
      behavior: "smooth",
    });
  };
   console.log(data)
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_auto_1fr] gap-8 md:gap-12 p-4 md:p-8">
          {/* LEFT: IMAGE SECTION */}
          <div className="flex flex-col">
            {/* Main Image */}
            <div className="w-full h-[350px]  flex items-center justify-center overflow-hidden group">
              <img
                src={data.image[image]}
                alt={data.name}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 cursor-zoom-in"
              />
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-3">
              {data.image.map((_, index) => (
                <span
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    image === index ? "bg-gray-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <div className="relative w-[320px] lg:w-[500px] mt-4 mx-auto">
              {/* LEFT ARROW */}
              <button
                onClick={() => {
                  setImage((prev) => Math.max(prev - 1, 0));
                  scrollLeft();
                }}
                className="hidden lg:flex absolute -left-10 top-1/2 -translate-y-1/2 z-10
               bg-white shadow rounded-full p-2 hover:bg-gray-100"
              >
                <LiaAngleLeftSolid size={18} />
              </button>

              {/* THUMBNAILS */}
              <div
                ref={thumbnailRef}
                className="overflow-x-auto lg:overflow-x-hidden scrollbar-hide scroll-smooth"
              >
                <div className="flex gap-3">
                  {data.image.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={data.name}
                      onClick={() => setImage(index)}
                      className={`w-16 h-16 lg:w-20 lg:h-20 object-contain border rounded cursor-pointer flex-shrink-0
            ${image === index ? "border-green-500" : "border-gray-300"}
          `}
                    />
                  ))}
                </div>
              </div>

              {/* RIGHT ARROW */}
              <button
                onClick={() => {
                  setImage((prev) => Math.min(prev + 1, data.image.length - 1));
                  scrollRight();
                }}
                className="hidden lg:flex absolute -right-10 top-1/2 -translate-y-1/2 z-10
               bg-white shadow rounded-full p-2 hover:bg-gray-100"
              >
                <LiaAngleRightSolid size={18} />
              </button>
            </div>
         <div className="my-6 border-t border-gray-200 pt-4">

  {/* HEADER */}
  <button
    onClick={() => setOpenDetails(!openDetails)}
    className="w-full flex items-center  py-3"
  >
    <h3 className="text-base sm:text-sm font-semibold text-green-500">
      View more details
    </h3>

    <span
      className={`transform transition-transform duration-300 px-2 ${
        openDetails ? "rotate-180" : ""
      }`}
    >
      ▼
    </span>
  </button>
  
  {/* CONTENT */}
  <div
    className={`grid gap-4 overflow-hidden transition-all duration-300 ${
      openDetails ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
    }`}
  >

    <p className=" text-gray-600 font-semibold">Product Details</p>

    {/* DESCRIPTION */}
    <div>
      <p className="text-sm font-medium text-gray-700">Description</p>
      <p className="text-sm text-gray-600 mt-1 leading-relaxed">
        {data.description}
      </p>
    </div>

    {/* UNIT */}
    <div>
      <p className="text-sm font-medium text-gray-700">Unit</p>
      <p className="text-sm text-gray-600 mt-1">
        {data.unit}
      </p>
    </div>

    {/* MORE DETAILS */}
    {data?.more_details &&
      Object.keys(data.more_details).map((key, index) => (
        <div key={index}>
          <p className="text-sm font-medium text-gray-700 capitalize">
            {key.replace(/_/g, " ")}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {data.more_details[key]}
          </p>
        </div>
      ))}
  </div>
</div>

          </div>
         
          {/* VERTICAL DIVIDER (Desktop only) */}
          <div className="hidden lg:block w-px bg-gray-200"></div>

          {/* RIGHT: PRODUCT DETAILS */}
          <div className="flex flex-col gap-6 h-full mt-4 lg:mt-0">
            {/* Top Content */}
            <div className="flex flex-col gap-4">
              <h1 className="text-xl lg:text-2xl font-semibold text-gray-900">
                {data.name}
              </h1>


              <p className="text-sm text-gray-500 font-medium">
                Net Qty: {data.unit}
              </p>

              {/* Price + Add to Cart */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* PRICE SECTION */}
                <div className="flex flex-wrap items-end gap-2 sm:gap-3 ">
                  {/* Discounted Price */}
                  <div className="bg-green-50 px-2 rounded">
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {DisplayPriceInRupees(
                      priceWithDiscount(data.price, data.discount)
                    )}
                  </p>
                  </div>

                  {/* Original MRP */}
                  {data.discount > 0 && (
                    <p className="text-xs sm:text-sm text-gray-400">
                      MRP
                      <span className="line-through ml-1">
                        {DisplayPriceInRupees(data.price)}
                      </span>
                    </p>
                  )}

                  {/* Discount Badge */}
                  {data.discount > 0 && (
                    <span className="text-[10px] sm:text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                      {data.discount}% OFF
                    </span>
                  )}
                </div>

                {/* ACTION SECTION */}
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
    //               <button
    //                 className="
    //   w-full sm:w-auto
    //   bg-green-600 text-white
    //   px-6 py-3
    //   rounded-lg
    //   text-sm font-semibold
    //   hover:bg-green-700
    //   transition
    // "
    //               >
    //                 Add to Cart
    //               </button>
       <AddTocartButton data={data} />
                )}
              </div>
            </div>

            {/* WHY BLINKIT (BOTTOM) */}
            <div className="mt-10">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Why shop from Blinkeyit?
              </h3>

              <div className="grid gap-6">
                {/* Item */}
                <div className="flex gap-5">
                  <span className="text-green-600 text-lg">
                    <img src={image1} alt="superfast-delivery" width={50} />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Superfast Delivery
                    </p>
                    <p className="text-sm text-gray-500">
                      Get your order delivered to your doorstep at the earliest
                      from dark stores near you.
                    </p>
                  </div>
                </div>

                {/* Item */}
                <div className="flex gap-3">
                  <span className="text-green-600 text-lg">
                    <img src={image2} alt="best-offer-prices" width={50} />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Best Prices & Offers
                    </p>
                    <p className="text-sm text-gray-500">
                      Best price destination with offers directly from the
                      manufacturers.
                    </p>
                  </div>
                </div>

                {/* Item */}
                <div className="flex gap-3">
                  <span className="text-green-600 text-lg">
                    <img src={image3} alt="wide Assortment" width={50} />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Wide Assortment
                    </p>
                    <p className="text-sm text-gray-500">
                      Choose from 5000+ products across food, personal care,
                      household & other categories.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block w-full h-px bg-gray-200 my-4"></div>
    </section>
  );
};

export default ProductDisplaypage;
