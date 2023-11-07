import React, {useState} from "react";
import { DatePicker, Popconfirm, Switch, message } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { Pelajaran } from "./pelajaran";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import axios from "axios";
import { CreatePelajaran } from "./buatpelajaran";
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
          message.success('Berhasil Memperbarui Data Ujian')
          props.fetchExamSessions();
        } catch (error) {
          message.error('Gagal Memperbarui Data Ujian')
          console.error('Gagal mengupdate sesi ujian:', error);
        }
      };
           
      const deleteExamSession = async () => {
        try {
          // 1. Ambil daftar mata pelajaran yang terkait dengan sesi ujian yang akan dihapus
          const subjectsResponse = await fetch(`http://localhost:8000/api/subjects?examSessionId=${props.id}`);
          if (!subjectsResponse.ok) {
            throw new Error('Gagal mengambil daftar mata pelajaran terkait');
          }
      
          const subjectsData = await subjectsResponse.json();
      
          // 2. Hapus semua mata pelajaran terkait
          const deleteSubjectPromises = subjectsData.map(async (subject) => {
            const subjectId = subject.id;
            const subjectDeleteResponse = await fetch(`http://localhost:8000/api/subjects/${subjectId}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
            });
      
            if (!subjectDeleteResponse.ok) {
              throw new Error(`Gagal menghapus mata pelajaran dengan ID ${subjectId}`);
            }
          });
      
          await Promise.all(deleteSubjectPromises);
      
          // 3. Hapus sesi ujian setelah semua mata pelajaran terkait telah dihapus
          const sessionDeleteResponse = await fetch(`http://localhost:8000/api/exam-sessions/${props.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          if (!sessionDeleteResponse.ok) {
            throw new Error('Gagal menghapus sesi ujian');
          }
      
          // Reload halaman setelah penghapusan berhasil
          props.fetchExamSessions();
          message.success('Berhasil Menghapus Data Ujian')
        } catch (error) {
          message.error('Gagal Menghapus Data Ujian')
          console.error('Gagal menghapus sesi ujian:', error);
        }
      };
      

      const handleUpdate = () => {
        updateExamSession();
        setIsEdited(false); // Setelah update, tutup mode edit
        props.fetchExamSessions();
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
              <li><p className="badge text-dark">{props.id}</p></li>
              {props.strictMode?(<li className='badge rounded-pill text-bg-danger'>strict mode</li>):(<li className='badge rounded-pill text-bg-success'>normal mode</li>)}
              <li className='text-nowrap'><span className='badge rounded-pill text-light mt-2 gradient1'>{dayjs(props.startTime).format(showedFormat)}</span> - <span className='badge rounded-pill text-light gradient1'>{dayjs(props.submissionDeadline).format(showedFormat)}</span></li>
              </>
              )}
            </ul>
            <div className='col justify-content-end d-flex'>
            <div className='align-items-end w-10 btn-group-vertical'>
            <button className={`btn fa fa-${isEdited ? 'check' : 'pencil'} rounded-pill edit-button`} onClick={isEdited ? handleUpdate : toggleEdit} />
            <Popconfirm
            title={isEdited?'Keluar Dari Mode Edit?':'Yakin ingin Menghapus Data ini?'}
            description={isEdited?'Perubahan Belum Tersimpan':'Data tidak akan bisa dikembalikan lagi'}
            onConfirm={isEdited?toggleEdit : deleteExamSession}
            placement="left"
            okButtonProps={({classNames:'rounded-pill border'})}
            cancelText='batal'
                  >
            <button className={`btn fa fa-${isEdited?'times':'trash'} rounded-pill edit-button`}/>
            </Popconfirm>
            </div>
            </div>
            {isEdited?
            (
              <div className='w-100 g-3 row bg-secondary rounded-5 p-3 bg-opacity-10'>
              <div className='row m-2 w-100'>
                <h5 className='ml-4 mt-2 col'>List Pelajaran</h5>
              </div>
              <CreatePelajaran/>
              {props.children}
            </div>
            )
          :
          ('')}
          </div>
    )
  
  }