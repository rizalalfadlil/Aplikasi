const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Sesuaikan dengan konfigurasi Anda

const ExamResult = sequelize.define('ExamResult', {
  score: {
    type: DataTypes.INTEGER,
  },
  assessmentStatus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  assessmentTime: {
    type: DataTypes.DATE,
  },
});

module.exports = ExamResult;
