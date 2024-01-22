import React,{useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { Popconfirm, message } from "antd";
import { ResourceLink } from "../../../config";
import { json } from "sequelize";

export function Pelajaran(props) {
  const [adaKunjaw, setAdaKunjaw] = useState(false);
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { weekday: 'long', hour: 'numeric', minute: 'numeric' };
    const formattedDate = date.toLocaleDateString('id-ID', options);
    return formattedDate;
  };
const handleEdit = () =>{
  localStorage.setItem('idTugas', props.id.toString())
  localStorage.setItem('soal',JSON.stringify({
    id:props.idUjian,
    title:props.judulUjian,
    deadline:props.deadline
  }))

  window.location.href = "/create-soal";
}
const buatKunjaw = async () =>{
  localStorage.setItem('idTugas', props.id.toString());
  const savedKunjaw = await fetchDataWithId(props.id);
  console.log(JSON.parse(savedKunjaw));
}
// Fungsi untuk mengambil data dengan ID tertentu dari server
const fetchDataWithId = async (id) => {
  try {
    const response = await fetch(`${ResourceLink}/api/answer-keys/${id}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return null;
  } catch (error) {
    console.error('Gagal mengambil data dengan ID tertentu', error);
    throw error;
  }
};

  const handleDelete = async () => {
    try {
      // Mengirim permintaan DELETE ke server
      const response = await fetch(`${ResourceLink}/api/subjects/${props.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Tambahkan header sesuai kebutuhan, misalnya token autentikasi jika diperlukan
        },
      });

      if (response.ok) {
        // Pelajaran berhasil dihapus, Anda dapat melakukan tindakan selanjutnya seperti memperbarui tampilan
        props.fetchSubjects();
        console.log('Pelajaran berhasil dihapus');
        message.success('Pelajaran berhasil dihapus');
      } else {
        // Menangani kesalahan jika permintaan tidak berhasil
        message.error('Gagal menghapus pelajaran');
        console.error('Gagal menghapus pelajaran');
      }
    } catch (error) {
      message.error('Terjadi kesalahan:', error);
      console.error('Terjadi kesalahan:', error);
    }
  };

  return (
    <div className='bg-light rounded-3 col-12 shadow-sm'>
      <div className='row h-100 d-flex align-items-center text-center'>
        <b className='col-4 col-md-5 pt-2 pb-2'><h4>{props.judul}</h4></b>
        <span className='col-1 pt-2 pb-2 d-none d-sm-flex'> {props.jumlahSoal} soal</span>
        <div className='col-2 d-none d-sm-flex'>
          <span>{formatDate(props.startTime)}</span>
        </div>
        <Popconfirm
        title='Hapus data pelajaran ini?'
        onConfirm={handleDelete}
        cancelText='Batal'
        >
        <button className='col-2 col-sm-1 btn btn-outline-danger h-100'>
          <i className='fa fa-trash larger-icon'/>
        </button>
        </Popconfirm>
        <button onClick={buatKunjaw} className='col-4 col-sm btn btn-outline-primary h-100'>Jawaban<i className={`fa ms-2 fa-${adaKunjaw?'check':'exclamation'} text-${adaKunjaw?'success':'warning'}`}/></button>
        <button onClick={handleEdit} className='col-sm btn rounded-end-3 btn-outline-primary h-100'>Soal<i className='fa ms-2 fa-arrow-right'/></button>
      </div>
    </div>
  );
}
