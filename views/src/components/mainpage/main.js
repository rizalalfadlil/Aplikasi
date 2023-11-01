import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import Sidebar from './sidebar';
import './style.css'; // Import file CSS untuk styling
import { SesiUjian } from './ujian/sesiujian';
import { InsertSesiUjian } from './ujian/buatsesiujian';
export function MainPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [examSessions, setExamSessions] = useState([]);

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
              submissionDeadline={session.deadline}
              strictMode={session.strictMode}
              id={session.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}