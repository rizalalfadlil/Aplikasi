// bagaimana cara mengisi kunci jawaban otomatis di halaman ini, dengan mengambil dari ${ResourceLink}/api/answer-key/${idNIlai} di kolom answer, isinya sama seperti di jawaban siswa (contoh : [{"pertanyaan":"<p>apa arti dari <strong>run</strong></p>","jawaban":"<p>lari</p>"}])

import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Sidebar from '../mainpage/sidebar';
import { ResourceLink } from '../../config';
import { Checkbox, message } from 'antd';

export const Nilai = () => {
    const [loading, setLoading] = useState(true);
    const idNIlai = localStorage.getItem('nilai');
    const [idUjian, setIdUjian] = useState(1);
    const [userData, setUserData] = useState([]);
    const [ujian, setUjian] = useState([]);
    const [score, setScore] = useState();
    const [done, setDone] = useState(false);
    const result = 100 * score/ujian.length;
    const [answerKey, setAnswerKey] = useState([]);
    const [checkedItems, setCheckedItems] = useState({});

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const response = await axios.get(`${ResourceLink}/api/student-answers/${idNIlai}`);
            const data = response.data
            setUserData({
                username:data.username,
                pelajaran:data.pelajaran,
                id:data.userId,
                ujianId:data.pelajaranId
            })
            const parsedUjian = await JSON.parse(data.answer);
            setIdUjian(data.pelajaranId.toString())
            setUjian(parsedUjian);
            console.log('jawaban', parsedUjian);
            fetchAnswerKey(data.pelajaranId.toString());
          } catch (error) {
            console.error(error);
          }
        };
        const fetchAnswerKey = async (id) => {
          try {
            const response = await axios.get(`${ResourceLink}/api/answer-key/${id}`);
            const data = response.data;
            const parsedKunjaw = await JSON.parse(data.answer);
            console.log('kunjaw', parsedKunjaw);
            setAnswerKey(parsedKunjaw);
            setLoading(false);
          } catch (error) {
            console.error('Error fetching answer key:', error);
            setLoading(false);
          }
        };
        fetchUserData();
        setScore(ujian.length);
      }, [idNIlai]);

      

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
      {loading? 'loading' : (
        <>
        {ujian.map((ujian, index) => (
            <Soal
              key={index}
              index={index}
              soal={ujian.pertanyaan}
              jawaban={ujian.jawaban}
              answerKey={answerKey}
              onCheckboxChange={handleCheckboxChange}
            />
          ))}
          </>
      )}
      </div>
      <h5>Skor = {result.toFixed(1)}</h5>
      <button className='my-4 px-5 py-2 btn btn-outline-primary border-primary border rounded' onClick={isiNilai} disabled={done}>Nilai</button>
      </div>
    </div>
  )
}
const Soal = (props) => {
  const { index, soal, jawaban, onCheckboxChange, answerKey } = props;
  const [correct, setCorrect] = useState(false);

  const onChange = (e) => {
    const isChecked = e.target.checked;
    setCorrect(isChecked);
    onCheckboxChange(index, isChecked);
  };

  useEffect(() => {
    // Memeriksa jawaban dan mengatur koreksi
    const userAnswer = props.jawaban;
    const correctAnswer = answerKey[index]?.jawaban;
    const isChecked = userAnswer === correctAnswer;

    setCorrect(isChecked);
    onCheckboxChange(index, isChecked);
  }, [props.jawaban, answerKey, index]);

  return (
    <div className={`border shadow rounded-3 border-opacity-50 border-${correct ? 'success' : 'danger'} mb-3 row`}>
      <div className='col-10 p-4'>
        <span className='fw-bold text-primary' dangerouslySetInnerHTML={{ __html: soal }} />
        <h3 className='fw-light mt-2' dangerouslySetInnerHTML={{ __html: jawaban }} />
      </div>
      <div className='col d-flex justify-content-center align-items-center'>
        <Checkbox style={{ scale: '2' }} checked={correct} onChange={onChange} />
      </div>
    </div>
  );
};

  