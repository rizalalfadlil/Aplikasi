import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { Popconfirm, message } from "antd";

export function Pelajaran(props) {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { weekday: 'long', hour: 'numeric', minute: 'numeric' };
    const formattedDate = date.toLocaleDateString('id-ID', options);
    return formattedDate;
  };
const handleEdit = () =>{
  const time = 10;
  const newDeadline = Date.now() + 1000 * time * 60;
  localStorage.setItem('idTugas', props.id.toString())
  localStorage.setItem('deadline', newDeadline.toString());

  window.location.href = "/pelajaran";
}
  const handleDelete = async () => {
    try {
      // Mengirim permintaan DELETE ke server
      const response = await fetch(`http://localhost:8000/api/subjects/${props.id}`, {
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
    <div className='bg-light rounded-pill col-12'>
      <div className='row h-100 d-flex align-items-center text-center'>
        <b className='col-6 pt-2 pb-2'><h4>{props.judul}</h4></b>
        <span className='col-1 pt-2 pb-2 d-none d-sm-flex'> {props.jumlahSoal} soal</span>
        <div className='col-1 d-none d-sm-flex'>
          <span>{formatDate(props.startTime)}</span>
        </div>
        <button className='col-1 btn btn-outline-success h-100 d-none d-sm-flex'>Belum Dimulai</button>
        <Popconfirm
        title='Hapus data pelajaran ini?'
        onConfirm={handleDelete}
        cancelText='Batal'
        >
        <button className='col-2 col-sm-1 btn btn-outline-danger h-100'>
          <i className='fa fa-trash larger-icon'/>
        </button>
        </Popconfirm>
        <button onClick={handleEdit} className='col-4 col-sm btn rounded-end-pill btn-outline-primary h-100'>lihat <i className='fa fa-arrow-right'/></button>
      </div>
    </div>
  );
}
