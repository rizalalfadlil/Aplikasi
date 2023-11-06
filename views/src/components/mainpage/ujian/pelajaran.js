import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

export function Pelajaran(props){
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { weekday: 'long', hour: 'numeric', minute: 'numeric' };
    const formattedDate = date.toLocaleDateString('id-ID', options);
    return formattedDate;
  };
    return(
      <div className='bg-light rounded-pill col-12'>
        <div className='row h-100 d-flex align-items-center text-center'>
          <b className='col-6 pt-2 pb-2'><h4>{props.judul}</h4></b>
          <span className='col-1 pt-2 pb-2 d-none d-sm-flex'> 50 soal</span>
          <div className='col-1 d-none d-sm-flex'>
            <span>{formatDate(props.startTime)}</span>
          </div>
          <button className=' col-1 btn btn-outline-success h-100 d-none d-sm-flex'>Belum Dimulai</button>
          <button className='col-2 col-sm-1 btn btn-outline-danger h-100'><i className='fa fa-trash larger-icon'/></button>
          <button className='col-4 col-sm btn rounded-end-pill btn-outline-primary h-100'>lihat <i className='fa fa-arrow-right'/></button>
        </div>
      </div>
    )
  }