const express = require('express');
const app = express();
const cors = require('cors');
const port = 8000; // Port yang akan digunakan
const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');
app.use(cors());
app.use(express.json());
// Middleware, seperti body parser, cors, dan middleware otentikasi, bisa ditambahkan di sini

// Hubungkan rute-rute dengan aplikasi Express
const routes = require('./routes'); // Sesuaikan dengan letak rute Anda
app.use('/', routes);

sequelize.sync()
  .then(() => {
    console.log('Model-model berhasil disinkronkan dengan basis data.');
  })
  .catch((error) => {
    console.error('Gagal menyinkronkan model dengan basis data:', error);
  });

// Inisialisasi server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
