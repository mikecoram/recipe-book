'use strict';
module.exports = function(sequelize, DataTypes) {
  var Ingredient = sequelize.define('Ingredient', {
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING
  });

  Ingredient.associate = function(models) {
    Ingredient.belongsTo(models.User, {
      foreignKey: 'userId',
      targetKey: 'id',
      as: 'user'
    });
  }

  return Ingredient;
};