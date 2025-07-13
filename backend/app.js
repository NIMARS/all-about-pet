require('dotenv').config();
const express = require('express');
const cors = require('cors');

const sequelize = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const petRoutes = require('./routes/petRoutes');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);

// Тестовая ручка
app.get('/api/health', (req, res) => {
  res.send('OK');
});

// Подключение и запуск
sequelize
  .authenticate()
  .then(() => console.log('✅ PostgreSQL connected'))
  .then(() => sequelize.sync({ alter: true })) // альтернатива миграциям, на старте
  .then(() => console.log('✅ Models synchronized'))
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('❌ Initialization error:', err));
