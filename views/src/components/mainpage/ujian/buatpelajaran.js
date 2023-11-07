import React, {useState} from "react";
import { DatePicker, TimePicker } from "antd";
export const CreatePelajaran = () =>{
    const [isEditMode, setIsEditMode] = useState(false);
    const toggleEditMode = () =>{
        setIsEditMode(!isEditMode);
    }
    return(
      <>
      {isEditMode?
        (
        <div className='rounded-pill btn btn-outline-primary col-12' onClick={toggleEditMode}>
          <div className='justify-content-center h-100 d-flex align-items-center text-center'>
          <b className='pt-2 pb-2'>Tambahkan Data</b>
        </div>
        </div>
        ):
        (
          <div className='bg-light rounded-pill col-12'>
          <div className='row h-100 d-flex align-items-center text-center'>
          <b className='col-6 pt-2 pb-2 text-center'><input type="text" className="fs-5 w-75 bg-transparent" placeholder="judul"/></b>
          <div className='col-2 d-none d-sm-block justify-content-end align-items-end'>
          <DatePicker className="w-100" placeholder="tanggal mulai" bordered={false}/><TimePicker placeholder="waktu mulai" className="w-100" bordered={false}/>
          </div>
          <button className='col-4 col-sm btn rounded-end-pill btn-outline-primary h-100' onClick={toggleEditMode}>Tambahkan Pelajaran <i className='fa fa-check'/></button>
        </div>
        </div>
        )}
        </>
    )
  }