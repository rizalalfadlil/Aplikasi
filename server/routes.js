const express = require('express');
const router = express.Router();
const multer = require('multer');
const fsp = require('fs/promises');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const archiver = require('archiver');
const AdmZip = require('adm-zip');
// Impor kontroler yang telah dibuat sebelumnya
const userController = require('../contorllers/Users');
const AnswerKeyController = require('../contorllers/AnswerKey');
const fileController = require('../contorllers/fileController');
const examSessionController = require('../contorllers/ExamSession');
const subjectController = require('../contorllers/Subjects');
const studentAnswerController = require('../contorllers/StundentAnswer');
const contohSoal = require('../contoh-soal'); //berisi const soal=(isi soal berbentuk json)

// Rute untuk pengguna (Users)
router.post('/api/users', userController.createUser);
router.get('/api/users', userController.getUsers);
router.get('/api/users/:id', userController.getUser);
router.put('/api/users/:id', userController.updateUser);
router.delete('/api/users/:id', userController.deleteUser);
router.post('/api/login', userController.login);

// Rute untuk sesi ujian (ExamSessions)
router.post('/api/exam-sessions', examSessionController.createExamSession);
router.get('/api/exam-sessions', examSessionController.getExamSessions);
router.put('/api/exam-sessions/:id', examSessionController.updateExamSession);
router.delete('/api/exam-sessions/:id', examSessionController.deleteExamSession);

router.post('/api/answer-key', AnswerKeyController.createAnswerKey);
router.get('/api/answer-key/:id', AnswerKeyController.getAnswerKey);
router.put('/api/answer-key/:id', AnswerKeyController.updateAnswerKey);

// Rute untuk mata pelajaran (Subjects)
router.post('/api/subjects', subjectController.createSubject);
router.get('/api/download-subjects/:id', subjectController.downloadSubjectWithImagesAndJson);
router.get('/api/subjects', subjectController.getSubjects);
router.get('/api/subjects/:id', subjectController.getSubjectById);
router.put('/api/subjects/:id', subjectController.updateSubject);
router.delete('/api/subjects/:id', subjectController.deleteSubject);

// Rute untuk jawaban siswa (StudentAnswers)
router.post('/api/student-answers', studentAnswerController.createStudentAnswer);
router.get('/api/student-answers', studentAnswerController.getStudentAnswers);
router.get('/api/student-answers/:id', studentAnswerController.getStudentAnswer);
router.put('/api/student-answers/:id', studentAnswerController.updateStudentAnswer);
router.delete('/api/student-answers/:id', studentAnswerController.deleteStudentAnswer);

router.get('/api/contoh-soal', (req, res) => {
    res.json(contohSoal);
  });


  router.delete('/delete-folder/:idSoal/:noSoal', fileController.deleteFolder);
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Dapatkan idPelajaran dari request atau dari sesi pengguna (Anda harus menyesuaikan ini)
      const idPelajaran = req.body.idPelajaran || 'default';
      const noSoal = req.body.noSoal || 'default';
  
      const uploadPath = path.join(__dirname, 'uploads', idPelajaran, noSoal);
  
      // Buat folder jika belum ada
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
  
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, req.body.filename + '.png');
    },
  });
  
  const upload = multer({ storage });
  const storages = multer.memoryStorage();
  const uploads = multer({ storage: storages });
  // Endpoint untuk mengunggah file zip
router.post('/upload-zip/:id', uploads.single('zipFile'), async (req, res) => {
  const id = req.params.id;
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'File zip tidak ditemukan.' });
    }

    // Membaca konten file zip yang diunggah
    const zipBuffer = req.file.buffer;

    // Menentukan folder tempat menyimpan file zip sementara
    const tempZipPath = path.join(__dirname, '../temp', 'tempZip.zip');

    // Menyimpan konten zip ke file sementara
    fs.writeFileSync(tempZipPath, zipBuffer);

    // Menentukan folder untuk mengekstrak zip
    const extractFolderPath = path.join(__dirname, '/uploads');

    // Membaca file zip dan mengekstraknya ke dalam folder uploads
    await extractZip(tempZipPath, extractFolderPath, id);

    // Hapus file zip sementara
    fs.unlinkSync(tempZipPath);

    res.status(200).json({ success: true, message: 'File zip berhasil diunggah dan diekstrak.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengunggah dan mengekstrak file zip.' });
  }
});

async function extractZip(zipPath, extractPath, idPelajaran) {
  return new Promise((resolve, reject) => {
    const zip = new AdmZip(zipPath);

    try {
      zip.extractAllTo(extractPath, true);

      // Hapus file question.json
      const questionJsonPath = `${extractPath}/question.json`;
      if (fs.existsSync(questionJsonPath)) {
        fs.unlinkSync(questionJsonPath);
        console.log('File question.json dihapus.');
      }

      // Ubah nama folder images
      const imagesFolderPath = `${extractPath}/images`;
      if (fs.existsSync(imagesFolderPath)) {
        const newImagesFolderPath = `${extractPath}/${idPelajaran}`;

        // Hapus folder lama jika sudah ada yang memiliki nama yang sama
        if (fs.existsSync(newImagesFolderPath)) {
          fs.rmdirSync(newImagesFolderPath, { recursive: true });
          console.log('Folder lama dihapus.');
        }

        fs.renameSync(imagesFolderPath, newImagesFolderPath);
        console.log('Folder images diubah menjadi new_images_folder.');
      }

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
  // Endpoint untuk upload file
  router.post('/upload', upload.single('file'), (req, res) => {
    res.send('File berhasil diupload');
  });
  
  const folderPath = path.join(__dirname, 'uploads'); // Sesuaikan dengan nama folder Anda
  // Server-side endpoint
  router.get('/getFiles/:idPelajaran/:noSoal/:filename', (req, res) => {
    const { idPelajaran, noSoal, filename } = req.params;
    const filePath = path.join(__dirname, 'uploads', idPelajaran, `${noSoal}`, `${filename}`);
  
    // Periksa apakah file ada
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      // Handle jika file tidak ditemukan
      res.status(404).send('File not found');
    }
  });
  
  router.delete('/deleteFile/:idPelajaran/:noSoal/:fileName', async (req, res) => {
    const { idPelajaran, noSoal, fileName } = req.params;
    const filePath = path.join(__dirname, 'uploads', idPelajaran, `${noSoal}`, fileName);
  
    try {
      // Gunakan fs.unlink untuk menghapus file
      await fsp.unlink(filePath);
      res.status(200).send('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // Endpoint untuk mendapatkan file dari folder tertentu
  router.get('/download', (req, res) => {
    const filePath = req.query.filePath;
  
    if (!filePath) {
      return res.status(400).send('Parameter filePath tidak ditemukan');
    }
  
    res.sendFile(path.join(__dirname, filePath));
  });
  
module.exports = router;
