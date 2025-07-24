import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '@/lib/auth';

export default function ProtectedRoute({ children }) {
  const { token } = useAuth()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}