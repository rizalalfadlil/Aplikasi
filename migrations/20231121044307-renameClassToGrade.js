'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Users', 'class', 'grade');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Users', 'grade', 'class');
  }
};