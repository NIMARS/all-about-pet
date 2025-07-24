import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-background text-gray-800 font-sans">
      <Navbar />
      <main className="container mx-auto px-4 py-8">{children}</main>
      <Footer />
    </div>
  )
}
