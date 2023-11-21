const { User } = require('../models'); // Pastikan Anda mengimpor model Users
const jwt = require('jsonwebtoken');

// Operasi Create (C)
async function createUser(req, res) {
  try {
    const { username, password, role, grade, department } = req.body;
    const newUser = await User.create({ username, password, role, grade, department });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal membuat pengguna.' });
  }
}

// Operasi Read (R)
async function getUsers(req, res) {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil daftar pengguna.' });
  }
}
// Operasi Read (R) - Mendapatkan Satu Pengguna
async function getUser(req, res) {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil pengguna.' });
  }
}

// Operasi Update (U)
async function updateUser(req, res) {
  const userId = req.params.id;
  const { username, password, role, grade, department } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
    }

    user.username = username;
    user.password = password;
    user.role = role;
    user.grade = grade;
    user.department = department;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal memperbarui pengguna.' });
  }
}

// Operasi Delete (D)
async function deleteUser(req, res) {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
    }

    await user.destroy();
    res.json({ message: 'Pengguna berhasil dihapus.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal menghapus pengguna.' });
  }
}
// Operasi Login
async function login(req, res) {
  const { username, password } = req.body;

  try {
    // Cari pengguna berdasarkan username
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ error: 'Username tidak ditemukan.' });
    }

    // Verifikasi kata sandi
    if (user.password !== password) {
      return res.status(401).json({ error: 'Kata sandi tidak sesuai.' });
    }

    // Jika autentikasi berhasil, Anda bisa menghasilkan token otentikasi
    const token = jwt.sign({ username: user.username }, 'rahasia-kunci', { expiresIn: '1h' });

    res.json({ 
      message: 'Login berhasil', 
      data:{
        id:user.id,
        username:user.username,
        role:user.role,
        grade:user.grade,
        department:user.department,

      },
      token 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal melakukan login.' });
  }
}

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  login,
};
