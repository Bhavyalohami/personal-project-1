import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("username");
    Cookies.remove("is_superuser");
    Cookies.remove("is_staff");
    Cookies.remove("is_vendor");
    Cookies.remove("status");
    Cookies.remove("roles");
    Cookies.remove("subroles");
    navigate("/admin/login");
  };

  return logout;
};
