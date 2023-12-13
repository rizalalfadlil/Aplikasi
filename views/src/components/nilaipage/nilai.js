import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Sidebar from '../mainpage/sidebar';
import { ResourceLink } from '../../config';
import { Checkbox, message } from 'antd';

export const Nilai = () => {
    const [loading, setLoading] = useState(true);
    const idNIlai = localStorage.getItem('nilai');
    const [userData, setUserData] = useState([]);
    const [ujian, setUjian] = useState([]);
    const [score, setScore] = useState();
    const [done, setDone] = useState(false);
    const result = 100 * score/ujian.length;
    
    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const response = await axios.get(`${ResourceLink}/api/student-answers/${idNIlai}`);
            console.log(response.data);
            const data = response.data
            setUserData({
                username:data.username,
                pelajaran:data.pelajaran,
                id:data.userId,
            })
            const parsedUjian = await JSON.parse(data.answer);
            setUjian(parsedUjian);
            console.log(parsedUjian);
            console.log('user data : ', userData)
            setLoading(false);
          } catch (error) {
            console.error(error);
            setLoading(false);
          }
        };
    
        
        fetchUserData();
      }, [idNIlai]);


      const [checkedItems, setCheckedItems] = useState({});

  const handleCheckboxChange = (index, isChecked) => {
    setCheckedItems((prevItems) => ({ ...prevItems, [index]: isChecked }));
  };

  useEffect(() => {
    // Calculate the score based on checked items
    const selectedCount = Object.values(checkedItems).filter(Boolean).length;
    setScore(selectedCount);
  }, [checkedItems]);

    const tes = () =>{
        console.log(ujian)
    }
    const isiNilai = async () => {
        try {
          const response = await fetch(`${ResourceLink}/api/student-answers/${idNIlai}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              nilaiUjian: result,
            }),
          })
          console.log(response);
          message.success('Berhasil Mengisi Nilai').then(() => goBack());
          setDone(true);
        } catch (error) {
          message.error('Gagal Memperbarui Data Ujian')
          console.error('Gagal mengupdate sesi ujian:', error);
        }
      };
      const goBack = () =>{
        window.location.href = '/user/' + userData.id;
      }
  return (
    <div className='d-flex'>
        
      <Sidebar/>
      <div className='container border mt-5 p-5 rounded-5'>
      <button onClick={goBack}>tes</button>
        <h1 className='my-5'>Penilaian Ujian</h1>
        <div className='row'>
      <div className='my-3 col-6'>
        <span className='text-primary'>Username</span>
        <h1 className='p-1'>{userData.username}</h1>
      </div>
      <div className='my-3 col-6'>
        <span className='text-primary'>Nama Ujian</span>
        <h1 className='p-1'>{userData.pelajaran}</h1>
      </div>
      <hr className='border border-primary'/>
      </div>
      <div>
      {ujian.map((ujian, index) => (
            <Soal
              key={index}
              index={index}
              soal={ujian.pertanyaan}
              jawaban={ujian.jawaban}
              onCheckboxChange={handleCheckboxChange}
            />
          ))}
      </div>
      <h5>Skor = {result.toFixed(1)}</h5>
      <button className='my-4 px-5 py-2 btn btn-outline-primary border-primary border rounded' onClick={isiNilai} disabled={done}>Nilai</button>
      </div>
    </div>
  )
}
const Soal = (props) => {
    const { index, soal, jawaban, onCheckboxChange } = props;
    const [correct, setCorrect] = useState(false);
  
    const onChange = (e) => {
      const isChecked = e.target.checked;
      setCorrect(isChecked);
      onCheckboxChange(index, isChecked);
    };
  
    return (
      <div className={`border shadow bg-${correct ? 'success' : 'danger'} bg-opacity-10 rounded-3 border-opacity-50 border-${correct ? 'success' : 'danger'} mb-3 row`}>
        <div className='col-10 p-4'>
            <span className='fw-bold text-primary'dangerouslySetInnerHTML={{ __html: props.soal }}/>
            <h3 className='fw-light mt-2' dangerouslySetInnerHTML={{ __html: props.jawaban }}/>  
            </div>
        <div className='col d-flex justify-content-center align-items-center'>
          <Checkbox style={{ scale: '2' }} checked={correct} onChange={onChange} />
        </div>
      </div>
    );
  };
  
