'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('StudentAnswers', 'nilaiUjian', {
      type: Sequelize.FLOAT, // Ubah tipe data sesuai kebutuhan (FLOAT, INTEGER, dll.)
      allowNull: true, // Sesuaikan dengan kebutuhan, apakah nilai ujian boleh null atau tidak
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('StudentAnswers', 'nilaiUjian');
  }
};
