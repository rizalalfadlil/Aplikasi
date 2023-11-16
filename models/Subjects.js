const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');
const ExamSession = require('./ExamSessions'); // Import model ExamSession

const Subject = sequelize.define('Subject', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  questions: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  submissionDeadline: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  examSessionId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Tambahkan relasi "belongsTo" ke model ExamSession
Subject.belongsTo(ExamSession, { foreignKey: 'examSessionId' });

module.exports = Subject;
