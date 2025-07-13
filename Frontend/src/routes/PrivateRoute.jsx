import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * A component to protect routes that require any authenticated user.
 * If the user is logged in, it renders the child route (via <Outlet />).
 * If not, it redirects them to the /login page.
 */
const PrivateRoute = () => {
  // Get user info from the Redux state
  const { userInfo } = useSelector((state) => state.auth);

  // Check if user is authenticated
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
