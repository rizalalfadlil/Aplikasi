const express = require('express');
const router = express.Router();

// Impor kontroler yang telah dibuat sebelumnya
const userController = require('../contorllers/Users');
const examSessionController = require('../contorllers/ExamSession');
const subjectController = require('../contorllers/Subjects');
const studentAnswerController = require('../contorllers/StundentAnswer');
const examResultController = require('../contorllers/ExamResult');

// Rute untuk pengguna (Users)
router.post('/api/users', userController.createUser);
router.get('/api/users', userController.getUsers);
router.put('/api/users/:id', userController.updateUser);
router.delete('/api/users/:id', userController.deleteUser);
router.post('/api/login', userController.login);

// Rute untuk sesi ujian (ExamSessions)
router.post('/api/exam-sessions', examSessionController.createExamSession);
router.get('/api/exam-sessions', examSessionController.getExamSessions);
router.put('/api/exam-sessions/:id', examSessionController.updateExamSession);
router.delete('/api/exam-sessions/:id', examSessionController.deleteExamSession);

// Rute untuk mata pelajaran (Subjects)
router.post('/api/subjects', subjectController.createSubject);
router.get('/api/subjects', subjectController.getSubjects);
router.put('/api/subjects/:id', subjectController.updateSubject);
router.delete('/api/subjects/:id', subjectController.deleteSubject);

// Rute untuk jawaban siswa (StudentAnswers)
router.post('/api/student-answers', studentAnswerController.createStudentAnswer);
router.get('/api/student-answers', studentAnswerController.getStudentAnswers);
router.delete('/api/student-answers/:id', studentAnswerController.deleteStudentAnswer);

// Rute untuk hasil ujian (ExamResults)
router.post('/api/exam-results', examResultController.createExamResult);
router.get('/api/exam-results', examResultController.getExamResults);
router.put('/api/exam-results/:id', examResultController.updateExamResult);

module.exports = router;
