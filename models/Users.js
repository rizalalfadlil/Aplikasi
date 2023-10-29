const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Sesuaikan dengan konfigurasi Anda

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  class: {
    type: DataTypes.STRING, // Kelas Siswa (Opsional)
  },
  department: {
    type: DataTypes.STRING, // Jurusan Siswa (Opsional)
  },
});

module.exports = User;