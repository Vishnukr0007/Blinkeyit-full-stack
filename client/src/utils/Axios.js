import axios from "axios";
import SummaryApi, { baseURL } from "../common/SummaryApi";

const Axios = axios.create({
  baseURL: baseURL,
  withCredentials: true, // Enable credentials for cookies/auth
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach access token from localStorage if present
Axios.interceptors.request.use(
  async (config) => {
    const accesstoken =
      localStorage.getItem("accesstoken") ||
      localStorage.getItem("accessToken");

    if (accesstoken) {
      config.headers.Authorization = `Bearer ${accesstoken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: automatically refresh expired token once
Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Do not attempt refresh on auth endpoints to prevent infinite retry loops
    const isAuthEndpoint =
      originalRequest?.url?.includes("/refresh-token") ||
      originalRequest?.url?.includes("/login") ||
      originalRequest?.url?.includes("/register");

    if (error.response?.status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      const refreshToken =
        localStorage.getItem("refreshtoken") ||
        localStorage.getItem("refreshToken");

      if (refreshToken) {
        const newAccessToken = await refreshAccessToken(refreshToken);
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return Axios(originalRequest);
        }
      }
    }

    return Promise.reject(error);
  }
);

const refreshAccessToken = async (refreshtoken) => {
  try {
    const response = await axios({
      method: SummaryApi.refreshToken.method || "post",
      url: `${baseURL || ""}${SummaryApi.refreshToken.url}`,
      headers: {
        Authorization: `Bearer ${refreshtoken}`,
      },
      withCredentials: true,
    });

    const accessToken =
      response.data?.data?.accesstoken || response.data?.data?.accessToken;

    if (accessToken) {
      localStorage.setItem("accesstoken", accessToken);
      return accessToken;
    }

    return null;
  } catch (error) {
    // If refresh fails, clear stale tokens so the user is prompted to log in cleanly
    localStorage.removeItem("accesstoken");
    localStorage.removeItem("refreshtoken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return null;
  }
};

export default Axios;