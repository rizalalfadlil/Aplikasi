const { Subject } = require('../models'); // Pastikan Anda mengimpor model Subjects

// Operasi Create (C)
async function createSubject(req, res) {
  try {
    const { name, questions, submissionDeadline, startTime } = req.body;
    const newSubject = await Subject.create({ name, questions, submissionDeadline, startTime });
    res.status(201).json(newSubject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal membuat mata pelajaran.' });
  }
}

// Operasi Read (R)
async function getSubjects(req, res) {
  try {
    const subjects = await Subject.findAll();
    res.json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil daftar mata pelajaran.' });
  }
}

// Operasi Update (U)
async function updateSubject(req, res) {
  const subjectId = req.params.id;
  const { name, questions, submissionDeadline, startTime } = req.body;

  try {
    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res.status(404).json({ error: 'Mata pelajaran tidak ditemukan.' });
    }

    subject.name = name;
    subject.questions = questions;
    subject.submissionDeadline = submissionDeadline;
    subject.startTime = startTime;

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
  updateSubject,
  deleteSubject,
};
