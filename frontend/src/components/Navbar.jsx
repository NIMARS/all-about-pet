import { useAuth } from "@/hooks/useAuth";
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    isActive ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary';

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow">
      <div className="flex space-x-4 items-center">
        <NavLink to="/" className={linkClass}>
          Главная
        </NavLink>

        <NavLink to="/blog" className={linkClass}>
          Блог
        </NavLink>

        {user && (
          <>
            <NavLink to="/pets" className={linkClass}>
              Питомцы
            </NavLink>
            <NavLink to="/calendar" className={linkClass}>
              Календарь
            </NavLink>
            <NavLink to="/profile" className={linkClass}>
              Профиль
            </NavLink>
          </>
        )}

        {user?.role === 'admin' && (
          <>
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/admin" className={linkClass}>
              Панель
            </NavLink>
          </>
        )}
      </div>

      <div className="flex space-x-4 items-center">
        {user ? (
          <>
            <span className="text-gray-600">👤 {user.nickname}</span>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600"
            >
              Выйти
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={linkClass}>
              Вход
            </NavLink>
            <NavLink to="/register" className={linkClass}>
              Регистрация
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
