import { useEffect, useState } from "react";
import CardLoading from "../components/CardLoading";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import CardProduct from "../components/CardProduct";
import InfiniteScroll from "react-infinite-scroll-component";
import noDataImage from "../assets/nothing here yet.webp";
import { useLocation } from "react-router-dom";

const Searchpage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchText = searchParams.get("q") || "";

  const fetchData = async (pageNumber = 1, isNewSearch = false) => {
    try {
      setLoading(true);

      const response = await Axios({
        ...SummaryApi.searchproduct,
        data: {
          search: searchText,
          page: pageNumber,
          limit: 10,
        },
      });

      const responseData = response?.data;

      if (responseData?.success) {
        const products = Array.isArray(responseData.data)
          ? responseData.data
          : [];

        setData((prev) =>
          isNewSearch ? products : [...prev, ...products]
        );

        setPage(responseData.page);
        setTotalPage(responseData.totalPage);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Fetch on search change (with reset)
  useEffect(() => {
    setData([]);
    setPage(1);
    fetchData(1, true);
  }, [searchText]);

  // 🔄 Infinite scroll handler
  const fetchNextPage = () => {
    if (!loading && page < totalPage) {
      fetchData(page + 1);
    }
  };

  return (
    <section className="bg-white min-h-[90vh]">
      <div className="container mx-auto p-4">
        <p className="font-semibold mb-4">
          Search Results: {data.length}
        </p>

        {/* NO DATA STATE */}
        {!loading && data.length ===0 && (
          <div className="flex flex-col items-center justify-center mt-16 text-center">
            <img
              src={noDataImage}
              alt="No products found"
              className="w-48 h-48 object-contain opacity-90"
            />
            <h2 className="mt-4 text-lg font-semibold text-gray-700">
              No products found
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Try searching with a different keyword
            </p>
          </div>
        )}

        {data.length > 0 && (
          <InfiniteScroll
            dataLength={data.length}
            next={fetchNextPage}
            hasMore={page < totalPage}
            loader={
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4 mt-4">
                {Array.from({ length: 10 }).map((_, index) => (
                  <CardLoading key={index} />
                ))}
              </div>
            }
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
              {data.map((p, index) => (
                <CardProduct
                  key={p._id + "-search-" + index}
                  data={p}
                />
              ))}
            </div>
          </InfiniteScroll>
        )}
      </div>
    </section>
  );
};

export default Searchpage;
