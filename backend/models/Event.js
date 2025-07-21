module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define('Event', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        description: DataTypes.TEXT,
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        event_date: { type: DataTypes.DATEONLY, allowNull: false },
        type: {
            type: DataTypes.ENUM('vet_visit', 'helminth_pills', 'vaccination', 'grooming', 'birthday', 'medicine', 'other'),
            allowNull: false,
        },
        repeat: {
            type: DataTypes.ENUM('once', 'daily', 'weekly', 'monthly', 'yearly'),
            defaultValue: 'once',
          },
        notes: DataTypes.TEXT,
        status: {
            type: DataTypes.STRING(20),
            defaultValue: 'planned', // planned, completed, skipped
        },
        pet_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'events',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
    });

    Event.associate = models => {
        Event.belongsTo(models.Pet, {
          foreignKey: 'pet_id',
          as: 'pet',
        });
      };

    return Event;
};