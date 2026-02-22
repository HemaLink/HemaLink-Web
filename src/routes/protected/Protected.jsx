import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../../services/authContext/AuthContext";

const Protected = () => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default Protected;
