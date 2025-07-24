import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-heading text-primary">Всё о питомце</Link>
        <nav className="space-x-4">
          <Link to="/pets" className="text-gray-600 hover:text-primary">Питомцы</Link>
          <Link to="/blog" className="text-gray-600 hover:text-primary">Блог</Link>
          <Link to="/calendar" className="text-gray-600 hover:text-primary">Календарь</Link>
          <Link to="/profile" className="text-gray-600 hover:text-primary">Профиль</Link>
          <Link to="/login" className="text-gray-600 hover:text-primary">Вход</Link>
        </nav>
      </div>
    </header>
  )
}
