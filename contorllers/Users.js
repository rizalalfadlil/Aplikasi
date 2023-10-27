const { User } = require('../models'); // Pastikan Anda mengimpor model Users

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

module.exports = {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
};
