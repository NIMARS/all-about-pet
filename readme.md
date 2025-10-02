# All About Pet — Monorepo (API + Web)

## Русский

[Русский](#русский) | [English](#english)

Питомцы, события, документы, избранное.
Бэкенд на **Node.js + Express + TypeScript + Prisma (PostgreSQL)**, фронт на **Vite + React**.
Авторизация: **JWT access** в заголовке + **refresh** в **HttpOnly cookie**.

## Что изменилось (миграции)

* **JavaScript → TypeScript**: весь бэкенд и новые модули теперь на TS.
* **Sequelize → Prisma**: модели/миграции/seed через Prisma; `config/database.js` и `models/*` удалены.
* **CRA/Express-статик → Vite**: фронтенд — отдельный dev-сервер Vite (порт по умолчанию 5173), API — отдельно (порт 5000).
* **JWT-архитектура**: `accessToken` возвращается в JSON, `refresh_token` — HttpOnly cookie (`/api/auth/refresh`).
* **Загрузка документов**: сейчас — локально (Multer) с записью в таблицу `documents`. Планируется MinIO/S3.

## Текущий стек

## Backend

* Node.js (22.x)
* Express 4, TypeScript, tsx (dev-run)
* Prisma ORM + PostgreSQL
* Zod для валидации
* Multer (upload локально), cookie-parser, cors
* JWT (jsonwebtoken@9)

## Frontend

* Vite + React
* Axios (interceptors, withCredentials)
* React Router

## Прочее

* ESLint/Prettier
* Dotenv
* (опционально) Redis (под чёрный список токенов/лимитирование — пока заглушка)

## Что дальше (roadmap)

* **Fastify-профиль** (опция): альтернатива Express (маршруты 1:1, совместимые контроллеры).
* **Тесты**: Jest/Vitest на бэкенд + React Testing Library на фронт.
* **БД расширение**: доп.поля питомца (введены: `color/birthplace/location/photoUrl/privacy`), статусы документов, типы событий, RBAC.
* **Хранилище**: MinIO/S3 (ключ `key` в `documents` уже учтён).
* **E-mail подтверждение/сброс пароля**.
* **Rate limiting + Redis**.
* **Docker/CI**: docker-compose (api+db+minio+redis), GitHub Actions.

---

## Структура проекта

```bash
.
├─ .env
├─ package.json
├─ tsconfig.json
├─ prisma/
│  ├─ schema.prisma
│  ├─ migrations/
│  └─ seed.ts
├─ uploads/
│  └─ documents/               # local storage
├─ src/
│  ├─ server.ts                # API start
│  ├─ lib/prisma.ts
│  ├─ types/express.d.ts       # for express + req.user
│  ├─ controllers/
│  │  ├─ auth.controller.ts
│  │  ├─ pet.controller.ts
│  │  ├─ event.controller.ts
│  │  └─ document.controller.ts
│  ├─ routes/
│  │  ├─ auth.routes.ts
│  │  ├─ pet.routes.ts
│  │  ├─ event.routes.ts
│  │  └─ document.routes.ts
│  ├─ middleware/
│  │  ├─ auth.ts
│  │  ├─ role.ts
│  │  └─ upload.ts             # multer
│  └─ plugins/                 # future path
│     ├─ redis.ts              
│     └─ s3.ts                 
└─ web/                        # frontend (Vite)
   ├─ src/
   └─ index.html
```

---

## Быстрый старт

### 1) Подготовка

* Node.js ≥ 20 (рекомендовано 22.x)
* PostgreSQL (локально на `localhost:5432`)
* (опционально) Redis/MinIO

### 2) .env

Пример (минимум):

```env
# PostgreSQL
DATABASE_URL=postgres://user:password@localhost:5432/allaboutpetbasic

# JWT
JWT_ACCESS_SECRET=change_me_access
JWT_REFRESH_SECRET=change_me_refresh
ACCESS_TTL=15m
REFRESH_TTL=30d

# CORS
CORS_ORIGIN=http://localhost:5173

# uploads/static
PORT=5000

# S3/MinIO (на будущее)
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=allaboutpet
S3_ACCESS=minio
S3_SECRET=minio123
S3_REGION=us-east-1

# Redis (на будущее)
REDIS_URL=off
```

> **Важно:** Для кросс-доменных cookie в проде ставьте `sameSite=none` и `secure=true` в cookie-настройках refresh.

### 3) Установка и миграции

```bash
npm i
npx prisma generate
npx prisma migrate dev -n init
npm run prisma:seed   # seeding - "prisma:seed": "tsx prisma/seed.ts"
```

### 4) Запуск API (dev)

```bash
npm run dev:api       # tsx src/server.ts
```

API: `http://localhost:5000`

### 5) Запуск фронта (Vite)

В папке фронта:

```bash
npm i
npm run dev           # http://localhost:5173
```

`axios` должен быть сконфигурирован с:

```js
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true, // for refresh-cookie
});
```

---

## Контракты API (TL;DR)

Базовый URL: `/api`

### Auth

* `POST /auth/register` — регистрирует, возвращает `{ accessToken, user }`, ставит `refresh_token` в HttpOnly cookie.
* `POST /auth/login` — `{ email, password }` → `{ accessToken }` + refresh cookie.
* `POST /auth/refresh` — читает refresh из cookie, возвращает новый `{ accessToken }`, ротация refresh.
* `POST /auth/logout` — гасит refresh-сессию, чистит cookie.
* `GET /auth/profile` — требует `Authorization: Bearer <access>`.

### Pets (требует авторизации)

* `GET /pets` — список питомцев текущего пользователя.
* `POST /pets` — создать питомца. Тело:

  ```json
  {
    "name": "Mia",
    "species": "cat",
    "breed": "Scottish Fold",
    "birthday": "2024-04-27",
    "bio": "...",
    "color": "tortoiseshell",
    "birthplace": "Almaty",
    "location": "Almaty",
    "photo_url": "https://...",
    "privacy": "private"
  }
  ```

* `GET /pets/:id`
* `PUT /pets/:id`
* `DELETE /pets/:id`

### Events (требует авторизации)

* `GET /events?status=&date=&pet_id=`
* `POST /events` — `{ title, description?, date|event_date, type, repeat, status, pet_id, notes? }`
* `GET /events/:id`
* `PUT /events/:id`
* `DELETE /events/:id`

### Documents (требует авторизации)

* `GET /documents/:pet_id` — список документов питомца
* `POST /documents/:pet_id` — `multipart/form-data`, поле `file`; сохраняет локально и в БД запись c `sha256`
* `DELETE /documents/:id`

Статика: `/uploads/documents/*`.

---

## Авторизация (детали)

* **AccessToken** — кладём в `localStorage` и отправляем в `Authorization: Bearer ...`.
* **RefreshToken** — хранится только в **HttpOnly cookie** (`refresh_token`, путь `/api/auth/refresh`).
* На фронте включить:

  * Axios: `withCredentials: true`
  * CORS на бэке: `credentials: true`, `origin` — URL фронта
* Интерсептор 401 на фронте: один раз вызывает `POST /auth/refresh`, сохраняет новый access и повторяет запрос.

---

## Prisma

Схема (`prisma/schema.prisma`) включает:

* `User` (role: `owner|vet|admin` — enum)
* `Pet` (+ поля `color/birthplace/location/photoUrl/privacy`)
* `Event` (`EventRepeat`, `EventStatus`, `notes?`)
* `Document` (`filename/mimeType/size/sha256/key?/url?/originalName?/description?`)
* `RefreshSession` (hash refresh токена, метаданные, `expiresAt`)

Команды:

```bash
npx prisma generate
npx prisma migrate dev -n <name>
npm run prisma:seed
npx prisma studio
```

---

## Скрипты (пример)

```json
{
  "scripts": {
    "dev:api": "tsx src/server.ts",
    "build:api": "tsc -p tsconfig.json",
    "start:api": "node dist/server.js",
    "prisma:seed": "tsx prisma/seed.ts",
    "lint": "eslint .",
    "format": "prettier -w ."
  }
}
```

> Актуальный список в `package.json`.

---

## Тесты (план)

* **API**: Jest/Vitest, supertest для e2e по маршрутам.
* **Фронт**: Vitest + React Testing Library.
* **Фикстуры**: seed-данные через Prisma, тестовая БД.

---

## Траблшутинг

* **400 при регистрации**: check `{ name, email, password }`. `Validation failed` || `Email already exists`?
* **401 на защищённых эндпоинтах**: check `Authorization: Bearer <access>` && `withCredentials: true`. Интерсептор должен дернуть `/auth/refresh`.
* **`Invalid Date` в `expiresAt`**:  `ms(REFRESH_TTL)` - depricated use:  `REFRESH_EXPIRES_SEC` → `new Date(Date.now() + sec*1000)`.
* **CORS**: на бэке `cors({ origin: CORS_ORIGIN, credentials: true })`; на фронте `withCredentials: true`.
* **JWT import**: для `jsonwebtoken@9`  `import jwt from 'jsonwebtoken'` (CJS), не `{ sign, verify }`.

---

## Лицензия

MIT (maybe).

---

## All About Pet — Monorepo  (API + Web)

## English

[Русский](#русский) | [English](#english)

---

Pets, events, documents, favorites.
Backend: **Node.js + Express + TypeScript + Prisma (PostgreSQL)**, frontend: **Vite + React**.
Auth: **JWT access** in header + **refresh** in **HttpOnly cookie**.

## What Changed (Migrations)

* **JavaScript → TypeScript**: entire backend and new modules are now in TS.
* **Sequelize → Prisma**: models/migrations/seed through Prisma; `config/database.js` and `models/*` removed.
* **CRA/Express-static → Vite**: frontend — separate Vite dev server (default port 5173), API — separate (port 5000).
* **JWT architecture**: `accessToken` returned in JSON, `refresh_token` in HttpOnly cookie (`/api/auth/refresh`).
* **Document upload**: currently — locally (Multer) with record in `documents` table. MinIO/S3 planned.

## Current Stack

### Backend_

* Node.js (22.x)
* Express 4, TypeScript, tsx (dev-run)
* Prisma ORM + PostgreSQL
* Zod for validation
* Multer (local uploads), cookie-parser, cors
* JWT (jsonwebtoken@9)

### Frontend_

* Vite + React
* Axios (interceptors, withCredentials)
* React Router

### Other

* ESLint/Prettier
* Dotenv
* (optional) Redis (for token blacklist/rate limiting — stub for now)

## Roadmap

* **Fastify profile** (option): alternative to Express (1:1 routes, compatible controllers).
* **Tests**: Jest/Vitest for backend + React Testing Library for frontend.
* **DB expansion**: extra pet fields (`color/birthplace/location/photoUrl/privacy`), document statuses, event types, RBAC.
* **Storage**: MinIO/S3 (field `key` already present in `documents`).
* **E-mail confirmation/password reset**.
* **Rate limiting + Redis**.
* **Docker/CI**: docker-compose (api+db+minio+redis), GitHub Actions.

---

## Project Structure

```bash
.
├─ .env
├─ package.json
├─ tsconfig.json
├─ prisma/
│  ├─ schema.prisma
│  ├─ migrations/
│  └─ seed.ts
├─ uploads/
│  └─ documents/               # local storage
├─ src/
│  ├─ server.ts                # API entrypoint
│  ├─ lib/prisma.ts
│  ├─ types/express.d.ts       # for express + req.user
│  ├─ controllers/
│  │  ├─ auth.controller.ts
│  │  ├─ pet.controller.ts
│  │  ├─ event.controller.ts
│  │  └─ document.controller.ts
│  ├─ routes/
│  │  ├─ auth.routes.ts
│  │  ├─ pet.routes.ts
│  │  ├─ event.routes.ts
│  │  └─ document.routes.ts
│  ├─ middleware/
│  │  ├─ auth.ts
│  │  ├─ role.ts
│  │  └─ upload.ts             # multer
│  └─ plugins/                 # future path
│     ├─ redis.ts              
│     └─ s3.ts                 
└─ web/                        # frontend (Vite)
   ├─ src/
   └─ index.html
```

---

## Quick Start

### 1) Requirements

* Node.js ≥ 20 (recommended 22.x)
* PostgreSQL (local on `localhost:5432`)
* (optional) Redis/MinIO

### 2)  .env

Example (minimal):

```env
# PostgreSQL
DATABASE_URL=postgres://user:password@localhost:5432/allaboutpetbasic

# JWT
JWT_ACCESS_SECRET=change_me_access
JWT_REFRESH_SECRET=change_me_refresh
ACCESS_TTL=15m
REFRESH_TTL=30d

# CORS
CORS_ORIGIN=http://localhost:5173

# uploads/static
PORT=5000

# S3/MinIO (future)
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=allaboutpet
S3_ACCESS=minio
S3_SECRET=minio123
S3_REGION=us-east-1

# Redis (future)
REDIS_URL=off
```

> **Important:** For cross-domain cookies in production set `sameSite=none` and `secure=true` in refresh cookie options.

### 3) Install & Migrations

```bash
npm i
npx prisma generate
npx prisma migrate dev -n init
npm run prisma:seed   # seeding - "prisma:seed": "tsx prisma/seed.ts"
```

### 4) Run API (dev)

```bash
npm run dev:api       # tsx src/server.ts
```

API: `http://localhost:5000`

### 5) Run frontend (Vite)

Inside `web/` folder:

```bash
npm i
npm run dev           # http://localhost:5173
```

Axios should be configured with:

```js
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true, // for refresh cookie
});
```

---

## API Contracts (TL;DR)

Base URL: `/api`

### Auth_

* `POST /auth/register` — registers, returns `{ accessToken, user }`, sets `refresh_token` in HttpOnly cookie.
* `POST /auth/login` — `{ email, password }` → `{ accessToken }` + refresh cookie.
* `POST /auth/refresh` — reads refresh from cookie, returns new `{ accessToken }`, rotates refresh.
* `POST /auth/logout` — invalidates refresh session, clears cookie.
* `GET /auth/profile` — requires `Authorization: Bearer <access>`.

### Pets (auth required)

* `GET /pets` — list user’s pets.
* `POST /pets` — create pet. Example:

  ```json
  {
    "name": "Mia",
    "species": "cat",
    "breed": "Scottish Fold",
    "birthday": "2024-04-27",
    "bio": "...",
    "color": "tortoiseshell",
    "birthplace": "Almaty",
    "location": "Almaty",
    "photo_url": "https://...",
    "privacy": "private"
  }
  ```

* `GET /pets/:id`
* `PUT /pets/:id`
* `DELETE /pets/:id`

### Events (auth required)

* `GET /events?status=&date=&pet_id=`
* `POST /events` — `{ title, description?, date|event_date, type, repeat, status, pet_id, notes? }`
* `GET /events/:id`
* `PUT /events/:id`
* `DELETE /events/:id`

### Documents (auth required)

* `GET /documents/:pet_id` — list pet’s documents
* `POST /documents/:pet_id` — `multipart/form-data`, field `file`; saves locally and in DB with `sha256`
* `DELETE /documents/:id`

Static: `/uploads/documents/*`.

---

## Auth (details)

* **AccessToken** — stored in `localStorage`, sent in `Authorization: Bearer ...`.
* **RefreshToken** — stored only in **HttpOnly cookie** (`refresh_token`, path `/api/auth/refresh`).
* On frontend enable:

  * Axios: `withCredentials: true`
  * Backend CORS: `credentials: true`, `origin` — frontend URL
* Frontend 401 interceptor: calls `POST /auth/refresh` once, stores new access, retries request.

---

## Prisma_

Schema (`prisma/schema.prisma`) includes:

* `User` (role: `owner|vet|admin` — enum)
* `Pet` (+ fields `color/birthplace/location/photoUrl/privacy`)
* `Event` (`EventRepeat`, `EventStatus`, optional `notes`)
* `Document` (`filename/mimeType/size/sha256/key?/url?/originalName?/description?`)
* `RefreshSession` (hashed refresh token, metadata, `expiresAt`)

Commands:

```bash
npx prisma generate
npx prisma migrate dev -n <name>
npm run prisma:seed
npx prisma studio
```

---

## Scripts (example)

```json
{
  "scripts": {
    "dev:api": "tsx src/server.ts",
    "build:api": "tsc -p tsconfig.json",
    "start:api": "node dist/server.js",
    "prisma:seed": "tsx prisma/seed.ts",
    "lint": "eslint .",
    "format": "prettier -w ."
  }
}
```

See `package.json` for actual list.

---

## Tests (plan)

* **API**: Jest/Vitest, supertest for e2e route tests.
* **Frontend**: Vitest + React Testing Library.
* **Fixtures**: seed data via Prisma, test DB.

---

## Troubleshooting

* **400 on register**: check `{ name, email, password }`. `Validation failed` || `Email already exists`?
* **401 on protected routes**: check `Authorization: Bearer <access>` && `withCredentials: true`. Interceptor should hit `/auth/refresh`.
* **`Invalid Date` in `expiresAt`**: use `new Date(Date.now() + sec*1000)` instead of deprecated `ms(REFRESH_TTL)`.
* **CORS**: backend → `cors({ origin: CORS_ORIGIN, credentials: true })`; frontend → `withCredentials: true`.
* **JWT import**: with `jsonwebtoken@9`, use `import jwt from 'jsonwebtoken'` (CJS), not `{ sign, verify }`.

---

## License

MIT (maybe).

---

Do you also want me to **polish this translation into a GitHub README style** (with better formatting, clearer English flow), or keep it literal and close to the Russian text?
