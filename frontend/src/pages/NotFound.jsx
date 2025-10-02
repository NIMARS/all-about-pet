import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="text-center max-w-lg">
        <h2 className="text-4xl font-extrabold mb-4">Страница не найдена</h2>
        <p className="text-gray-600 mb-6">Похоже, вы попали не туда. Проверьте адрес или вернитесь на главную.</p>
        <div className="flex justify-center gap-3">
          <Link to="/" className="px-4 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700">На главную</Link>
          <Link to="/pets" className="btn btn-primary">Питомцы</Link>
        </div>
      </div>
    </div>
  )
}
