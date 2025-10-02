import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function AdminRoute({ children }) {
  const { user } = useAuth();
  const loc = useLocation();

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: loc }} replace />;
  }
  if (user?.role !== 'admin' && user?.role !== 'superadmin') {
    return <Navigate to="/403" replace />;
  }
  return children;
}
