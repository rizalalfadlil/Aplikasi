'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Subjects', 'examSessionId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'ExamSessions', // Nama tabel yang direferensikan
        key: 'id', // Kolom yang direferensikan
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Subjects', 'examSessionId');
  }
};
