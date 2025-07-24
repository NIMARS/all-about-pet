import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/routes/ProtectedRoute';
import AdminRoute from '@/routes/AdminRoute';

import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Pets from '@/pages/Pets';
import Blog from '@/pages/Blog';
import Calendar from '@/pages/Calendar';
import Profile from '@/pages/Profile';
import Dashboard from '@/pages/Dashboard';
import AdminPanel from '@/pages/AdminPanel';
import NotFound from '@/pages/NotFound';

const AppRoutes = () => {
    return (
      <MainLayout>
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />
          <Route path="/pets"      element={<ProtectedRoute><Pets /></ProtectedRoute>} />
          <Route path="/calendar"  element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
          <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/admin"     element={<AdminRoute><AdminPanel /></AdminRoute>} />
          <Route path="/blog"      element={<Blog />} />
          <Route path="*"          element={<NotFound />} />
        </Routes>
      </MainLayout>
    );
  };
  
  export default AppRoutes;
