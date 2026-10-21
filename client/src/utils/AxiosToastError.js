import toast from "react-hot-toast";

/**
 * AxiosToastError: Production-grade error parser that transforms technical
 * network and backend exceptions into user-friendly notifications.
 */
const AxiosToastError = (error) => {
  // 1. Offline / Network Connectivity Issue
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    toast.error("You are currently offline. Please check your internet connection.");
    return;
  }

  if (error?.code === "ERR_NETWORK" || error?.message === "Network Error") {
    toast.error("Unable to connect to the server. Please check your network.");
    return;
  }

  // 2. Request Timeout
  if (error?.code === "ECONNABORTED" || error?.message?.includes("timeout")) {
    toast.error("The request timed out. Please try again.");
    return;
  }

  const status = error?.response?.status;
  const rawMessage = error?.response?.data?.message || error?.message;

  // 3. Handle MongoDB Duplicate Key (E11000)
  if (typeof rawMessage === "string" && rawMessage.includes("E11000 duplicate key")) {
    if (rawMessage.includes("email")) {
      toast.error("An account with this email address already exists.");
      return;
    }
    if (rawMessage.includes("name")) {
      toast.error("This name is already in use. Please choose another.");
      return;
    }
    toast.error("This record already exists. Please check your input.");
    return;
  }

  // 4. Handle Status-Specific Friendly Messages
  if (status === 401) {
    const isLoginAttempt = error?.config?.url?.includes("/login");
    if (!isLoginAttempt) {
      toast.error("Session expired. Please log in to continue.");
      return;
    }
  }

  if (status === 403) {
    toast.error("Access denied. You do not have permission for this action.");
    return;
  }

  if (status === 404) {
    toast.error(rawMessage || "The requested item or page was not found.");
    return;
  }

  if (status === 429) {
    toast.error("Too many requests. Please slow down and try again in a moment.");
    return;
  }

  if (status >= 500) {
    toast.error("Our servers are experiencing a temporary issue. Please try again shortly.");
    return;
  }

  // 5. Fallback to clean backend message or default
  const fallbackMessage =
    (typeof rawMessage === "string" && rawMessage.trim()) ||
    "An unexpected error occurred. Please try again.";

  toast.error(fallbackMessage);
};

export default AxiosToastError;