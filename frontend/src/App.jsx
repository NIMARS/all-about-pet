import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'

import Home           from './pages/Home'
import Login          from './pages/Login'
import Register       from './pages/Register'
import Pets           from './pages/Pets'
import Blog           from './pages/Blog'
import Calendar       from './pages/Calendar'
import Profile        from './pages/Profile'
import NotFound       from './pages/NotFound'
import ProtectedRoute from '@/routes/ProtectedRoute';
import AdminRoute     from '@/routes/AdminRoute';
import Dashboard      from '@/pages/Dashboard';
import AdminPanel     from '@/pages/AdminPanel';
import AppRoutes      from '@/routes';
import Navbar         from './components/Navbar'

function App() {
  return <AppRoutes />;
}

export default App;
