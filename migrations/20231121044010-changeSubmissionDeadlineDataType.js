module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Subjects', 'submissionDeadline', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Jika diperlukan, tambahkan logika untuk mengembalikan perubahan di sini
  },
};
