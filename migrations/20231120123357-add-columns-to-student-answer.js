'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('StudentAnswers', 'username', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('StudentAnswers', 'userId', {
      type: Sequelize.INTEGER, // Ubah tipe data sesuai dengan tipe data id di tabel User
      allowNull: false,
    });

    await queryInterface.addColumn('StudentAnswers', 'pelajaran', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('StudentAnswers', 'pelajaranId', {
      type: Sequelize.INTEGER, // Ubah tipe data sesuai dengan tipe data id di tabel Pelajaran
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('StudentAnswers', 'username');
    await queryInterface.removeColumn('StudentAnswers', 'userId');
    await queryInterface.removeColumn('StudentAnswers', 'pelajaran');
    await queryInterface.removeColumn('StudentAnswers', 'pelajaranId');
  }
};
