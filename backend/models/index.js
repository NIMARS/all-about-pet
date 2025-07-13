const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // ← тут уже готовый Sequelize-инстанс

// 💡 Инициализируем модели
const User = require('./User')(sequelize, DataTypes);
const Pet = require('./Pet')(sequelize, DataTypes);

// 💡 Теперь создаём связи
User.belongsToMany(Pet, {
  through: 'user_pets',
  as: 'pets',
  foreignKey: 'user_id',
});
Pet.belongsToMany(User, {
  through: 'user_pets',
  as: 'users',
  foreignKey: 'pet_id',
});

module.exports = {
  sequelize,
  Sequelize,
  User,
  Pet,
};
