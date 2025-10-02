import React, { useState } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

function MobileMenuButton({ open, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-expanded={open}
      aria-label={open ? "Закрыть меню" : "Открыть меню"}
      className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
    >
      {open ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M6 6L18 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M6 18L18 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 7h16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M4 12h16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M4 17h16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}

export default function MainLayout() {
  const { user, logout } = useAuth() || {};
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: "/pets", label: "Питомцы" },
    { to: "/calendar", label: "Календарь" },
    { to: "/blog", label: "Блог" },
  ];

  return (
    <div
      id="app-root"
      className="min-h-screen flex flex-col bg-[--page-bg] dark:bg-gradient-to-br 
      dark:from-slate-900 dark:via-slate-800 dark:to-black 
      text-gray-800 dark:text-gray-100 font-sans"
    >
      {/* Header */}
      <header className="shadow-sm bg-white/70 dark:bg-gray-900/70 backdrop-blur-md">
        <div className="container-centered flex items-center justify-between gap-4 py-3">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-lg font-bold inline-flex items-center gap-2 text-gray-800 dark:text-white hover:text-indigo-600 transition-colors duration-200"
            >
              <span className="text-indigo-600">AllAboutPet</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-4"
            aria-label="Главная навигация"
          >
            {navItems.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                className={({ isActive }) =>
                  `
              relative text-sm px-3 py-2 rounded-lg font-medium
              transition-colors duration-200
              ${
                isActive
                  ? "text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900"
                  : "text-gray-700 dark:text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900"
              }
            `
                }
              >
                {it.label}
              </NavLink>
            ))}

            {user ? (
              <>
                <NavLink
                  to="/profile"
                  className="text-sm px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-colors duration-200"
                >
                  Профиль
                </NavLink>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="text-sm px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-200"
                >
                  Выйти
                </button>
              </>
            ) : (
              <NavLink
                to="/auth/login"
                className="text-sm px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 transition-colors duration-200"
              >
                Войти
              </NavLink>
            )}
          </nav>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-2">
            <MobileMenuButton
              open={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            />
          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
            <div className="px-4 py-3 space-y-2">
              {navItems.map((it) => (
                <NavLink
                  key={it.to}
                  to={it.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block text-base px-2 py-2 rounded ${
                      isActive
                        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`
                  }
                >
                  {it.label}
                </NavLink>
              ))}

              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                {user ? (
                  <>
                    <NavLink
                      to="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="block px-2 py-2 text-base text-gray-700 dark:text-gray-300"
                    >
                      Профиль
                    </NavLink>
                    <button
                      onClick={() => {
                        logout && logout();
                        setMobileOpen(false);
                      }}
                      className="w-full text-left px-2 py-2 btn-ghost"
                    >
                      Выйти
                    </button>
                  </>
                ) : (
                  <NavLink
                    to="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="block px-2 py-2 btn-outline  text-center text-white"
                  >
                    Войти
                  </NavLink>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow container-centered max-w-6xl mx-auto px-6 py-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md py-6 mt-auto text-center text-sm text-gray-600 dark:text-gray-400">
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Поддержка:{" "}
          <a className="underline" href="mailto:support@allaboutpet.local">
            support@allaboutpet.local
          </a>
        </div>
        © {new Date().getFullYear()} AllAboutPet — сделано с ❤️by NIMARS
      </footer>
    </div>
  );
}
