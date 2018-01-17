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

    Recipe.hasMany(models.RecipeIngredient, {
      foreignKey: 'recipeId',
      as: 'recipeIngredients'
    });

    Recipe.hasMany(models.RecipeTag, {
      foreignKey: 'recipeId',
      as: 'recipeTags'
    });
  }

  return Recipe;
};