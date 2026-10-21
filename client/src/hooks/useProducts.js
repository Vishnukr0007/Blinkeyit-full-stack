import { useState, useEffect, useCallback } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";

/**
 * useProducts: Reusable Hook for Fetching & Paginating Products
 *
 * @param {Object} options
 * @param {string} options.categoryId - Optional category ID
 * @param {string} options.subcategoryId - Optional subcategory ID
 * @param {number} options.limit - Products per page (default: 12)
 */
export const useProducts = ({ categoryId, subcategoryId, limit = 12 } = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchProducts = useCallback(
    async (pageNumber = 1, append = false) => {
      try {
        setLoading(true);

        let endpoint;
        let payload;

        if (categoryId && subcategoryId) {
          endpoint = SummaryApi.getProductByCategoryAndSubcategory;
          payload = { categoryId, subcategoryId, page: pageNumber, limit };
        } else if (categoryId) {
          endpoint = SummaryApi.getProductByCategory;
          payload = { id: categoryId, page: pageNumber, limit };
        } else {
          endpoint = SummaryApi.getProduct;
          payload = { page: pageNumber, limit };
        }

        const response = await Axios({
          ...endpoint,
          data: payload,
        });

        const resData = response?.data;
        if (resData?.success) {
          const items = Array.isArray(resData.data) ? resData.data : [];
          setProducts((prev) => (append ? [...prev, ...items] : items));
          setPage(resData.page || pageNumber);
          setTotalPage(resData.totalPage || resData.totalNopage || 1);
          setTotalCount(resData.totalCount || items.length);
        }
      } catch (error) {
        AxiosToastError(error);
      } finally {
        setLoading(false);
      }
    },
    [categoryId, subcategoryId, limit]
  );

  // Re-fetch when category or subcategory changes
  useEffect(() => {
    setProducts([]);
    setPage(1);
    fetchProducts(1, false);
  }, [categoryId, subcategoryId, fetchProducts]);

  const loadMore = useCallback(() => {
    if (!loading && page < totalPage) {
      fetchProducts(page + 1, true);
    }
  }, [loading, page, totalPage, fetchProducts]);

  return {
    products,
    loading,
    page,
    totalPage,
    totalCount,
    hasMore: page < totalPage,
    loadMore,
    refetch: () => fetchProducts(1, false),
  };
};

export default useProducts;
