import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import Sidebar from './sidebar';
import './style.css'; // Import file CSS untuk styling

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
      .then((data) => {
        const formattedData = data.map((session) => {
          // Mengubah format tanggal dari ISO string ke format 'dd-mm-yyyy'
          const startTime = new Date(session.startTime).toLocaleDateString('en-GB');
          const deadline = new Date(session.submissionDeadline).toLocaleDateString('en-GB');
  
          return {
            ...session,
            startTime,
            deadline,
          };
        });
  
        setExamSessions(formattedData);
      })
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
          {examSessions.map((session, index) => (
            <SesiUjian
              key={index}
              judul={session.name}
              startTime={session.startTime}
              deadline={session.deadline}
              strictMode={session.strictMode}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
function SesiUjian(props){
  const [isEdited, setIsEdited] =useState(false);
  const toggleEdit = () =>{
    setIsEdited(!isEdited)
  }
  return(
<div className={`rounded-5 border m-3 col-12 col-sm${isEdited?'-12 ':'-12'} p-4 bg-light animated text-dark row`}>
          <ul type='none' className='col-8'>
            <li><h5>{isEdited?(<input className='bg-light w-100 p-2 border-bottom' placeholder={props.judul}/>):(<b>{props.judul}</b>)}</h5></li>
            <li>50 soal</li>
            {props.strictMode?(<li className='badge rounded-pill text-bg-danger'>strict mode</li>):(<li className='badge rounded-pill text-bg-success'>normal mode</li>)}
            {isEdited?(<li className='row d-flex w-25'><input type='text'placeholder='mulai' className='mt-2 col border-bottom w-10'/> - <input type='text'placeholder='deadline' className='mt-2 col border-bottom w-10'/></li>)
            :
            (<li className='text-nowrap'><span className='badge rounded-pill text-light mt-2 gradient1'>{props.startTime}</span> - <span className='badge rounded-pill text-light gradient1'>{props.deadline}</span></li>)}
          </ul>
          <div className='col justify-content-end d-flex'>
          <div className='align-items-end w-10 btn-group-vertical'>
            <button className={`btn fa fa-${isEdited?'check':'pencil'} rounded-pill edit-button`} onClick={toggleEdit}/>
            <button className='btn fa fa-trash rounded-pill edit-button'/>
          </div>
          </div>
          {isEdited?
          (
            <div className='w-100 g-3 row bg-secondary rounded-5 p-3 bg-opacity-10'>
            <div className='row m-2 w-100'>
              <h5 className='ml-4 mt-2 col'>List Pelajaran</h5>
              <div className='col d-flex justify-content-end w-100'><button className='btn btn-primary rounded-pill text-nowrap'><i className='fa fa-plus m-2'/> tambah data</button></div>
            </div>
            <Pelajaran/>
            <Pelajaran/>
          </div>
          )
        :
        ('')}
        </div>
  )

}
function Pelajaran(){
  return(
    <div className='bg-light rounded-pill col-12'>
      <div className='row h-100 d-flex align-items-center text-center'>
        <b className='col-6 pt-2 pb-2'><h4>Judul</h4></b>
        <span className='col-1 pt-2 pb-2 d-none d-sm-flex'> 50 soal</span>
        <div className='col-1 d-none d-sm-flex'>
          <span>Senin 08:00</span>
        </div>
        <button className=' col-1 btn btn-outline-success h-100 d-none d-sm-flex'>Belum Dimulai</button>
        <button className='col-2 col-sm-1 btn btn-outline-danger h-100'><i className='fa fa-trash larger-icon'/></button>
        <button className='col-4 col-sm btn rounded-end-pill btn-outline-primary h-100'>lihat <i className='fa fa-arrow-right'/></button>
      </div>
    </div>
  )
}