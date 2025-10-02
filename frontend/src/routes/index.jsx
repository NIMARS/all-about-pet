import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
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
import AddPet from '@/pages/AddPet';


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* public */}
        <Route index element={<Home />} />
        <Route path="auth/login" element={<Login />} />
        <Route path="auth/register" element={<Register />} />
        <Route path="blog" element={<Blog />} />

        {/* protected */}
        <Route
          path="pets"
          element={
            <ProtectedRoute>
              <Pets />
            </ProtectedRoute>
          }
        />
        <Route
  path="pets/add"
  element={
    <ProtectedRoute>
      <AddPet />
    </ProtectedRoute>
  }
/>
        <Route
          path="calendar"
          element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* admins */}
        <Route
          path="dashboard"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
      </Route>

      {/* 404 out MainLayout */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
