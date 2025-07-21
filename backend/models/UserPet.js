module.exports = (sequelize, DataTypes) => {
    const UserPet = sequelize.define('UserPet', {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      pet_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'pets',
          key: 'id',
        },
      },
    }, {
      tableName: 'user_pets',
      timestamps: false,
    });
  
    return UserPet;
  };
  