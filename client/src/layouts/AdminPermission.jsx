import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import isAdmin from "../utils/isAdmin.js";
import { ShieldAlert } from "lucide-react";
import PageLoader from "../components/PageLoader";

const AdminPermission = ({ children }) => {
  const user = useSelector((state) => state.user);
  const token = typeof window !== "undefined" ? localStorage.getItem("accesstoken") : null;

  // If a token exists but user details haven't resolved yet, show a verifying loader
  if (token && !user?._id && !user?.role) {
    return <PageLoader message="Verifying administrative access..." />;
  }

  // Admin access granted
  if (isAdmin(user?.role)) {
    return <>{children}</>;
  }

  // Permission denied state
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Access Restricted</h2>
        <p className="text-sm text-gray-600 mb-6">
          You do not have administrator permissions to view this section.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold rounded-xl transition cursor-pointer shadow-sm"
        >
          Return to Store
        </Link>
      </div>
    </div>
  );
};

export default AdminPermission;
