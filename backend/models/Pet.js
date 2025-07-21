module.exports = (sequelize, DataTypes) => {
    const Pet = sequelize.define('Pet', {
      name: {
        type:     DataTypes.STRING(100),
        allowNull: false,
      },
      species:    DataTypes.STRING(100),
      breed:      DataTypes.STRING(100),
      color:      DataTypes.STRING(50),
      birthday:   DataTypes.DATEONLY,
      birthplace: DataTypes.STRING(100),
      location:   DataTypes.STRING(100),
      bio:        DataTypes.TEXT,
      photo_url:  DataTypes.TEXT,
      privacy: {
        type:     DataTypes.BOOLEAN,
        defaultValue: false,
      },
    }, {
      tableName: 'pets',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    });
    
    return Pet;
  };
