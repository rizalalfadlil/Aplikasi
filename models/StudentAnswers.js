const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StudentAnswer = sequelize.define('StudentAnswer', {
  answer: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  pelajaran: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pelajaranId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nilaiUjian: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
});

module.exports = StudentAnswer;
