const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AnswerKey = sequelize.define('AnswerKey', {
  answer: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  pelajaranId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = AnswerKey;
