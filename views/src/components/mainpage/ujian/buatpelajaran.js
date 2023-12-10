import React, {useState} from "react";
export const CreatePelajaran = (props) =>{
  const Create = () =>{
    window.location.href = "/create-soal";
    localStorage.setItem('soal',JSON.stringify({
      id:props.id,
      title:props.title,
      deadline:props.deadline
    }))
  }
    return(
      <button 
      className='rounded-3 btn btn-primary p-3 col-12 shadow-sm'
      onClick={Create}
      >
          <b className='pt-2 pb-2'>Tambahkan Data</b>
      </button>
    )
  }