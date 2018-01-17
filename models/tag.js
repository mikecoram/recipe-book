'use strict';
module.exports = function(sequelize, DataTypes) {
  var Tag = sequelize.define('Tag', {
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    color: DataTypes.STRING
  });

  Tag.associate = function (models) {
    Tag.belongsTo(models.User, {
      foreignKey: 'userId',
      targetKey: 'id',
      as: 'user'
    });

    Tag.hasMany(models.RecipeTag, {
      foreignKey: 'tagId',
      as: 'recipeTags'
    });
  }

  return Tag;
};