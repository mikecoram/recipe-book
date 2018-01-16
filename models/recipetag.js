'use strict';
module.exports = function(sequelize, DataTypes) {
  var RecipeTag = sequelize.define('RecipeTag', {
    recipeId: DataTypes.INTEGER,
    tagId: DataTypes.INTEGER
  });

  RecipeTag.associate = function(models) {
    RecipeTag.belongsTo(models.Recipe, {
      foreignKey: 'recipeId',
      targetKey: 'id',
      as: 'recipe'
    });

    RecipeTag.belongsTo(models.Tag, {
      foreignKey: 'tagId',
      targetKey: 'id',
      as: 'tag'
    });
  }

  return RecipeTag;
};