const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(150),
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password_hash: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'owner', 'vet', 'volunteer', 'guest'),
    allowNull: false,
    defaultValue: 'owner',
  },
  telegram: {
    type: DataTypes.STRING(100),
  },
  bio: {
    type: DataTypes.TEXT,
  },
  is_private: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  avatar_url: {
    type: DataTypes.TEXT,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'users',
  timestamps: false,
});

module.exports = User;
