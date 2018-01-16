(function () {'use strict';})();

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    var hash = require('../lib/encryption').generatePasswordHash;
    var consts = require('../constants');

    return queryInterface.bulkInsert('Users', [{
      emailAddress: 'admin@admin.com',
      password: hash('password1'),
      status: consts.USER_STATUS.ACTIVE,
      role: consts.USER_ROLE.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */

    return queryInterface.bulkDelete('Users', [{
      emailAddress:'admin@admin.com'
    }], {});
  }
};
