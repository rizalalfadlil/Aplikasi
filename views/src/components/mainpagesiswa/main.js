import React,{useState, useEffect} from 'react'
import { ResourceLink } from '../../config'
import Sidebar from '../mainpage/sidebar'
import Modal from 'antd/es/modal/Modal'
import './style.css'
import { Empty } from 'antd'
import customParseFormat from 'dayjs/plugin/customParseFormat';

import dayjs from 'dayjs'
dayjs.extend(customParseFormat);
const showedFormat = 'DD-MM hh:mm';
export const MainSiswa = () => {
  const [examSessions, setExamSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [open, setOpen] = useState(false);
  const showModal = (props) => {
    setInfoUjian(props);
    setOpen(true);
    console.log(infoUjian);
  };
  const handleOk = () => {
    setOpen(false);
    const time = 10;
    const newDeadline = Date.now() + 1000 * time * 60;
    localStorage.setItem('idTugas', infoUjian.id.toString());
    localStorage.setItem('deadline', newDeadline.toString());
    window.location.href = "/pelajaran";
  };

  const handleCancel = () => {
    setOpen(false);
  };
  const [infoUjian, setInfoUjian] = useState({
    pelajaran:'pelajaran',
    waktu:'waktu',
    jumlahSoal:'jumlah soal',
    id:''
  })
  useEffect(() => {
    // Mengambil data dari API
    fetch(ResourceLink + '/api/exam-sessions')
      .then((response) => response.json())
      .then((data) => setExamSessions(data))
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    // Mengambil data dari API
    fetch( ResourceLink + '/api/subjects')
      .then((response) => response.json())
      .then((data) => setSubjects(data))
      .catch((error) => {
        console.error('Error fetching data:', error);
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
  return (
    <div className='d-flex'>
      <Sidebar/>
      <div className='container-fluid m-4 mt-5'>
        <div className='mt-5 p-4 rounded-5'>
        <Modal
        open={open}
        title="Mulai ujian"
        onOk={handleOk}
        width={1000}
        centered
        okText='Mulai'
        cancelText='Kembali'
        onCancel={handleCancel}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn />
          </>
        )}
      >
        <h4>{infoUjian.pelajaran}</h4>
        <span>{infoUjian.waktu} Menit | {infoUjian.jumlahSoal} Soal</span><br/>
          <div className='p-3 my-4 bg-secondary bg-opacity-10 rounded-3 border'>
          <p>Sebelum Anda memulai, kami memberikan beberapa petunjuk dan peraturan yang harus diikuti selama ujian. Mohon dibaca dengan seksama.</p>
          <ol>
            <li>
              <strong>Berdoa Sebelum Memulai Ujian:</strong><br/>
              Sebelum Anda memulai mengerjakan soal, luangkan waktu sejenak untuk berdoa. Semoga Anda diberikan ketenangan dan kebijaksanaan dalam menjawab setiap pertanyaan.
            </li>
            <li>
              <strong>Periksa Kembali Jawaban:</strong><br/>
              Setelah Anda menyelesaikan ujian, pastikan untuk menyisihkan waktu untuk memeriksa kembali jawaban Anda. Periksa apakah Anda telah menjawab semua pertanyaan dan apakah jawaban yang Anda berikan sesuai dengan yang Anda inginkan.
            </li>
            <li>
              <strong>Tidak Ada Kecurangan:</strong><br/>
              Dilarang keras melakukan kecurangan selama ujian. Pastikan Anda tidak mencontek, saling berkomunikasi dengan peserta lain, atau menggunakan bahan-bahan yang tidak diizinkan.
            </li>
            <li>
              <strong>Waktu Pengerjaan:</strong><br/>
              Ujian ini memiliki batas waktu tertentu. Pastikan Anda memanfaatkan waktu dengan baik dan mengatur strategi pengerjaan agar dapat menyelesaikan semua soal.
            </li>
            <li>
              <strong>Teknis dan Troubleshooting:</strong><br/>
              Jika Anda mengalami masalah teknis selama ujian, segera laporkan kepada pengawas atau administrator ujian. Jangan mencoba memperbaiki masalah sendiri tanpa izin.
            </li>
          </ol>
          <p>Terima kasih atas kerjasama Anda. Semoga ujian ini berjalan lancar dan memberikan hasil yang memuaskan. Selamat mengerjakan!</p>
          </div>
                  <span className='my-5'><b>Mulai Ujian Sekarang?</b></span>
      </Modal>
            <h2 className='mt-5 border-bottom border-5 pb-5 border-primary border-opacity-25'>List Ujian</h2>
            {examSessions.map((session, index) => (
            <Ujian
              key={index}
              judul={session.name}
            >
              {Array.isArray(subjects) && subjects.map((subject, index) => (
                subject.examSessionId === session.id ? (
                  <PelajaranTodo
                    key={index}
                    pelajaran={subject.name}
                    mulai={subject.startTime}
                    waktu={subject.submissionDeadline}
                    soal = {JSON.parse(subject.questions).length}
                    showModal={showModal}
                    id={subject.id}
                  />
                ) : (<Empty description='kosong'/>)
              ))}
            </Ujian>
          ))}
        </div>
      </div>
    </div>
  )
}
export const Ujian = (props) => {
  return (
    <div className='border rounded-3 mt-5'>
                <h3 className='p-3 rounded-top-3 gradient3r text-light'>{props.judul}</h3> 
                <div className='p-4 row gx-3 gy-3'>
                    {props.children}
                </div>
            </div>
  )
}

const PelajaranTodo = (props) => {
    const infoUjian = {
        pelajaran:props.pelajaran,
        waktu:props.waktu,
        jumlahSoal:props.soal,
        id:props.id
    }
  return (
    <button className='col-12 text-start bg-transparent col-lg-6 col-xl-4' onClick={() => props.showModal(infoUjian)}>
        <div className='border gradient3r text-light shadow rounded-3'>
        <h5 className='p-2 bg-light bg-opacity-50 rounded-top-3 position-relative'>{props.pelajaran}<div className='badge border text-danger border-danger mx-3'>Belum Dikerjakan!</div></h5>
         <div className='row px-3 pelajaran-siswa'>
            <TitleInfo variable='Waktu' value={props.waktu + ' menit'}/>
            <TitleInfo variable='Jumlah Soal' value={props.soal + ' soal'}/>
            <TitleInfo variable='Tanggal Mulai' value={dayjs(props.mulai).format(showedFormat)}/>
        </div>
    </div>
    </button>
  )
}
const TitleInfo = (props) => {
  return (
    <><p className='col-12 col-sm-6'>{props.variable} :</p><p className='col-6 mb-2'>{props.value}</p></>
  )
}

