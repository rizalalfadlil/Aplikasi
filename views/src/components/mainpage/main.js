import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { Pelajaran } from './ujian/pelajaran';
import Sidebar from './sidebar';
import './style.css'; // Import file CSS untuk styling
import { SesiUjian } from './ujian/sesiujian';
import { InsertSesiUjian } from './ujian/buatsesiujian';
import { ResourceLink } from '../../config';
import axios from 'axios';
export function MainPage() {
  const [examSessions, setExamSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    // Mengambil data dari API exam-sessions
    axios.get(ResourceLink + '/api/exam-sessions')
      .then((response) => setExamSessions(response.data))
      .catch((error) => {
        console.error('Error fetching exam-sessions data:', error);
      });

    // Mengambil data dari API subjects
    axios.get(ResourceLink + '/api/subjects')
      .then((response) => setSubjects(response.data))
      .catch((error) => {
        console.error('Error fetching subjects data:', error);
      });

    // Mengambil data siswa dari API users dengan role siswa
    axios.get(ResourceLink + '/api/users', { params: { role: 'siswa' } })
      .then((response) => setStudents(response.data))
      .catch((error) => {
        console.error('Error fetching students data:', error);
      });

    // Mengambil semua data user dari API
    axios.get(ResourceLink + '/api/users')
      .then((response) => {
        // Pisahkan data berdasarkan rolenya
        const allUsers = response.data;
        const teacherData = allUsers.filter(user => user.role === 'guru');
        const studentData = allUsers.filter(user => user.role === 'siswa');

        // Setel state untuk guru dan siswa
        setTeachers(teacherData);
        setStudents(studentData);
      })
      .catch((error) => {
        console.error('Error fetching users data:', error);
      });

  }, []);



  const fetchExamSessions = async () => {
    try {
      const response = await fetch( ResourceLink + '/api/exam-sessions');
      if (response.ok) {
        const data = await response.json();
        setExamSessions(data);
      } else {
        console.error('Gagal mengambil data sesi ujian');
      }
    } catch (error) {
      console.error('Gagal mengambil data sesi ujian:', error);
    }
  };
  const fetchSubjects = async () => {
    try {
      const response = await fetch(ResourceLink + '/api/subjects');
      if (response.ok) {
        const data = await response.json();
        setSubjects(data);
      } else {
        console.error('Gagal mengambil data pelajaran');
      }
    } catch (error) {
      console.error('Gagal mengambil data pelajaran:', error);
    }
  };
const testUser = () =>{
  console.log(JSON.parse(localStorage.getItem('user')))
}
  return (
    <div className="App text-start d-flex">
      <Sidebar/>
      <div className='container text-dark h-100'>
        <div className='m-2 mt-5'>
          <h1 className='text-start'>Halaman Ujian</h1>
          <div className='row mt-5'>
            <ItemBox title='jumlah ujian' value={examSessions.length}/>
            <ItemBox title='jumlah pelajaran' value={subjects.length}/>
            <ItemBox title='jumlah siswa' value={students.length}/>
            <ItemBox title='jumlah guru' value={teachers.length}/>
          </div>
        </div>
        <div className='m-2 text-start rounded-5 row d-flex justify-content-center'>
          <h3 className='mt-5'>List Ujian</h3>
          <InsertSesiUjian fetchExamSessions={fetchExamSessions}/>
          
          {examSessions.map((session, index) => (
            <SesiUjian
              key={index}
              judul={session.name}
              startTime={session.startTime}
              submissionDeadline={session.submissionDeadline}
              strictMode={session.strictMode}
              id={session.id}
              allowedGrades={session.allowedGrades}
              allowedDepartments={session.allowedDepartments}
              fetchExamSessions={fetchExamSessions}
            >
              {Array.isArray(subjects) && subjects.map((subject, index) => (
                subject.examSessionId === session.id && (
                  <Pelajaran
                    key={index}
                    id={subject.id}
                    idUjian={session.id}
                    judulUjian={session.name}
                    judul={subject.name}
                    startTime={subject.startTime}
                    submissionDeadline={subject.submissionDeadline}
                    jumlahSoal = {JSON.parse(subject.questions).length}
                    fetchSubjects={fetchSubjects}
                  />
                )
              ))}
            </SesiUjian>
          ))}

        </div>
      </div>
    </div>
  );
}
const ItemBox = (props) => {
  return (
    <div className='border p-4 ps-1 fs-5 m-2 rounded-3 shadow-sm bg-light col'>
      <span className='border border-3 border-primary border-opacity-25 m-3 py-2 px-3 rounded-circle'>{props.value? props.value : '?'}</span>
      <span className='text-nowrap'>{props.title}</span>
    </div>
  )
}
