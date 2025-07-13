# 🐾 AllAboutPet

**AllAboutPet** — это веб-приложение для владельцев домашних животных, где можно хранить, отслеживать и делиться всей важной информацией о питомцах: от биографии до прививок, фото, событий и документов.  
Также проект предполагает подключение специалистов (ветеринары, волонтёры) и расширенные функции: блог, календарь, Telegram-уведомления и рекомендации по товарам.

---

## 🚀 Stack

- **Frontend**: React (SPA), React Router, Axios
- **Backend**: Node.js, Express, JWT, bcrypt
- **Database**: PostgreSQL (UTF-8, ru_RU.UTF-8)
- **Auth**: JWT + планируется Google OAuth и Telegram
- **Dev tools**: ESLint, Prettier, Git, PgAdmin, Postman
- **ORM/Query**: `pg` или Sequelize (в процессе)
- **Хостинг**: TBD (в процессе — локально)

---

## 📁 Структура репозитория

``` bash
/backend             # Node.js + Express REST API
├── config/        # подключение к БД, переменные среды
├── controllers/   # логика маршрутов
├── models/        # SQL/ORM модели
├── routes/        # API endpoints
├── middlewares/   # auth, role check и т.д.
└── app.js         # точка входа сервера

/frontend            # React-приложение
├── public/
└── src/
├── components/  # переиспользуемые UI-блоки
├── pages/       # Login, Dashboard, Pets и т.д.
├── services/    # API-клиенты
└── App.js       # точка входа UI

.env                 # переменные окружения
.gitignore
README.md

````

---

## ⚙️ Установка и запуск

### 1. 📦 Установить зависимости

```bash
cd backend
npm install

cd ../frontend
npm install
````

### 2. ⚙️ Настроить `.env`

Создай файл `.env` в `/backend`:

```env
PORT=5000
DATABASE_URL=postgres://allaboutpetadmin:yourpassword@localhost:5432/allaboutpetbasic
JWT_SECRET=supersecretkey
```

(добавь аналогично в `/frontend`, если будут публичные ключи или API-адреса)

### 3. 🧪 Запуск

```bash
# backend
cd backend
npm run dev

# frontend (если Vite)
cd ../frontend
npm run dev
```

---

## 🔐 Аутентификация и роли

Используется **JWT** для защиты приватных API.  
Роли:

- `admin`: полный доступ
- `owner`: пользователь, владелец питомцев
- `vet`: ветеринар
- `volunteer`: волонтёр
- `guest`: гость (ограниченные права)

JWT создаётся на логине и хранится в `localStorage` клиента.

---

## 🐶 Основные сущности

- **users** — пользователи (разные роли, биография, настройки публичности, Telegram ID)
- **pets** — питомцы (могут быть у нескольких владельцев, родители, дети, bio, фото)
- **events** — события (прививки, груминг, приёмы, дни рождения)
- **item\_sets + items** — подборки товаров по виду, возрасту
- **documents** — фото/файлы питомца
- **favorites** — избранные питомцы или друзья
- **blog\_posts** — блог (тексты от пользователей, с модерацией)

[Полная ER-диаграмма в `/docs/er/`](./docs/er/allaboutpet_merged_colored_er.png)

---

## 📅 Планы по спринтам

| Спринт | Что делаем                                      |
| ------ | ----------------------------------------------- |
| 0      | Подготовка окружения, проектирование            |
| 1      | Аутентификация (регистрация, логин, JWT)        |
| 2      | CRUD питомцев, роли и права                     |
| 3      | React: регистрация, логин, хранение токена      |
| 4      | UI: список, добавление, редактирование питомцев |
| 5      | Google OAuth и Telegram уведомления             |
| 6      | UI + полировка + тесты + документация           |

---

## ✉️ Telegram-бот (в планах)

1. Пользователь подключает Telegram (вводит username или жмёт кнопку)
2. Бот сохраняет chat\_id
3. Сервер шлёт уведомления через API (о событиях, днях рождения и т.п.)

---

## 🌍 OAuth через Google (в планах)

- Настройка через Passport.js
- Регистрация/вход через Google
- Получение токена и интеграция в стандартную JWT-логику

---

## ✅ Чеклист текущего состояния

- [x] PostgreSQL и PGAdmin настроены (UTF-8, `ru_RU`)
- [x] Таблицы: `users`, `pets`, `pet_owners`, `events`, `documents`, `favorites`
- [x] JWT логика (в процессе)
- [ ] Telegram-бот — TODO
- [ ] Google OAuth — TODO
- [ ] Swagger API docs — TODO
- [ ] Хостинг (Railway / Render / Fly.io) — TODO

---

## 🛠 Полезные команды

```bash
# сбросить схему БД (в psql)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

# запуск сервера с nodemon
cd backend
npm run dev

# запуск React фронта
cd frontend
npm run dev
```

---

## 🧠 Советы по архитектуре

- Используем REST API: `/api/pets`, `/api/users/me`, и т.д.
- JWT middleware проверяет токен → добавляет `req.user`
- Роли проверяются через `checkRole(['admin'])`
- Только владелец или админ может редактировать питомца
- Фронтенд хранит токен в `localStorage`

---

## 🤝 Вклад и планы

Проект развивается по аджайл-спринтам, весь код на GitHub.
В будущем планируется:

- мобильная версия
- пуш-уведомления
- импорт мед. карт и паспортов
- локализация (i18n)
- полноценный блог с комментами

---

## 📄 Лицензия

MIT — свободно использовать, дорабатывать и публиковать.
