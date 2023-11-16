import React, {useState} from "react";
import { DatePicker, Switch, message } from 'antd';
import { ResourceLink } from "../../../config";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { Pelajaran } from "./pelajaran";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import axios from "axios";
const { RangePicker } = DatePicker;
dayjs.extend(customParseFormat);
const showedFormat = 'DD-MM-YYYY';
export function InsertSesiUjian(props){
    const [editedJudul, setEditedJudul] = useState(props.judul);
    const [editedStrictMode, setEditedStrictMode] = useState(props.strictMode);
    const [editedStartTime, setEditedStartTime] = useState(dayjs(props.startTime)); // Gunakan null jika data awal adalah null atau set sesuai kebutuhan
    const [editedSubmissionDeadline, setEditedSubmissionDeadline] = useState(dayjs(props.submissionDeadline)); // Gunakan null jika data awal adalah null atau set sesuai kebutuhan

    const [isEdited, setIsEdited] =useState(false);
    const toggleEdit = () =>{
      setIsEdited(!isEdited)
    }

    const insertExamSession = async () => {
      try {
        const response = await fetch(`${ResourceLink}/api/exam-sessions`, {
          method: 'POST',
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
        message.success('Berhasil Membuat Data Ujian');
        props.fetchExamSessions();
      } catch (error) {
        console.error('Gagal membuat sesi ujian:', error);
      }
    };
  
      const handleUpdate = () => {
        insertExamSession();
        setIsEdited(false); // Setelah update, tutup mode edit
        props.fetchExamSessions();
      };
      
    return(
  <div className={`rounded-5 m-3 col-12 col-sm${isEdited?'-12 border bg-light text-dark p-4':'-12'} row`}>
            <ul type='none' className='col-8'>
              {isEdited?
              (
              <>
              <li><input className='bg-light w-100 p-2 border-bottom' placeholder="Judul" value={editedJudul} onChange={(e) => setEditedJudul(e.target.value)} /></li>
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
              </>
              )}
            </ul>
            <div className='col justify-content-end d-flex'>
            <div className='align-items-end w-10 btn-group-vertical'>
            {isEdited?
            (<>
            <button type="button" onClick={handleUpdate} className="btn fa fa-check edit-button"/>
            <button type="button" onClick={toggleEdit} className="btn fa fa-times edit-button"/>
            </>)
            :(<button type="button" onClick={toggleEdit} className="btn btn-primary badge rounded-pill">Tambah Data <i className="fa fa-plus p-2"/></button>)}
            </div>
            </div>
          </div>
    )
  
  } 