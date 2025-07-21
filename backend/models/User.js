module.exports = (sequelize, DataTypes) => {
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
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'owner',
      validate: {
        isIn: [['admin', 'owner', 'vet', 'volunteer', 'guest']],
      },
    },
    telegram: DataTypes.STRING(100),
    bio: DataTypes.TEXT,
    is_private: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    avatar_url: DataTypes.TEXT,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'users',
    timestamps: false,
  });
  
  return User;
};
