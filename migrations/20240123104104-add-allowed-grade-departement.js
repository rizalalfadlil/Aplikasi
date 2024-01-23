'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ExamSessions', 'allowedGrades', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('ExamSessions', 'allowedDepartments', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ExamSessions', 'allowedGrades');
    await queryInterface.removeColumn('ExamSessions', 'allowedDepartments');
  },
};
