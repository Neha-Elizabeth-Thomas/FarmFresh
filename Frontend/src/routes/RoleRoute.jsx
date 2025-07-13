// src/routes/RoleRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const RoleRoute = ({ allowedRoles }) => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(userInfo.user.role)) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default RoleRoute;
