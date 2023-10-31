const sequelize = require('./config/database'); // Sesuaikan dengan konfigurasi Anda
const ExamSession = require('./models/ExamSessions'); // Sesuaikan dengan path yang benar

(async () => {
  try {
    await sequelize.sync(); // Sinkronisasi model dengan tabel di database

    // Menambahkan data ke model ExamSession
    const examSessionData = [
      {
        name: 'Ujian Akhir Semester',
        startTime: new Date('2023-11-01T08:00:00'), // Sesuaikan dengan waktu yang diinginkan
        shuffleQuestions: true,
        strictMode: true,
        submissionDeadline: new Date('2023-11-01T10:00:00'), // Sesuaikan dengan waktu yang diinginkan
      },
      {
        name: 'Ujian Tes 2',
        startTime: new Date('2023-11-02T09:00:00'), // Sesuaikan dengan waktu yang diinginkan
        shuffleQuestions: false,
        strictMode: false,
        submissionDeadline: new Date('2023-11-05T11:00:00'), // Sesuaikan dengan waktu yang diinginkan
      },
      // Tambahkan data lain sesuai kebutuhan
    ];

    const createdExams = await ExamSession.bulkCreate(examSessionData);

    console.log('Data ExamSession berhasil ditambahkan:', createdExams);
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
  } finally {
    sequelize.close(); // Tutup koneksi database setelah selesai
  }
})();
