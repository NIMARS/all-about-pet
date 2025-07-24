import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '@/lib/auth';

const AdminRoute = ({ children }) => {
  if (!isAuthenticated() || !isAdmin()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default AdminRoute;
