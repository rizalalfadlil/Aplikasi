const { StudentAnswer } = require('../models');

// Operasi Create (C)
async function createStudentAnswer(req, res) {
  try {
    const { answer, username, userId, pelajaran, pelajaranId, nilaiUjian } = req.body;
    const newStudentAnswer = await StudentAnswer.create({
      answer,
      username,
      userId,
      pelajaran,
      pelajaranId,
      nilaiUjian,
    });
    res.status(201).json(newStudentAnswer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal menyimpan jawaban siswa.' });
  }
}

// Operasi Read (R)
async function getStudentAnswers(req, res) {
  try {
    const studentAnswers = await StudentAnswer.findAll();
    res.json(studentAnswers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil daftar jawaban siswa.' });
  }
}

// Operasi Read (R) - Mengambil satu data
async function getStudentAnswer(req, res) {
  const answerId = req.params.id;

  try {
    const studentAnswer = await StudentAnswer.findByPk(answerId);
    if (!studentAnswer) {
      return res.status(404).json({ error: 'Jawaban siswa tidak ditemukan.' });
    }

    res.json(studentAnswer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil jawaban siswa.' });
  }
}

// Operasi Update (U) - Opsional
async function updateStudentAnswer(req, res) {
  const answerId = req.params.id;

  try {
    const studentAnswer = await StudentAnswer.findByPk(answerId);
    if (!studentAnswer) {
      return res.status(404).json({ error: 'Jawaban siswa tidak ditemukan.' });
    }

    const { answer, username, userId, pelajaran, pelajaranId, nilaiUjian } = req.body;

    studentAnswer.answer = answer;
    studentAnswer.username = username;
    studentAnswer.userId = userId;
    studentAnswer.pelajaran = pelajaran;
    studentAnswer.pelajaranId = pelajaranId;
    studentAnswer.nilaiUjian = nilaiUjian;

    await studentAnswer.save();
    res.json(studentAnswer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal memperbarui jawaban siswa.' });
  }
}

// Operasi Delete (D)
async function deleteStudentAnswer(req, res) {
  const answerId = req.params.id;

  try {
    const studentAnswer = await StudentAnswer.findByPk(answerId);
    if (!studentAnswer) {
      return res.status(404).json({ error: 'Jawaban siswa tidak ditemukan.' });
    }

    await studentAnswer.destroy();
    res.json({ message: 'Jawaban siswa berhasil dihapus.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal menghapus jawaban siswa.' });
  }
}

module.exports = {
  createStudentAnswer,
  getStudentAnswers,
  getStudentAnswer,
  updateStudentAnswer,
  deleteStudentAnswer,
};
