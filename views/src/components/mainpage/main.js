import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { Pelajaran } from './ujian/pelajaran';
import Sidebar from './sidebar';
import './style.css'; // Import file CSS untuk styling
import { SesiUjian } from './ujian/sesiujian';
import { InsertSesiUjian } from './ujian/buatsesiujian';
export function MainPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [examSessions, setExamSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    // Mengambil data dari API
    fetch('http://localhost:8000/api/exam-sessions')
      .then((response) => response.json())
      .then((data) => setExamSessions(data))
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    // Mengambil data dari API
    fetch('http://localhost:8000/api/subjects')
      .then((response) => response.json())
      .then((data) => setSubjects(data))
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const fetchExamSessions = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/exam-sessions');
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

  return (
    <div className="App text-start">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} openSidebar={setIsSidebarOpen} />
      <button className="navbar-toggler m-3 text-dark" onClick={toggleSidebar}>
        ☰
      </button>
      <div className='container text-dark h-100'>
        <div className='row m-2'>
          <h1 className='text-start col-8'>Halaman Utama</h1>
          <div className='d-flex col border rounded-pill m-2 bg-light'>
            <i className='fa fa-search search-icon'/>
            <input type='text' className='bg-transparent' placeholder='Cari'/>
          </div>
        </div>
        <div className='m-2 text-start rounded-5 mt-5 row d-flex justify-content-center'>
          <h3 className='mt-5'>List Ujian</h3>
          <InsertSesiUjian/>
          
          {examSessions.map((session, index) => (
            <SesiUjian
              key={index}
              judul={session.name}
              startTime={session.startTime}
              submissionDeadline={session.submissionDeadline}
              strictMode={session.strictMode}
              id={session.id}
              fetchExamSessions={fetchExamSessions}
            >
              {Array.isArray(subjects) && subjects.map((subject, index) => (
                subject.examSessionId === session.id && (
                  <Pelajaran
                    key={index}
                    judul={subject.name}
                    startTime={subject.startTime}
                    submissionDeadline={subject.submissionDeadline}
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