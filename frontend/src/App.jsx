import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'

export default function App() {
  return (
    <MainLayout>
      <Home />
    </MainLayout>
  )
}