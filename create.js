const User = require('./models/Users.js'); // Sesuaikan dengan lokasi model Anda

User.create({
    username: 'admin',
    password: 'a',
    role: 'admin',
  }).then(user => {
    console.log('Data pengguna berhasil dimasukkan:', user);
  }).catch(error => {
    console.error('Gagal memasukkan data pengguna:', error);
  });
