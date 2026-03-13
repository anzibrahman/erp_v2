import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import CustomMoonLoader from "@/components/Loaders/CustomMoonLoader";
import { ROUTES } from "@/routes/paths";

export default function ProtectedRoute({ children }) {
  const { authChecked, isLoggedIn } = useSelector((state) => state.auth);

  if (!authChecked) {
    return <CustomMoonLoader />;
  }

  if (!isLoggedIn) {
    return <Navigate to={ROUTES.login} replace />;
  }

  return children;
}
