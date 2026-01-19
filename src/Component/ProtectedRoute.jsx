
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
import { useNavigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    // const token = localStorage.getItem('auth_token');
    const token= Cookies.get('token');
    // console.log(token,"from localStorage")
    // console.log(token,"from Cookie")
    if (!token) {
      setIsAuthenticated(false);
      navigate('/admin/login');
    }
  }, [navigate]);
  
  if (!isAuthenticated) {
    return null; 
  }

  return <Outlet />; // Render child routes if authenticated
};

export default ProtectedRoute;

