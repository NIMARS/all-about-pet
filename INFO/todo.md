# План разработки приложения по спринтам

## Спринт 0: Подготовка и планирование

* **Определение требований и областей ответственности.**  
Чётко опишем функциональность:пользователи (владельцы домашних животных) смогут регистрироваться и управлять данными о своих питомцах.  
Все права (кроме администратора) действуют только в рамках своего профиля и связанных питомцев.  

* **Инструменты и окружение:**  
Установим Node.js, Visual Studio Code, PostgreSQL.  
Заводим репозиторий на GitHub и `.gitignore` для Node/React.  

* **Проектная структура:**  
Создадим монолитный репозиторий, в котором будут две основные части:
**backend** (Node/Express) и **frontend** (React).

  ``` bash
  /backend      # Node.js + Express + PostgreSQL (API)
    config/    # конфигурация (настройки БД, секреты)
    controllers/
    models/
    routes/
    middlewares/
    app.js     # точка входа, запуск сервера
  /frontend     # React-приложение
    public/
    src/
      components/  # переиспользуемые UI-компоненты
      pages/       # страницы (Login, Dashboard, Pets и т.д.)
      services/    # API-клиент (axios/fetch)
      App.js       # главный компонент
      index.js     # точка входа React
  .env         # хранит переменные окружения (порт, креды БД)
  package.json # зависимости (могут быть разделены на backend/frontend)
  ```

* **Схема базы данных:** Проектируем таблицы. Минимальные сущности:

  * **users**: `(id SERIAL, name, email UNIQUE, password, role (user/admin))`.
  * **pets**: `(id SERIAL, owner_id REFERENCES users(id), name, breed, birthday, description)`,
  и т.д.
    Можно создать командой:

  ```sql
  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user'
  );
  CREATE TABLE pets (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    breed VARCHAR(100),
    birthday DATE,
    description TEXT
  );
  ```

* **Ролевую модель:**  
Две роли – `user` (обычный владелец) и `admin`.  
Все запросы должны проверять роль: обычный пользователь может менять только свои данные и питомцев (проверка по `owner_id`), администратор может работать со всеми записями.

* **Безопасность:**  
Будем использовать **JWT** для аутентификации и HTTPS (в будущем).  
Пароли храним хэшированными (bcrypt). Права доступа проверяем в middleware перед запросами к ресурсам. JWT – это компактный самодостаточный токен, подписываемый секретом. На этом этапе подготовим библиотеку `jsonwebtoken` и настроим обработку токенов.

* **Настройка Node.js и Express:**  
Инициализируем проект (`npm init`), устанавливаем зависимости: `express`, `pg`/`pg-hstore` (или ORM Sequelize), `cors`, `bcryptjs`, `jsonwebtoken` и т.д.  
Создаём шаблон `app.js` для запуска сервера.  
Устанавливаем подключение к PostgreSQL (например, через `sequelize` или `pg`).

* **Напишем простую тестовую ручку:**  
Например, на `GET /api/health` возвращает «OK», чтобы убедиться, что сервер и БД работают корректно.

 файл `/backend/app.js` может выглядеть так:
>
> ```js
> const express = require('express');
> const cors = require('cors');
> const app = express();
> app.use(cors());
> app.use(express.json());
> app.get('/api/health', (req, res) => res.send('OK'));
> // Запуск сервера:
> const PORT = process.env.PORT || 3000;
> app.listen(PORT, () => console.log(`Server running on ${PORT}`));
> ```

После этого сервер должен стартовать и отвечать на запрос `GET /api/health` строкой «OK».

## Спринт 1: Бэкенд – аутентификация и модели

* **Модель пользователя:**  
Реализуем таблицу `users` на уровне модели (например, с помощью ORM Sequelize или вручную через `pg`).  
Каждому пользователю задаём поля (см. выше). Добавим хук или логику для хеширования пароля через bcrypt при сохранении.
* **Регистрация и логин:**  
Создадим маршруты `POST /api/auth/register` и `POST /api/auth/login`.

  * *Регистрация:* принимает имя, email и пароль. Проверяет уникальность email, хеширует пароль и сохраняет нового пользователя с ролью `user`.
  * *Логин:* сравнивает введённый пароль с хэшем. При успехе генерирует JWT (подписывает `{userId, role}`, срок годности 1-2 часа) и возвращает его клиенту.
    Пример генерации токена:

  ```js
  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  ```

* **Middleware аутентификации:**  
Напишем middleware, который проверяет JWT из заголовка `Authorization: Bearer <token>`, декодирует его и добавляет в `req.user`.  
Если нет токена или он невалидный – возвращаем 401. Это защищает все приватные маршруты.
* **Ролевой доступ:**  
Создаём middleware типа `checkRole(['admin'])`, который проверяет `req.user.role`.  
Для обычного пользователя также проверяем, что выполняемая операция относится к его данным (например, в маршруте обновления питомца проверяем `pet.owner_id === req.user.id` или `req.user.role === 'admin'`).
* **Тестирование API:**  
С помощью Postman/Insomnia проверим регистрацию, логин, генерацию и валидацию токена.  
Убедимся, что без токена к приватным роутам доступа нет, а с токеном – можно получить данные своего пользователя (`GET /api/users/me`) или создать питомца.
* **Пример:** маршрут для получения данных текущего пользователя:

  ```js
  app.get('/api/users/me', authMiddleware, async (req, res) => {
    const user = await User.findByPk(req.user.id);
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  });
  ```

## Спринт 2: Бэкенд – сущность «Питомец»

* **Модель питомца:**  
Реализуем таблицу `pets` и модель с полями (name, breed, birthday и т.д.). Свяжем её с пользователем через `owner_id`.
* **CRUD-роуты:**  
Создадим маршруты:

  * `POST /api/pets` – создание нового питомца (поле `owner_id` берем из `req.user.id`, игнорируем клиентское значение).
  * `GET /api/pets` – список питомцев текущего пользователя (WHERE owner\_id = текущий).
  * `GET /api/pets/:id` – данные одного питомца (только если владелец или админ).
  * `PUT /api/pets/:id`, `DELETE /api/pets/:id` – обновление и удаление (тоже только для владельца/админа).
    Во всех роутах проверяем права: обычный пользователь не может получить/сменить чужие записи.
* **Пример контроля доступа:**

  ```js
  app.get('/api/pets/:id', authMiddleware, async (req, res) => {
    const pet = await Pet.findByPk(req.params.id);
    if (!pet) return res.status(404).send({ error: 'Not found' });
    if (pet.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).send({ error: 'Forbidden' });
    }
    res.json(pet);
  });
  ```

* **Валидация данных:**  
Проверяем обязательные поля (имя питомца и т.п.) и корректность форматов (например, дата рождения). Можно использовать `express-validator` или простые `if` проверки.
* **Тестирование:**  
Снова с помощью Postman проверяем, что авторизованный пользователь может добавить своего питомца, а неопознанный – нет. Проверяем, что пользователь не видит чужих питомцев, а админ видит всё.

## Спринт 3: Фронтенд – регистрация и авторизация

* **Сборка React-приложения:**  
Генерируем приложение (например, с помощью `create-react-app` или Vite). Структура фронтенда может быть, например, как на \[14†L471-L480]: есть `src/pages` для страниц и `src/services` для взаимодействия с API.
* **Страница регистрации/логина:**  
Создаём формы для ввода имени, email и пароля.  
При отправке формы отправляем запросы на `POST /api/auth/register` и `/login`.
* **Хранение токена:**  
После удачного логина сохраняем JWT в `localStorage` или `sessionStorage`.  
В последующих запросах React-компоненты должны добавлять его в заголовок `Authorization`. Например, используя axios:

  ```js
  const api = axios.create({ baseURL: 'http://localhost:3000/api' });
  api.interceptors.request.use(config => {
    const token = localStorage.getItem('jwt');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  ```

* **Навигация и состояния:**  
Используем React Router для переключения между страницами.  
Добавляем маршруты `/login`, `/register`, `/dashboard`.  
После логина перенаправляем пользователя на его «доску» (dashboard).
* **Пример компонента:**

  ```jsx
  function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = async (e) => {
      e.preventDefault();
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('jwt', res.data.token);
      // перенаправить на dashboard
    };
    return (
      <form onSubmit={handleSubmit}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Пароль" />
        <button type="submit">Войти</button>
      </form>
    );
  }
  ```

* **Проверка входа:**  
После логина React получает от сервера токен, который добавляет к заголовкам.  
При этом из \[23†L50-L57] следует, что при клике на кнопку «Войти» фронтенд отправляет запрос к Node.js серверу по API, действуя «как официант, передающий заказ на кухню» (сервер).  
Мы реализуем именно такой обмен через REST-запросы.
* **Демонстрация результата:**  
В конце спринта фронтенд должен уметь регистрировать и логинить пользователя, сохраняя токен и обновляя интерфейс (например, показывая имя пользователя или кнопку «Выход»). Это позволит проверить работу авторизации до реализации остальных функций.

## Спринт 4: Фронтенд – CRUD питомцев и интерфейс

* **Страница «Мои питомцы»:**  
На дашборде показываем список питомцев текущего пользователя. Отправляем `GET /api/pets`. Для каждого питомца отображаем имя, вид, и кнопки «Редактировать» и «Удалить».
* **Создание питомца:**  
Добавляем кнопку «Добавить питомца», которая открывает форму (можно как отдельная страница или модальное окно). Форма отправляет данные на `POST /api/pets`.  
После успешного создания обновляем список.
* **Редактирование и удаление:**  
При клике «Редактировать» подгружаем данные питомца (`GET /api/pets/:id`) и позволяем менять поля, отправляя `PUT /api/pets/:id`.  
Кнопка «Удалить» вызывает `DELETE /api/pets/:id`.  
Не забываем обновить UI после операций.
* **Пример кода для списка:**

  ```jsx
  function PetsList() {
    const [pets, setPets] = useState([]);
    useEffect(() => {
      api.get('/pets').then(res => setPets(res.data));
    }, []);
    return (
      <div>
        <h2>Мои питомцы</h2>
        {pets.map(pet => (
          <div key={pet.id}>
            <h3>{pet.name}</h3>
            <p>{pet.breed}, дата рождения: {pet.birthday}</p>
            <button onClick={() => editPet(pet.id)}>Редактировать</button>
            <button onClick={() => deletePet(pet.id)}>Удалить</button>
          </div>
        ))}
      </div>
    );
  }
  ```

* **Обработка ошибок:**  
Показываем пользователю сообщения об ошибках (например, если запрос не удался или поля заполнены некорректно).  
Убедимся, что без токена доступ к этим страницам невозможен (редирект на логин).
* **Тестирование:**  
Проверяем сценарии: пользователь добавляет, редактирует, удаляет питомцев и видит результат сразу на странице.  
Также проверяем, что другой пользователь (или гость) не может получить к ним доступ (клиентское приложение должно запросить API, и тот ответит ошибкой 403/401).

## Спринт 5: Интеграция с Google (OAuth) и Telegram (уведомления)

* **Google OAuth:**  
Добавим возможность входа через Google для удобства. Используем Passport.js и стратегию Google OAuth 2.0. В backend: установим пакет `passport-google-oauth2`.  
Зарегистрируем приложение в Google Cloud Console и получим `clientID`/`clientSecret`.  
Настроим маршрут `GET /api/auth/google` (Passport будет перенаправлять на Google), и `GET /api/auth/google/callback` (обратный вызов). Верифицируем профиль, создаём или находим соответствующего пользователя и возвращаем JWT (или создаём сессию).
  *Пример:*

  ```js
  const GoogleStrategy = require('passport-google-oauth2').Strategy;
  passport.use(new GoogleStrategy({
      clientID: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
      callbackURL: 'http://localhost:3000/api/auth/google/callback'
    },
    (req, accessToken, refreshToken, profile, done) => {
      // Найти или создать пользователя по profile.email
    }
  ));
  ```

  После авторизации можно перенаправить пользователя на фронтенд с полученным токеном. Это повысит привлекательность приложения (может пригодиться при поиске работы).
* **Telegram-уведомления:**  
Реализуем отправку уведомлений через Telegram-бота.  
Для этого нужно создать бота через BotFather и получить `TOKEN`.  
В backend установим библиотеку `node-telegram-bot-api` или просто используем HTTP-запросы.  
Как указано на StackOverflow, **без бота нельзя отправлять сообщения пользователям** – нужно, чтобы пользователь начал диалог с ботом и мы сохранили его `chat_id`.
  Пример отправки сообщения:

  ```js
  const axios = require('axios');
  function sendTelegramMessage(chatId, text) {
    const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
    return axios.post(url, { chat_id: chatId, text });
  }
  ```

  Выберем событие для уведомления – например, напоминание о дне рождения питомца. При добавлении/обновлении питомца сохраняем его `birthday`, и можно настроить cron-задачу или при каждом запуске сервера проверять, у кого сегодня день рождения питомца, и слать сообщение. Пользователь при регистрации связывает свой аккаунт с Telegram (напр. вводит свой Telegram ID или нажимает кнопку «Подключить Telegram» – тогда бот отправит приветственное сообщение).
* **Тестирование интеграций:**  
Проверяем, что при авторизации через Google мы получаем JWT и можем зайти в систему. Для Telegram – пускаем тестовое сообщение (бот -> наш сервер -> отправка сообщения через API).  
Убедимся, что уведомления приходят в Telegram правильно.

## Спринт 6: Завершение и финальные задачи

* **Полировка интерфейса:**  
Добавляем базовый CSS/Framework (например, Bootstrap или Tailwind), чтобы приложение выглядело опрятно. Проверяем адаптивность и удобство.
* **Локализация:**  
Если необходимо, готовим структуры для перевода (например, `i18next` или React Intl), но выполняем её позднее, как запланировано.
* **Тесты:**  
Можно написать несколько модульных тестов для критичных частей (например, проверки middleware аутентификации).
* **Документация:**  
Оформляем README с инструкциями по установке и запуску. Это пригодится при поиске работы.
* **Ревью промежуточных результатов:**  
На каждом спринте сохраняем изменения в Git.  
По возможности показываем версии коллегам или менторам – даже если формальных заказчиков нет, полезно иметь фидбэк (даже самому себе через ревью кода).

## Принципы работы

1. **Аджайл-подход:**  
Каждый спринт – это короткий цикл (1–2 недели с вашим графиком 4+ часа в день). В начале планируем, в конце проверяем результат (см. дз/ревью).
2. **Параллелизм задач:**  
По возможности совмещаем фронтенд с бэкендом. Например, пока на фронтенде делаем макеты, параллельно в бэке настраиваем API; затем навзаим, подключаем API к UI.
3. **Частые коммиты:**  
Коммитим часто, разбивая задачи на мелкие части (каждая срабатывающая функция – отдельный коммит). Это даст быстрый отклик и поможет найти ошибки.
4. **Учимся на ходу:**  
Не бойтесь читать документацию и искать примеры (например, \[18†L98-L101] – типичная архитектура для React/Node). Каждая новая фича – это опыт, который пригодится в будущей работе.
