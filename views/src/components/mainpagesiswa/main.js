import React,{useState} from 'react'
import Sidebar from '../mainpage/sidebar'
import Modal from 'antd/es/modal/Modal'
import './style.css'

export const MainSiswa = () => {
  const [open, setOpen] = useState(false);
  const [infoUjian, setInfoUjian] = useState({
    pelajaran:'pelajaran',
    waktu:'waktu',
    jumlahSoal:'jumlah soal',
  })
  const showModal = (props) => {
    setInfoUjian(props);
    setOpen(true);
  };
  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <div className='d-flex'>
      <Sidebar/>
      <div className='container-fluid m-4 mt-5'>
        <div className='mt-5 p-4 rounded-5'>
            <h2 className='mt-5 border-bottom border-5 pb-5 border-primary border-opacity-25'>List Ujian</h2>
            <div className='border rounded-3 mt-5'>
                <h3 className='p-3 rounded-top-3 gradient3r text-light'>Contoh Judul Ujian</h3>
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
        <span>{infoUjian.waktu} Soal | {infoUjian.jumlahSoal} Menit</span><br/>
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
                <div className='p-4 row gx-3 gy-3'>
                    <PelajaranTodo pelajaran='Matematika' waktu='60' soal='40' mulai='Senin 08:00' showModal={showModal}/>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
const PelajaranTodo = (props) => {
    const infoUjian = {
        pelajaran:props.pelajaran,
        waktu:props.waktu,
        jumlahSoal:props.soal,
    }
  return (
    <button className='col-12 text-start bg-transparent col-lg-6 col-xl-4' onClick={() => props.showModal(infoUjian)}>
        <div className='border gradient3r text-light shadow rounded-3'>
        <h5 className='p-2 bg-light bg-opacity-50 rounded-top-3 position-relative'>{props.pelajaran}<div className='badge border text-danger border-danger mx-3'>Belum Dikerjakan!</div></h5>
         <div className='row px-3 pelajaran-siswa'>
            <TitleInfo variable='Waktu' value={props.waktu + ' menit'}/>
            <TitleInfo variable='Jumlah Soal' value={props.soal + ' soal'}/>
            <TitleInfo variable='Tanggal Mulai' value={props.mulai}/>
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

