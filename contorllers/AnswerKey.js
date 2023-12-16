const { AnswerKey } = require('../models');

// Operasi Create (C)
async function createAnswerKey(req, res) {
  try {
    const { answer, pelajaranId } = req.body;
    const newAnswerKey = await AnswerKey.create({ answer, pelajaranId });
    res.status(201).json(newAnswerKey);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal menyimpan kunci jawaban.' });
  }
}

// Operasi Read (R - Cari Satu)
async function getAnswerKey(req, res) {
  const answerKeyId = req.params.id;

  try {
    const answerKey = await AnswerKey.findByPk(answerKeyId);
    if (!answerKey) {
      return res.status(404).json({ error: 'Kunci jawaban tidak ditemukan.' });
    }

    res.json(answerKey);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil kunci jawaban.' });
  }
}

// Operasi Update (U)
async function updateAnswerKey(req, res) {
  const answerKeyId = req.params.id;
  const { answer, pelajaranId } = req.body;

  try {
    const answerKey = await AnswerKey.findByPk(answerKeyId);
    if (!answerKey) {
      return res.status(404).json({ error: 'Kunci jawaban tidak ditemukan.' });
    }

    // Update fields yang diperlukan
    answerKey.answer = answer;
    answerKey.pelajaranId = pelajaranId;

    await answerKey.save();
    res.json(answerKey);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal memperbarui kunci jawaban.' });
  }
}

module.exports = {
  createAnswerKey,
  getAnswerKey,
  updateAnswerKey,
};
