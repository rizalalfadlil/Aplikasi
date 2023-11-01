import React, {useState} from "react";
import { DatePicker, Switch } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { Pelajaran } from "./pelajaran";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import axios from "axios";
const { RangePicker } = DatePicker;
dayjs.extend(customParseFormat);
const showedFormat = 'DD-MM-YYYY';
export function SesiUjian(props){
    const [editedJudul, setEditedJudul] = useState(props.judul);
    const [editedStrictMode, setEditedStrictMode] = useState(props.strictMode);
    const [editedStartTime, setEditedStartTime] = useState(dayjs(props.startTime)); // Gunakan null jika data awal adalah null atau set sesuai kebutuhan
    const [editedSubmissionDeadline, setEditedSubmissionDeadline] = useState(dayjs(props.submissionDeadline)); // Gunakan null jika data awal adalah null atau set sesuai kebutuhan

    const [isEdited, setIsEdited] =useState(false);
    const toggleEdit = () =>{
      setIsEdited(!isEdited)
    }
    const updateExamSession = async () => {
        try {
          const response = await fetch(`http://localhost:8000/api/exam-sessions/${props.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: editedJudul,
              strictMode: editedStrictMode,
              startTime: editedStartTime,
              submissionDeadline: editedSubmissionDeadline,
              // Tambahkan properti lainnya yang diperlukan untuk update sesuai dengan kebutuhan Anda
            }),
          })
          // Handle response sesuai kebutuhan Anda
          // Contoh: Jika response.status adalah 200, berarti update berhasil
        } catch (error) {
          console.error('Gagal mengupdate sesi ujian:', error);
        }
      };
           
    const deleteExamSession = async () =>{
        try {
            const response = await fetch(`http://localhost:8000/api/exam-sessions/${props.id}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              }
            })
            window.location.reload();
          } catch (error) {
            console.error('Gagal menghapus sesi ujian:', error);
          }
    }

      const handleUpdate = () => {
        updateExamSession();
        setIsEdited(false); // Setelah update, tutup mode edit
        window.location.reload();
      };
      
    return(
  <div className={`rounded-5 border m-3 col-12 col-sm${isEdited?'-12 ':'-12'} p-4 bg-light animated text-dark row`}>
            <ul type='none' className='col-8'>
              {isEdited?
              (
              <>
              <li><input className='bg-light w-100 p-2 border-bottom' value={editedJudul} onChange={(e) => setEditedJudul(e.target.value)} /></li>
              <li className='pt-2 pb-2 row w-50'>
              <span className='col'>Mode Ketat</span>
              <Switch className='rounded-pill col-1' checked={editedStrictMode} onChange={(checked) => setEditedStrictMode(checked)} />
              </li>
              <li className='row d-flex mt-2 w-50 border rounded-pill'>
              <RangePicker 
              placeholder={['mulai', 'selesai']} 
              defaultValue={[editedStartTime, editedSubmissionDeadline]}
              bordered={false} 
              onChange={(dates) => {
                setEditedStartTime(dates[0]); // Jika Anda memerlukan nilai waktu spesifik, sesuaikan ini
                setEditedSubmissionDeadline(dates[1]); // Jika Anda memerlukan nilai waktu spesifik, sesuaikan ini
              }} 
              />
              </li>
              </>
              )
              :
              (
              <>
              <li><h5><b>{props.judul}</b></h5></li>
              {props.strictMode?(<li className='badge rounded-pill text-bg-danger'>strict mode</li>):(<li className='badge rounded-pill text-bg-success'>normal mode</li>)}
              <li className='text-nowrap'><span className='badge rounded-pill text-light mt-2 gradient1'>{dayjs(props.startTime).format(showedFormat)}</span> - <span className='badge rounded-pill text-light gradient1'>{dayjs(props.submissionDeadline).format(showedFormat)}</span></li>
              </>
              )}
            </ul>
            <div className='col justify-content-end d-flex'>
            <div className='align-items-end w-10 btn-group-vertical'>
            <button className={`btn fa fa-${isEdited ? 'check' : 'pencil'} rounded-pill edit-button`} onClick={isEdited ? handleUpdate : toggleEdit} />
            <button className='btn fa fa-trash rounded-pill edit-button' onClick={deleteExamSession}/>
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