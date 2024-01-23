const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const ExamSession = sequelize.define('ExamSession', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.DATE,
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
  allowedGrades: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  allowedDepartments: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = ExamSession;
