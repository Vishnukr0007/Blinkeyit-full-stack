import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AxiosToastError from "../utils/AxiosToastError";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import Loading from "../components/Loading";
import CardProduct from "../components/CardProduct";
import { useSelector } from "react-redux";
import { valideURLConvert } from "../utils/validURLConverte";


const ProductListPage = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const params = useParams();
  const AllSubCategory = useSelector((state) => state.product.allsubCategory);
  const [DisplaySubcategory, setDisplaySubcategory] = useState([]);


  const subCategoryParts = params?.subCategory?.split("-") || [];
  const subcategoryName = subCategoryParts?.slice(0, -1)?.join(" ");

  const categoryId = params?.category?.split("-").pop() || "";
  const subcategoryId = subCategoryParts.at(-1) || "";

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubcategory,
        data: {
          categoryId: categoryId,
          subcategoryId: subcategoryId,
          page: page,
          limit: 8,
        },
      });

      const { data: responseData } = response;
      if (responseData.success) {
        if (responseData.page == 1) {
          setData(responseData.data);
        } else {
          setData([...data, ...responseData.data]);
        }

        setTotalPage(responseData.totalPage || 1);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [params]);

  useEffect(() => {
    const sub = AllSubCategory.filter((s) => {
      const filterData = s.category.some((el) => {
        return el._id === categoryId;
      });

      return filterData ? filterData : null;
    });
    setDisplaySubcategory(sub);

  }, [params, AllSubCategory]);

  return (
    <section className="bg-gray-50">
      <div className="container mx-auto ">

        {/* MAIN BOX */}
        <div className="bg-white shadow-md  overflow-hidden">

          {/* STICKY SUBCATEGORY HEADER */}
          <div className="sticky top-0 z-30 bg-white border-b  border-b-gray-200 px-4 py-3">
            <h3 className="font-semibold capitalize text-lg">
              {subcategoryName || "Subcategory"}
            </h3>
          </div>

          {/* CONTENT AREA */}
          <div
            className="
          flex flex-col
          md:grid
          md:grid-cols-[180px_1fr]
          lg:grid-cols-[220px_1fr]
        "
            style={{ height: "calc(100vh - 140px)" }} // header + subheader
          >

            {/* SUB-CATEGORY NAVIGATION (Responsive) */}
            <div className="border-r border-r-gray-200 bg-gray-50 md:h-full overflow-hidden">
              <div className="
      flex md:flex-col
      overflow-x-auto md:overflow-y-auto
      p-2 md:p-3
      gap-2 md:gap-3
      scrollbar-none md:scrollbar-thin
      scrollbar-thumb-gray-300
      scrollbar-track-transparent
      max-h-[120px] md:max-h-none /* Limit mobile height */
    ">
                {DisplaySubcategory.map((s) => {
                  const categorySlug = params.category;
                  const url = `/${categorySlug}/${valideURLConvert(s.name)}-${s._id}`;

                  return (
                    <Link
                      key={s._id}
                      to={url}
                      className={`
            flex flex-row md:flex-col items-center gap-2
            bg-white rounded-lg p-2
            border transition flex-shrink-0 min-w-[100px] md:min-w-0
            ${subcategoryId === s._id
                          ? "border-green-500 bg-green-50 shadow-sm"
                          : "border-gray-100 hover:border-gray-200"
                        }
          `}
                    >
                      <div className="w-8 h-8 md:w-12 md:h-12 flex-shrink-0">
                        <img
                          src={s.image}
                          alt={s.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <p className="text-[10px] md:text-[11px] font-medium text-center line-clamp-2 md:line-clamp-2">
                        {s.name}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>


            {/* RIGHT PRODUCT AREA (Scrollable) */}
            <main className="flex-1 h-full overflow-y-auto p-3 md:p-4">

              {/* PRODUCT GRID */}
              <div
                className="
              grid
              grid-cols-2
              sm:grid-cols-3
              md:grid-cols-3
              lg:grid-cols-4
              xl:grid-cols-5
              gap-3 md:gap-6
            "
              >
                {data.map((p, index) => (
                  <CardProduct
                    key={p._id + "productSubCategory" + index}
                    data={p}
                  />
                ))}
              </div>

              {/* LOADING */}
              {loading && (
                <div className="flex justify-center py-8">
                  <Loading />
                </div>
              )}
            </main>

          </div>
        </div>
      </div>
    </section>

  );
};

export default ProductListPage;
