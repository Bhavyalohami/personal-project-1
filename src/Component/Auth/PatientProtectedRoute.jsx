import Cookies from "js-cookie";
import { Navigate, useLocation } from "react-router-dom";
import PatientShell from "../User/PatientShell";

const PatientProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = Cookies.get("patient_token");
  const username = Cookies.get("patient_username");

  if (!token || !username) {
    return (
      <Navigate
        to="/user/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <PatientShell>{children}</PatientShell>;
};

export default PatientProtectedRoute;
