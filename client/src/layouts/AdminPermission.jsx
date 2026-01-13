
import { useSelector } from "react-redux";
import isAdmin from "../utils/isAdmin.js";

const AdminPermission = ({ children }) => {
  const user = useSelector((state) => state.user);

  return isAdmin(user.role) ? (
    <>{children}</>
  ) : (
    <p className="text-red-600 font-bold text-lg bg-red-100 border border-red-400 p-3 rounded-md text-center">
      You do not have permission
    </p>
  );
};

export default AdminPermission;
