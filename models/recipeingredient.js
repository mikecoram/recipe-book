'use strict';
module.exports = function(sequelize, DataTypes) {
  var RecipeIngredient = sequelize.define('RecipeIngredient', {
    recipeId: DataTypes.INTEGER,
    ingredientId: DataTypes.INTEGER,
    quantity: DataTypes.STRING,
    text: DataTypes.STRING
  });

  RecipeIngredient.associate = function(models) {
    RecipeIngredient.belongsTo(models.Recipe, {
      foreignKey: 'recipeId',
      targetKey: 'id',
      as: 'recipe'
    });

    RecipeIngredient.belongsTo(models.Ingredient, {
      foreignKey: 'ingredientId',
      targetKey: 'id',
      as: 'ingredient'
    });
  }

  return RecipeIngredient;
};