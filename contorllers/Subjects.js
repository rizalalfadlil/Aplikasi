const { Subject, ExamSession } = require('../models'); // Mengimpor model Subjects dan ExamSessions
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Fungsi untuk mengunduh satu pelajaran beserta gambar dan json
async function downloadSubjectWithImagesAndJson(req, res) {
  const subjectId = req.params.id;

  try {
    const subject = await Subject.findByPk(subjectId, {
      include: ExamSession,
    });

    if (!subject) {
      return res.status(404).json({ error: 'Mata pelajaran tidak ditemukan.' });
    }

    // Menentukan nama file zip
    const zipFileName = `pelajaran_${subject.id}.zip`;

    // Menentukan respons sebagai file zip
    res.attachment(zipFileName);

    // Membuat objek archiver
    const zip = archiver('zip', {
      zlib: { level: 9 }, // Compression level
    });

    // Mengaitkan respons dengan objek archiver
    zip.pipe(res);

    // Menambahkan folder dengan isinya ke dalam zip
    const imageFolderPath = path.join(__dirname, '../server', 'uploads', `${subject.examSessionId}`);
    zip.directory(imageFolderPath, 'images');

    // Menambahkan file JSON ke dalam zip
    const jsonFileName = `question.json`;
    const jsonFilePath = path.join(__dirname, '../temp', jsonFileName);

    // Menyusun data yang akan diunduh
    const dataToDownload = {
      id: subject.id,
      name: subject.name,
      questions: subject.questions,
      submissionDeadline: subject.submissionDeadline,
      startTime: subject.startTime,
      examSession: subject.ExamSession,
    };

    // Menyimpan data sebagai file JSON sementara
    fs.writeFileSync(jsonFilePath, JSON.stringify(dataToDownload, null, 2));

    // Menambahkan file JSON ke dalam zip
    zip.file(jsonFilePath, { name: jsonFileName });

    // Finalisasi zip dan kirim respons
    zip.finalize();

    // Tambahkan event listener untuk menangkap saat zip telah selesai
    zip.on('end', () => {
      // Setelah unduhan selesai, hapus file sementara
      fs.unlinkSync(jsonFilePath);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengunduh mata pelajaran dengan gambar dan file JSON.' });
  }
}


// Fungsi untuk mengunduh satu pelajaran berdasarkan ID
async function downloadSubject(req, res) {
  const subjectId = req.params.id;

  try {
    const subject = await Subject.findByPk(subjectId, {
      include: ExamSession,
    });

    if (!subject) {
      return res.status(404).json({ error: 'Mata pelajaran tidak ditemukan.' });
    }

    // Menentukan nama file yang akan diunduh
    const fileName = `subject_${subject.id}_${subject.name}.json`;

    // Menyusun data yang akan diunduh
    const dataToDownload = {
      id: subject.id,
      name: subject.name,
      questions: subject.questions,
      submissionDeadline: subject.submissionDeadline,
      startTime: subject.startTime,
      examSession: subject.ExamSession,
    };

    // Menentukan path untuk menyimpan file sementara
    const filePath = path.join(__dirname, '../temp', fileName);

    // Menyimpan data sebagai file JSON sementara
    fs.writeFileSync(filePath, JSON.stringify(dataToDownload, null, 2));

    // Mengirim file sebagai respons
    res.download(filePath, fileName, () => {
      // Setelah unduhan selesai, hapus file sementara
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengunduh mata pelajaran.' });
  }
}

async function downloadSubjectWithImages(req, res) {
  const subjectId = req.params.id;

  try {
    const subject = await Subject.findByPk(subjectId, {
      include: ExamSession,
    });

    if (!subject) {
      return res.status(404).json({ error: 'Mata pelajaran tidak ditemukan.' });
    }

    // Menentukan nama file zip
    const zipFileName = `subject_${subject.id}_${subject.name}.zip`;

    // Menentukan respons sebagai file zip
    res.attachment(zipFileName);

    // Membuat objek archiver
    const zip = archiver('zip', {
      zlib: { level: 9 }, // Compression level
    });

    // Mengaitkan respons dengan objek archiver
    zip.pipe(res);

    // Menambahkan folder dengan isinya ke dalam zip
    const imageFolderPath = path.join(__dirname, '../server','uploads', `${subject.examSessionId}`);
    zip.directory(imageFolderPath, 'images');

    // Menambahkan file JSON ke dalam zip
    const jsonFilePath = path.join(__dirname, '/file.json'); // Sesuaikan dengan path file JSON Anda
    zip.file(jsonFilePath, { name: 'question.json' });

    // Finalisasi zip dan kirim respons
    zip.finalize();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengunduh mata pelajaran dengan gambar.' });
  }
}
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
  downloadSubject,
  downloadSubjectWithImages,
  downloadSubjectWithImagesAndJson
};
