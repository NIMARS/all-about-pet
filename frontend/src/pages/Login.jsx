import React, { useState, useContext } from "react";
import { loginUser } from "../api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await loginUser({ email, password });

      const token =
        res?.token ?? res?.data?.accessToken ?? res?.data?.token ?? null;
      const user = res?.user ?? res?.data?.user ?? res?.data ?? null;

      login(user, token);
      navigate("/profile", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка авторизации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white/90 dark:bg-gray-900/80 rounded-xl shadow-lg backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-4 text-center">Вход</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-lg bg-white/80 dark:bg-black/60 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          className="w-full px-4 py-2 border rounded-lg bg-white/80 dark:bg-black/60 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Вход..." : "Войти"}

        </button>
        <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
          Нет аккаунта?{" "}
          <NavLink
            to="/auth/register"
            className="text-indigo-600 hover:underline"
          >
            Зарегистрироваться
          </NavLink>
        </p>
      </form>
    </div>
  );
}
