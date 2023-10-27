const { StudentAnswer } = require('../models'); // Pastikan Anda mengimpor model StudentAnswers

// Operasi Create (C)
async function createStudentAnswer(req, res) {
  try {
    const { answer } = req.body;
    const newStudentAnswer = await StudentAnswer.create({ answer });
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

// Operasi Update (U) - Opsional
// Jika Anda ingin mendukung perubahan jawaban siswa, Anda dapat menambahkan operasi update yang sesuai.

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
  deleteStudentAnswer,
};
