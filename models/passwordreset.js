'use strict';
module.exports = function(sequelize, DataTypes) {
  var PasswordReset = sequelize.define('PasswordReset', {
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    token: DataTypes.STRING,
    expiry: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  var User = require('./user')(sequelize, DataTypes);
  PasswordReset.hasOne(User, {foreignKey: 'userId', targetKey: 'id'});

  return PasswordReset;
};