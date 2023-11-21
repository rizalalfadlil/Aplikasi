import React, { useState, useEffect } from 'react';
import { ResourceLink } from '../../config.js';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../mainpage/sidebar.js';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Empty } from 'antd';
dayjs.extend(customParseFormat);
const showedFormat = 'DD/MM/YYYY  hh:mm:ss';

const UserProfile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAnswers, setLoadingAnswers] = useState(true);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/users/${id}`);
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    
    fetchUserData();
  }, [id]);

  useEffect(() => {
    // Mengambil data dari API
    fetch(ResourceLink + '/api/student-answers')
      .then((response) => response.json())
      .then((data) => {
        // Filter jawaban sesuai dengan userId
        const userAnswers = data.filter(answer => answer.userId === parseInt(id));
        setAnswers(userAnswers);
        setLoadingAnswers(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [id]);
  
const testData = () =>{
  console.log(answers);
}
  if (loading) {
    return <p>Loading...</p>;
  }

  if (!userData) {
    return <p>User not found</p>;
  }

  return (
    <div className='d-flex'>
      <Sidebar/>
      <div className='container shadow-sm my-5 border rounded-5 p-5'>
        <button onClick={testData}>test</button>
      <h1 className=''>User Profile</h1>
      <div className='row'>
      <div className='my-3 col-12'>
        <span className='text-primary'>Username</span>
        <h1 className='p-1'>{userData.username}</h1>
      </div>
      <div className='my-3 col-4'>
        <span className='text-primary'>Tipe Akun</span>
        <h5 className='p-1'>{userData.role}</h5>
      </div>
      {userData.grade && (
        <div className='my-3 col-4'>
        <span className='text-primary'>Kelas</span>
        <h5 className='p-1'>{userData.grade}</h5>
      </div>
      )}
      {userData.department && (
        <div className='my-3 col-4'>
        <span className='text-primary'>jurusan</span>
        <h5 className='p-1'>{userData.department}</h5>
      </div>
      )}
      <hr className='border border-primary'/>
      </div>
      <h1 className='my-4'>Soal yang telah dikerjakan</h1>
      <div className='overflow-scroll overflow-x-hidden p-4 h-50'>
        {loadingAnswers === false ? (
          <>
          {answers.length !== 0?(
            <>
            {answers.map((answer, index) =>(
            <div className='border my-2 rounded-pill row'>
              <div className='border-end col-1 p-2 d-flex justify-content-center align-items-center'>{index + 1}</div>
              <div className='col-2 p-2 d-flex justify-content-center align-items-center border-end'>{answer.pelajaran}</div>
              <div className='col-2 p-2 d-flex justify-content-center align-items-center border-end'>{answer.username}</div>
              <div className='col-2 p-2 text-center border-end'>{dayjs(answer.createdAt).format(showedFormat)}</div>
              {answer.nilaiUjian !== null?
              (
                <div className='col-1 p-2 text-center'>{answer.nilaiUjian}</div>
              )
              :
              (
                <button className='col btn btn-outline-primary rounded-end-pill p-2 text-center'>Nilai Sekarang</button>
              )}
            </div>
          ))
          }
          </>
          ):(
            <div className='d-flex justify-content-center align-items-center h-100'>
              <Empty description='tidak ada soal yang dikerjakan'/>
            </div>
          )}
          </>
        ):'l'}
      </div>
    </div>
    </div>
  );
};

export default UserProfile;
