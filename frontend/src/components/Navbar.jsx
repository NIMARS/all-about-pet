export default function Navbar() {
    return (
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-heading text-primary">AllAboutPet</h1>
          <nav className="space-x-4">
            <a href="#" className="text-gray-600 hover:text-primary">Главная</a>
            <a href="#" className="text-gray-600 hover:text-primary">Питомцы</a>
            <a href="#" className="text-gray-600 hover:text-primary">Блог</a>
          </nav>
        </div>
      </header>
    )
  }
  