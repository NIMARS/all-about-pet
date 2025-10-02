import React, { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useReducedMotion } from "framer-motion";
import {
  Avatar,
  IconPets,
  IconCalendar,
  IconBlog,
  IconUser,
  IconPlus,
} from "../components/ui/index";

function UserGreeting({ user }) {
  if (!user) {
    return (
      <div className="h-10 w-44 bg-gray-200/60 dark:bg-gray-700/40 animate-pulse rounded-lg" />
    );
  }

  return (
    <div className="flex items-center gap-3">
      {user.avatarUrl ? (
        <Avatar
          src={user.avatarUrl}
          alt={`${user.name} avatar`}
          className="h-10 w-10 rounded-full"
        />
      ) : (
        <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 grid place-items-center text-lg">
          🐾
        </div>
      )}
      <div>
        <div className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
          Привет
          {user?.nickname
            ? `, ${user.nickname}`
            : user?.name
              ? `, ${user.name}`
              : ""}
          !
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Рад видеть вас сегодня
        </div>
      </div>
    </div>
  );
}

const CTA_ITEMS = [
  {
    to: "/pets",
    label: "Питомцы",
    desc: "Список питомцев и документы",
    Icon: IconPets,
    variant: "primary",
  },
  {
    to: "/calendar",
    label: "Календарь",
    desc: "Напоминания и события",
    Icon: IconCalendar,
    variant: "outline",
  },
  {
    to: "/blog",
    label: "Блог",
    desc: "Статьи и советы",
    Icon: IconBlog,
    variant: "secondary",
  },
  {
    to: "/profile",
    label: "Профиль",
    desc: "Настройки и безопасность",
    Icon: IconUser,
    variant: "ghost",
  },
];

export default function Home() {
  const { user } = useAuth();
  const prefersReduced = useReducedMotion();

  const anim = useMemo(
    () => ({
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.45, ease: "easeOut" },
    }),
    []
  );

  const motionProps = prefersReduced ? {} : anim;

  return (
<main >
  <div className="w-full max-w-6xl mx-auto px-6">
    <motion.div {...motionProps} className="w-full">
      <Card className="rounded-2xl shadow-lg border border-white/30 bg-white/80 dark:bg-gray-900/60 p-6 backdrop-blur-sm transition">
        <CardContent className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="min-w-0">
              <UserGreeting user={user} />
              <p className="mt-3 text-gray-700 dark:text-gray-300 text-sm max-w-2xl">
                Добро пожаловать на платформу <strong>«Всё о питомце»</strong> — ваш надёжный помощник в заботе о питомцах.
              </p>
            </div>

            <div className="flex-shrink-0 flex items-center gap-3">
              {user ? (
                <NavLink to="/pets/add" aria-label="Добавить питомца">
                  <button className="btn btn-outline">
                    <IconPlus /> <span className="hidden sm:inline">Добавить питомца</span>
                  </button>
                </NavLink>
              ) : (
                <NavLink to="/auth/login">
                  <button className="btn btn-primary">Войти</button>
                </NavLink>
              )}
            </div>
          </div>

          {/* Grid CTA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CTA_ITEMS.map(({ to, label, desc, Icon, variant }) => (
              <motion.div key={to} whileHover={{ y: -4 }} whileTap={{ scale: 0.995 }}>
                <NavLink to={to} className="block">
                  <div className="flex items-start gap-4 p-4 rounded-lg border border-transparent hover:shadow-md transition-colors bg-white/60 dark:bg-gray-900/60 hover:bg-white/70 dark:hover:bg-gray-800/70">
                    <div className="flex-none text-2xl text-indigo-600 dark:text-indigo-300 pt-1">
                      <Icon />
                    </div>
                    <div className="min-w-0">
                      <div className="text-base font-semibold text-gray-900 dark:text-white">{label}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{desc}</div>
                    </div>
                    
                  </div>
                </NavLink>
              </motion.div>
            ))}
          </div>


        </CardContent>
      </Card>
    </motion.div>
  </div>
</main>

  );
}