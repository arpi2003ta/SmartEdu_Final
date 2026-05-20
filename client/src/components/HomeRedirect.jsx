import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/**
 * If an instructor opens the root route, send them to the admin dashboard.
 * Students and unauthenticated users continue to see the normal home content.
 */
const HomeRedirect = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (isAuthenticated && user?.role === "instructor") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default HomeRedirect;
