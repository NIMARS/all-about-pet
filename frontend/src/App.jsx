import { useState } from 'react'
import './App.css'

import Home from './pages/Home'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Pets from './pages/Pets'
import Blog from './pages/Blog'
import Calendar from './pages/Calendar'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pets" element={<Pets />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainLayout>
    </Router>
  )
}
