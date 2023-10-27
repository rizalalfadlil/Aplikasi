const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Sesuaikan dengan konfigurasi Anda

const ExamSession = sequelize.define('ExamSession', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  shuffleQuestions: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  strictMode: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  submissionDeadline: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  choiceCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = ExamSession;
