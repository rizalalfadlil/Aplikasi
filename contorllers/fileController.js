const multer = require('multer');
const fsp = require('fs/promises');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const idPelajaran = req.body.idPelajaran || 'default';
    const noSoal = req.body.noSoal || 'default';
    const uploadPath = path.join(__dirname, 'uploads', idPelajaran, noSoal);

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

const deleteFolder = async (idSoal, noSoal) => {
  try {
    const folderPath = `controllers/uploads/${idSoal}/${noSoal}`;

    if (await fse.pathExists(folderPath)) {
      await fse.remove(folderPath);

      const noSoalInt = parseInt(noSoal, 10);
      for (let i = noSoalInt + 1; ; i++) {
        const currentFolderPath = `controllers/uploads/${idSoal}/${i}`;
        const nextFolderPath = `controllers/uploads/${idSoal}/${i - 1}`;

        if (await fse.pathExists(currentFolderPath)) {
          await fse.move(currentFolderPath, nextFolderPath);
        } else {
          break;
        }
      }

      return { success: true, message: 'Folder deleted successfully.' };
    } else {
      return { success: false, message: 'Folder not found, target folder: ' + folderPath };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Internal server error.' };
  }
};

const uploadFile = (req, res) => {
  res.send('File berhasil diupload');
};

const getFiles = (req, res) => {
  const { idPelajaran, noSoal, filename } = req.params;
  const filePath = path.join(__dirname, 'uploads', idPelajaran, `${noSoal}`, `${filename}`);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('File not found');
  }
};

const deleteFile = async (idPelajaran, noSoal, fileName) => {
  try {
    const filePath = path.join(__dirname, 'uploads', idPelajaran, `${noSoal}`, fileName);
    await fsp.unlink(filePath);
    return { success: true, message: 'File deleted successfully' };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { success: false, message: 'Internal Server Error' };
  }
};

const downloadFile = (req, res) => {
  const filePath = req.query.filePath;

  if (!filePath) {
    res.status(400).send('Parameter filePath tidak ditemukan');
  }

  res.sendFile(path.join(__dirname, filePath));
};

module.exports = {
  upload,
  deleteFolder,
  uploadFile,
  getFiles,
  deleteFile,
  downloadFile,
};
