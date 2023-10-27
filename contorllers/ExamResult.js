const { ExamResult } = require('../models'); // Pastikan Anda mengimpor model ExamResults

// Operasi Create (C)
async function createExamResult(req, res) {
  try {
    const { score, assessmentStatus, assessmentTime } = req.body;
    const newExamResult = await ExamResult.create({ score, assessmentStatus, assessmentTime });
    res.status(201).json(newExamResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal menyimpan hasil ujian.' });
  }
}

// Operasi Read (R)
async function getExamResults(req, res) {
  try {
    const examResults = await ExamResult.findAll();
    res.json(examResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil daftar hasil ujian.' });
  }
}

// Operasi Update (U)
async function updateExamResult(req, res) {
  const resultId = req.params.id;
  const { score, assessmentStatus, assessmentTime } = req.body;

  try {
    const examResult = await ExamResult.findByPk(resultId);
    if (!examResult) {
      return res.status(404).json({ error: 'Hasil ujian tidak ditemukan.' });
    }

    examResult.score = score;
    examResult.assessmentStatus = assessmentStatus;
    examResult.assessmentTime = assessmentTime;

    await examResult.save();
    res.json(examResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal memperbarui hasil ujian.' });
  }
}

// Operasi Delete (D) - Opsional
// Biasanya, hasil ujian tidak dihapus, jadi operasi delete mungkin opsional.

module.exports = {
  createExamResult,
  getExamResults,
  updateExamResult,
};
