module.exports = (sequelize, DataTypes) => {
    const Document = sequelize.define('Document', {
      id: {            type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      filename: {      type: DataTypes.STRING,  allowNull: false },
      original_name: { type: DataTypes.STRING,  allowNull: false },
      mime_type: {     type: DataTypes.STRING,  allowNull: false },
      size: {          type: DataTypes.INTEGER, allowNull: false },
      file_url: {      type: DataTypes.STRING,  allowNull: false },
      description: {   type: DataTypes.TEXT },
      pet_id: {        type: DataTypes.INTEGER, allowNull: false },
      uploaded_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
      tableName: 'documents',
      timestamps: false,
    });
  
    Document.associate = models => {
      Document.belongsTo(models.Pet, {
        foreignKey: 'pet_id',
        as: 'pet',
      });
    };
  
    return Document;
  };
  