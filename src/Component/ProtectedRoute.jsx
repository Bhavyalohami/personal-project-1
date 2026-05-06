
// import React, { useContext } from 'react';
// import { Route, Navigate } from 'react-router-dom';
// import { AuthContext } from '../context/Authcontext';

// const ProtectedRoute = ({ element: Component, ...rest }) => {
//     const { isAuthenticated } = useContext(AuthContext);

//     return (
//         <Route
//             {...rest}
//             element={isAuthenticated ? Component : <Navigate to="/admin/login" />}
//         />
//     );
// };

// export default ProtectedRoute;
// src/Components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    const isSuperuser = Cookies.get('is_superuser') === 'true';
    const isVendor = Cookies.get('is_vendor') === 'true';
    const isStaff = Cookies.get('is_staff') === 'true';
    const portal = pathname.startsWith('/admin')
      ? 'admin'
      : pathname.startsWith('/vendor')
      ? 'vendor'
      : pathname.startsWith('/doctor')
      ? 'doctor'
      : '';
    const loginPath = portal ? `/${portal}/login` : '/admin/login';
    const currentHome = isSuperuser
      ? '/admin'
      : isVendor
      ? '/vendor'
      : isStaff
      ? '/doctor'
      : '/userprofile';
    const hasPortalAccess =
      !portal ||
      (portal === 'admin' && isSuperuser) ||
      (portal === 'vendor' && isVendor && !isSuperuser) ||
      (portal === 'doctor' && isStaff && !isVendor && !isSuperuser);

    if (!token) {
      setIsAuthenticated(false);
      navigate(loginPath, { replace: true });
      return;
    }

    if (!hasPortalAccess) {
      setIsAuthenticated(false);
      navigate(currentHome, { replace: true });
      return;
    }

    setIsAuthenticated(true);
  }, [navigate, pathname]);
  
  if (!isAuthenticated) {
    return null; 
  }

  return <Outlet />; // Render child routes if authenticated
};

export default ProtectedRoute;

