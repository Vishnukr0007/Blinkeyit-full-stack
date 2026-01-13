import  { useEffect, useMemo, useRef, useState } from 'react';
import { Link} from 'react-router-dom';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import CardLoading from './CardLoading';
import CardProduct from './CardProduct';
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { valideURLConvert } from '../utils/validURLConverte';
import { useSelector } from 'react-redux';

const CategoryWiseProductDisplay = ({ id, name }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef();
  const subCategoryData= useSelector(state =>state.product.allsubCategory)

   const loadingCardNumber = new Array(6).fill(null);

  // ✅ Fetch products
  const fetchCategoryWiseProduct = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategory,
        data: { id }
      });
      const { data: responseData } = response;
      if (responseData.success) {
        setData(responseData.data || []);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryWiseProduct();
  }, [id]);

  const handleScrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 200;
    }
  };

  const handleScrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 200;
    }
  };

 

  

  const redirectUrl = useMemo(() => {
  if (!subCategoryData || subCategoryData.length === 0) return null;

  const subcategory = subCategoryData.find(sub =>
    Array.isArray(sub.category) &&
    sub.category.some(c => c?._id === id)
  );

  if (!subcategory) return null;

  return `/${valideURLConvert(name)}-${id}/${valideURLConvert(
    subcategory.name
  )}-${subcategory._id}`;
}, [subCategoryData, id, name]);


  return (
    <section className="relative">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h3 className="font-semibold text-lg md:text-xl lg:text-2xl">{name}</h3>
          {redirectUrl && (
  <Link
    to={redirectUrl}
    className="text-green-700 hover:text-green-500 text-sm md:text-base"
  >
    See All
  </Link>
)}

        </div>

        <div className="relative">
          <div
            ref={containerRef}
            className="flex items-stretch gap-4 overflow-x-auto px-2 py-4 scroll-smooth scrollbar-auto"
          >
            {loading
              ? loadingCardNumber.map((_, index) => (
                  <CardLoading key={`loading-${index}`} />
                ))
              : data.map((product, index) => (
                  <CardProduct key={product._id + "-product-" + index} data={product} />
                ))}
          </div>

          {/* Navigation Buttons for Desktop */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 px-4 hidden lg:flex justify-between pointer-events-none">
            <button
              onClick={handleScrollLeft}
              className="bg-white shadow-md p-2 rounded-full pointer-events-auto hover:bg-gray-100 transition"
            >
              <MdChevronLeft />
            </button>
            <button
              onClick={handleScrollRight}
              className="bg-white shadow-md p-2 rounded-full pointer-events-auto hover:bg-gray-100 transition"
            >
              <MdChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryWiseProductDisplay;
