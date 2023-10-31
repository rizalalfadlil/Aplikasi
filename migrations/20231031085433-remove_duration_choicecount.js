'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ExamSessions', 'duration');
    await queryInterface.removeColumn('ExamSessions', 'choiceCount');
  },

  down: async (queryInterface, Sequelize) => {
    // Jika Anda perlu melakukan rollback, Anda dapat menambahkan kembali kolom di sini
    await queryInterface.addColumn('ExamSessions', 'duration', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.addColumn('ExamSessions', 'choiceCount', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  }
};
