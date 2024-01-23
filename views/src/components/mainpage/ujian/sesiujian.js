import React, {useState} from "react";
import { DatePicker, Popconfirm, Switch, message, Dropdown, Modal, Checkbox } from 'antd';
import { MoreOutlined, SendOutlined } from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ResourceLink } from "../../../config";
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editedStrictMode, setEditedStrictMode] = useState(props.strictMode);
    const [editedStartTime, setEditedStartTime] = useState(dayjs(props.startTime)); // Gunakan null jika data awal adalah null atau set sesuai kebutuhan
    const [editedSubmissionDeadline, setEditedSubmissionDeadline] = useState(dayjs(props.submissionDeadline)); // Gunakan null jika data awal adalah null atau set sesuai kebutuhan
    const [isEdited, setIsEdited] =useState(false);
    const [selectedKelas, setSelectedKelas] = useState(props.allowedGrades ? props.allowedGrades.split(',') : []);
    const [selectedJurusan, setSelectedJurusan] = useState(props.allowedDepartments ? props.allowedDepartments.split(',') : []);    
    const kelasOptions = ['X', 'XI', 'XII'];
    const jurusanOptions = ['RPL', 'TKJ', 'TBSM', 'TKRO', 'TP'];
  const handleKelasChange = (kelas) => {
    setSelectedKelas(kelas);
    console.log(selectedKelas);
  };

  const handleJurusanChange = (jurusan) => {
    setSelectedJurusan(jurusan);
    
  };
    const toggleEdit = () =>{
      setIsEdited(!isEdited)
    }
    const showModal = () => {
      setIsModalOpen(true);
    };
  
    const handleOk = () => {
      setIsModalOpen(false);
    };
  
    const handleCancel = () => {
      setIsModalOpen(false);
    };
    const updateExamSession = async () => {
        try {
          const response = await fetch(`${ResourceLink}/api/exam-sessions/${props.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: editedJudul,
              strictMode: editedStrictMode,
              startTime: editedStartTime,
              submissionDeadline: editedSubmissionDeadline,
              allowedGrades: selectedKelas.toString(),
              allowedDepartments: selectedJurusan.toString(),
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
          const subjectsResponse = await fetch(`${ResourceLink}/api/subjects?examSessionId=${props.id}`);
          if (!subjectsResponse.ok) {
            throw new Error('Gagal mengambil daftar mata pelajaran terkait');
          }
      
          const subjectsData = await subjectsResponse.json();
      
          // 2. Hapus semua mata pelajaran terkait
          const deleteSubjectPromises = subjectsData.map(async (subject) => {
            const subjectId = subject.id;
            const subjectDeleteResponse = await fetch(`${ResourceLink}/api/subjects/${subjectId}`, {
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
          const sessionDeleteResponse = await fetch(`${ResourceLink}/api/exam-sessions/${props.id}`, {
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
      const items = [
        {
          label: (
            <button onClick={isEdited?handleUpdate:toggleEdit} className='bg-transparent text-primary'><i className={`fa fa-${isEdited?'paper-plane':'pencil'} me-2`}/>{isEdited?'simpan':'edit'}</button>
          ),
          key: '0',
        },
        {
          label: (
            <button onClick={isEdited?toggleEdit:showModal} className='bg-transparent text-danger'><i className={`fa fa-${isEdited?'times':'trash'} me-2`}/>{isEdited?'batal':'hapus'}</button>
          ),
          key: '1',
        },
      ];
      
    return(
  <div className={`rounded-3 shadow-sm shadow border m-3 col-12  p-4 bg-light animated text-dark row`}>
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
              <li className="mt-2">
        <hr />
        <b>Kelas</b>
        <Checkbox.Group style={{ width: '100%' }} options={kelasOptions} value={selectedKelas} onChange={handleKelasChange}/>
      </li>
      <li>
        <b>Jurusan</b>
        <Checkbox.Group style={{ width: '100%' }} options={jurusanOptions} value={selectedJurusan} onChange={handleJurusanChange}/>
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
            <div className='col justify-content-end  align-items-start d-flex'>
            <div className='align-items-end w-10 btn-group-vertical'>
            <Dropdown arrow menu={{items}}>
            {isEdited?(
              <i className="fa fa-check fs-4 text-primary"/>
            ):(
              <MoreOutlined className="fs-4 text-primary"/>
            )}
            </Dropdown>
            <Modal title="Hapus ujian ini?" centered open={isModalOpen} onOk={deleteExamSession} onCancel={handleCancel}  cancelText='batal'>
              <p>Data yang dihapus tidak akan bisa dikembalikan lagi</p>
            </Modal>
            </div>
            </div>
            {isEdited?
            (
              <div className='w-100 g-3 row bg-secondary rounded-3 p-3 bg-opacity-10'>
              <div className='row m-2 w-100'>
                <h5 className='ml-4 mt-2 col'>List Pelajaran</h5>
              </div>
              {props.children}
              <CreatePelajaran id={props.id} title={editedJudul} deadline={editedSubmissionDeadline}/>
            </div>
            )
          :
          ('')}
          </div>
    )
  
  }