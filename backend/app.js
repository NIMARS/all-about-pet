require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Тестовая ручка
app.get('/api/health', (req, res) => {
  res.send('OK');
});

const sequelize = require('./config/database');

sequelize
  .authenticate()
  .then(() => console.log('✅ PostgreSQL connected'))
  .catch(err => console.error('❌ DB connection error:', err));

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

const User = require('./models/User');

sequelize.sync({ alter: true }) // sync + alter для автообновления структуры заем заменить на migrations
  .then(() => console.log('Models synchronized'))
  .catch(err => console.error('Model sync error:', err));

  const authRoutes = require('./routes/authRoutes');
  app.use('/api/auth', authRoutes);
  
