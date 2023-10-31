const User = require('./models/Users.js'); // Sesuaikan dengan lokasi model Anda

User.create({
    username: 'username',
    password: 'password',
    role: 'Siswa',
    class: 'Kelas X',
    department: 'Jurusan IPA',
  }).then(user => {
    console.log('Data pengguna berhasil dimasukkan:', user);
  }).catch(error => {
    console.error('Gagal memasukkan data pengguna:', error);
  });
