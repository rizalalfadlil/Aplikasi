const User = require('./models/Users.js'); // Sesuaikan dengan lokasi model Anda

User.create({
    username: 'guru',
    password: 'g',
    role: 'guru',
  }).then(user => {
    console.log('Data pengguna berhasil dimasukkan:', user);
  }).catch(error => {
    console.error('Gagal memasukkan data pengguna:', error);
  });
