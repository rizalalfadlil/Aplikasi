const { Subject, ExamSession } = require('./models');
const sequelize = require('./config/database'); // Pastikan Anda mengimpor koneksi basis data yang sesuai

// Definisikan data mata pelajaran beserta ID sesi ujian yang terkait
const subjectsData = [
  { name: 'Mata Pelajaran 234', questions: [], submissionDeadline: new Date(), startTime: new Date(), examSessionId: 22 },
  { name: 'Mata Pelajaran 2234', questions: [], submissionDeadline: new Date(), startTime: new Date(), examSessionId: 22 },
  { name: 'Mata Pelajaran 112', questions: [], submissionDeadline: new Date(), startTime: new Date(), examSessionId: 22 },
];

// Fungsi untuk mengisi data mata pelajaran
async function seedSubjects() {
  try {
    // Sinkronkan model dengan basis data
    await sequelize.sync();

    // Iterasi data mata pelajaran dan buat entri di basis data
    for (const subjectData of subjectsData) {
      // Cari sesi ujian berdasarkan ID
      const examSession = await ExamSession.findByPk(subjectData.examSessionId);
      if (!examSession) {
        console.error(`Sesi ujian dengan ID ${subjectData.examSessionId} tidak ditemukan.`);
        continue;
      }

      // Buat mata pelajaran dengan mengaitkannya dengan sesi ujian yang sesuai
      await Subject.create({ ...subjectData, ExamSessionId: examSession.id });
    }

    console.log('Data mata pelajaran berhasil diisi.');
  } catch (error) {
    console.error('Gagal mengisi data mata pelajaran:', error);
  } finally {
    // Tutup koneksi basis data setelah selesai
    await sequelize.close();
  }
}

// Panggil fungsi untuk mengisi data mata pelajaran
seedSubjects();
