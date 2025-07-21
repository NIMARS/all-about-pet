const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = require('./User')(sequelize, DataTypes);
const Pet = require('./Pet')(sequelize, DataTypes);
const Event = require('./Event')(sequelize, DataTypes);
const Document = require('./document')(sequelize, DataTypes);
const UserPet = require('./UserPet')(sequelize, DataTypes);

// --- Ассоциации ---
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

Pet.hasMany(Event, {
  foreignKey: 'pet_id',
  as: 'events',
});

Event.belongsTo(Pet, {
  foreignKey: 'pet_id',
  as: 'pet',
});

// --- models export---
module.exports = {
  sequelize,
  Sequelize,
  User,
  Pet,
  Event,
  Document,
  UserPet,
};
