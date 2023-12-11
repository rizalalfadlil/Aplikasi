const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const fsp = require('fs/promises');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const port = 8000; // Port yang akan digunakan
const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');
app.use(cors());
app.use(express.json());
// Middleware, seperti body parser, cors, dan middleware otentikasi, bisa ditambahkan di sini

// Hubungkan rute-rute dengan aplikasi Express
const routes = require('./routes'); // Sesuaikan dengan letak rute Anda
app.use('/', routes);
// Endpoint untuk menghapus folder berdasarkan nomor soal
app.delete('/delete-folder/:idSoal/:noSoal', async (req, res) => {
  try {
    const { idSoal, noSoal } = req.params;
    const folderPath = `server/uploads/${idSoal}/${noSoal}`;

    // Periksa apakah folder ada sebelum dihapus
    if (await fse.pathExists(folderPath)) {
      // Hapus folder
      await fse.remove(folderPath);

      // Perbarui folder di atasnya
      const noSoalInt = parseInt(noSoal, 10);
      for (let i = noSoalInt + 1; ; i++) {
        const currentFolderPath = `server/uploads/${idSoal}/${i}`;
        const nextFolderPath = `server/uploads/${idSoal}/${i - 1}`;

        // Periksa apakah folder ada sebelum diubah
        if (await fse.pathExists(currentFolderPath)) {
          // Ubah nama folder
          await fse.move(currentFolderPath, nextFolderPath);
        } else {
          // Jika tidak ada folder lagi, hentikan loop
          break;
        }
      }

      res.status(200).json({ success: true, message: 'Folder deleted successfully.' });
    } else {
      res.status(404).json({ success: false, message: 'Folder not found, target folder : ' + folderPath });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});
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

// Endpoint untuk upload file
app.post('/upload', upload.single('file'), (req, res) => {
  res.send('File berhasil diupload');
});

const folderPath = path.join(__dirname, 'uploads'); // Sesuaikan dengan nama folder Anda
// Server-side endpoint
app.get('/getFiles/:idPelajaran/:noSoal/:filename', (req, res) => {
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

app.delete('/deleteFile/:idPelajaran/:noSoal/:fileName', async (req, res) => {
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
app.get('/download', (req, res) => {
  const filePath = req.query.filePath;

  if (!filePath) {
    return res.status(400).send('Parameter filePath tidak ditemukan');
  }

  res.sendFile(path.join(__dirname, filePath));
});

sequelize.sync()
  .then(() => {
    console.log('Model-model berhasil disinkronkan dengan basis data.');
  })
  .catch((error) => {
    console.error('Gagal menyinkronkan model dengan basis data:', error);
  });

// Inisialisasi server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
