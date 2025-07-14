const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // ← тут уже готовый Sequelize-инстанс

const User = require('./User')(sequelize, DataTypes);
const Pet = require('./Pet')(sequelize, DataTypes);

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

const Event = require('./Event')(sequelize, DataTypes);

Pet.hasMany(Event, { foreignKey: 'pet_id', as: 'events' });
Event.belongsTo(Pet, { foreignKey: 'pet_id', as: 'pet' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Pet,
  Event,
};
