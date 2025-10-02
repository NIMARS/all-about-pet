import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const loc = useLocation();

  if (!user) {
    // redirect to login with returnUrl
    return <Navigate to="/auth/login" state={{ from: loc }} replace />;
  }
  return children;
}
