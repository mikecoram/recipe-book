'use strict';
module.exports = function(sequelize, DataTypes) {
  var Recipe = sequelize.define('Recipe', {
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    method: DataTypes.STRING,
    nutrition: DataTypes.STRING
  });

  Recipe.associate = function (models) {
    Recipe.belongsTo(models.User, {
      foreignKey: 'userId',
      targetKey: 'id',
      as: 'user'
    });
  }

  return Recipe;
};