import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const { userInfo, loading } = useSelector((state) => state.auth);

  if (loading) return <p>Loading...</p>; // or a spinner

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userInfo.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
