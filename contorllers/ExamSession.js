const { ExamSession } = require('../models'); // Pastikan Anda mengimpor model ExamSessions

// Operasi Create (C)
async function createExamSession(req, res) {
  try {
    const { name, startTime,  shuffleQuestions, strictMode, submissionDeadline, } = req.body;
    const newSession = await ExamSession.create({ name, startTime,  shuffleQuestions, strictMode, submissionDeadline, });
    res.status(201).json(newSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal membuat sesi ujian.' });
  }
}

// Operasi Read (R)
async function getExamSessions(req, res) {
  try {
    const sessions = await ExamSession.findAll();
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil daftar sesi ujian.' });
  }
}

// Operasi Update (U)
async function updateExamSession(req, res) {
  const sessionId = req.params.id;
  const { name, startTime, shuffleQuestions, strictMode, submissionDeadline, } = req.body;

  try {
    const session = await ExamSession.findByPk(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Sesi ujian tidak ditemukan.' });
    }

    session.name = name;
    session.startTime = startTime;
    session.shuffleQuestions = shuffleQuestions;
    session.strictMode = strictMode;
    session.submissionDeadline = submissionDeadline;

    await session.save();
    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal memperbarui sesi ujian.' });
  }
}

// Operasi Delete (D)
async function deleteExamSession(req, res) {
  const sessionId = req.params.id;

  try {
    const session = await ExamSession.findByPk(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Sesi ujian tidak ditemukan.' });
    }

    await session.destroy();
    res.json({ message: 'Sesi ujian berhasil dihapus.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal menghapus sesi ujian.' });
  }
}

module.exports = {
  createExamSession,
  getExamSessions,
  updateExamSession,
  deleteExamSession,
};
