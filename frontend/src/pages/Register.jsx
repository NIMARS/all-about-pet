import { useState } from 'react'
import { registerUser } from '../api'
import { useNavigate, NavLink } from 'react-router-dom'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setLoading(true);
    
    try {
      console.log('register payload:', form);
  
      const result = await registerUser(form);
      console.log('register result:', result);
  
      if (!result?.token) {
        await loginUser({ email: form.email, password: form.password });
      }
  
      if (!localStorage.getItem('user')) {
        try {
          const me = await authAPI.getProfile();
          if (me?.data) localStorage.setItem('user', JSON.stringify(me.data));
        } catch {}
      }
  
      navigate('/', { replace: true });
    } catch (err) {
      console.log('REGISTER FAIL FRONT:', err?.response?.status, err?.response?.data);
      const msg = err?.response?.data?.message
               || err?.response?.data?.errors
               || err?.message
               || 'Ошибка регистрации';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
  
    }
  };
  

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white/90 dark:bg-gray-900/80 rounded-xl shadow-lg backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">Регистрация</h2>
      {error && <p className="text-red-500 text-center mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="w-full px-4 py-2 border rounded-lg bg-white/80 dark:bg-black/60 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="w-full px-4 py-2 border rounded-lg bg-white/80 dark:bg-black/60 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="w-full px-4 py-2 border rounded-lg bg-white/80 dark:bg-black/60 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
        <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
          Есть аккаунт?{" "}
          <NavLink
            to="/auth/login"
            className="text-indigo-600 hover:underline"
          >
            Войти
          </NavLink>
        </p>
      </form>
    </div>
  )
}
