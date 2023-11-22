'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Hapus tabel ExamResult
    await queryInterface.dropTable('ExamResults');
  },

  down: async (queryInterface, Sequelize) => {
    // Tambahkan kembali tabel ExamResult jika perlu
    await queryInterface.createTable('ExamResults', {
      // Definisi kolom-kolom tabel
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      assessmentStatus: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      assessmentTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      // ... definisi kolom lainnya ...
    });
  },
};
