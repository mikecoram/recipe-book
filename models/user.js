(function () {'use strict';})();
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
  id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },    
    emailAddress: {
        type: DataTypes.STRING,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return User;
};