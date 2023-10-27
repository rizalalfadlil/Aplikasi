const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Sesuaikan dengan konfigurasi Anda

const StudentAnswer = sequelize.define('StudentAnswer', {
  answer: {
    type: DataTypes.JSON, // Jawaban siswa dalam bentuk JSON
    allowNull: false,
  },
});

module.exports = StudentAnswer;
