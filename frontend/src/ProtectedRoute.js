// import React, { useContext } from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import AuthContext from "./AuthProvider"; // Import your AuthContext

// const ProtectedRoute = ({ ...props }) => {
//   const { isLoggedIn } = useContext(AuthContext);
//   return isLoggedIn ? <Outlet {...props} /> : <Navigate to="/" />;
// };

// export default ProtectedRoute;
import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

const ProtectedRoute = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return isLoggedIn ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
