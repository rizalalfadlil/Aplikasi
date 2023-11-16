const { Subject, ExamSession } = require('../models'); // Mengimpor model Subjects dan ExamSessions

// Operasi Create (C)
async function createSubject(req, res) {
  try {
    const { name, questions, submissionDeadline, startTime, examSessionId } = req.body;

    // Cari sesi ujian berdasarkan ID
    const examSession = await ExamSession.findByPk(examSessionId);
    if (!examSession) {
      return res.status(404).json({ error: 'Sesi ujian tidak ditemukan.' });
    }

    // Buat mata pelajaran dengan mengaitkannya dengan sesi ujian
    const newSubject = await Subject.create({
      name,
      questions,
      submissionDeadline,
      startTime,
      examSessionId: examSession.id // Mengaitkan mata pelajaran dengan sesi ujian
    });

    res.status(201).json(newSubject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal membuat mata pelajaran.' });
  }
}

// Operasi Read (R)
async function getSubjects(req, res) {
  try {
    const subjects = await Subject.findAll({
      include: ExamSession // Mengambil data sesi ujian terkait dengan setiap mata pelajaran
    });
    res.json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil daftar mata pelajaran.' });
  }
}
async function getSubjectById(req, res) {
  const subjectId = req.params.id;

  try {
    const subject = await Subject.findByPk(subjectId, {
      include: ExamSession // Mengambil data sesi ujian terkait dengan mata pelajaran
    });

    if (!subject) {
      return res.status(404).json({ error: 'Mata pelajaran tidak ditemukan.' });
    }

    res.json(subject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil data mata pelajaran.' });
  }
}

// Operasi Update (U)
async function updateSubject(req, res) {
  const subjectId = req.params.id;
  const { name, questions, submissionDeadline, startTime, examSessionId } = req.body;

  try {
    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res.status(404).json({ error: 'Mata pelajaran tidak ditemukan.' });
    }

    // Cari sesi ujian berdasarkan ID
    const examSession = await ExamSession.findByPk(examSessionId);
    if (!examSession) {
      return res.status(404).json({ error: 'Sesi ujian tidak ditemukan.' });
    }

    // Update mata pelajaran dengan mengaitkannya dengan sesi ujian yang baru
    subject.name = name;
    subject.questions = questions;
    subject.submissionDeadline = submissionDeadline;
    subject.startTime = startTime;
    subject.ExamSessionId = examSession.id; // Mengaitkan mata pelajaran dengan sesi ujian yang baru

    await subject.save();
    res.json(subject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal memperbarui mata pelajaran.' });
  }
}

// Operasi Delete (D)
async function deleteSubject(req, res) {
  const subjectId = req.params.id;

  try {
    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res.status(404).json({ error: 'Mata pelajaran tidak ditemukan.' });
    }

    await subject.destroy();
    res.json({ message: 'Mata pelajaran berhasil dihapus.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal menghapus mata pelajaran.' });
  }
}

module.exports = {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
};
