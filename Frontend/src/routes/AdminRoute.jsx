import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * A component to protect routes that are only accessible to admins.
 */
const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // Check if user is authenticated and has the 'admin' role
  return userInfo && userInfo.user.role === 'admin' ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default AdminRoute;
