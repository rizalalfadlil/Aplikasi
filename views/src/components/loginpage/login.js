import React, { useState } from 'react';
import { message } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import 'font-awesome/css/font-awesome.min.css';
import { ListGroup } from 'react-bootstrap';
import axios from 'axios'; // Import axios
import { ResourceLink } from '../../config';
const Login = () => {
  localStorage.removeItem('user');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    // Data yang akan dikirim ke server dalam format JSON
    const loginData = {
      username: username,
      password: password,
    };

    try {
      // Mengirim permintaan POST ke server
      const response = await axios.post(ResourceLink + '/api/login', loginData);

      // Tangani respons dari server sesuai dengan kebutuhan Anda
      if (response.status === 200) {
        message.success(response.data.message);
        localStorage.setItem('user', JSON.stringify(response.data.data));
        window.location.href = '/';
        //localStorage.setItem('notification', JSON.stringify({message:'notifikasi', type:'success'}))
      } else {
        // Login gagal, tampilkan pesan kesalahan atau tindakan lainnya.
        alert('login gagal')
      }
    } catch (error) {
      // Tangani kesalahan, seperti ketika server tidak dapat dijangkau.
      message.error('Login Gagal : ' + error.response.data.error);
    }
  };

  return (
    <>
      <LoginComponent handleLogin={handleLogin} setUsername={setUsername} setPassword={setPassword} />
      <HalfScreenOverlay />
    </>
  );
};

function LoginComponent({ handleLogin, setUsername, setPassword }) {
  return (
    <div className="form-box form-shape d-flex align-items-center justify-content-center">
      <div className="container form-box p-4">
        <h2 className="mb-2">Login</h2>
        <form onSubmit={handleLogin}>
          <Input name="Username" type="text" icon="user" setValue={setUsername} />
          <Input name="Password" type="password" icon="lock" setValue={setPassword} />
          <button type="submit" className="btn text-white shadow-sm mt-5 w-100 p-3 rounded-pill gradient1">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

function Input(props) {
  return (
    <div className="form-group">
      <label className="mb-2 mt-2">{props.name}</label>
      <ListGroup horizontal>
        <ListGroup.Item className="bg-body-tertiary rounded-start-pill">
          <i className={`fa fa-` + props.icon} />
        </ListGroup.Item>
        <ListGroup.Item className="w-100 bg-body-tertiary rounded-end-pill">
          <input
            type={props.type}
            name={props.name}
            className="w-100 bg-body-tertiary"
            required
            onChange={(e) => props.setValue(e.target.value)}
          />
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
}

const HalfScreenOverlay = () => {
  return (
    <div className={`half-screen-overlay d-none align-items-center text-white justify-content-center d-sm-flex shifted gradient1`}>
      <div>
        <h1 className="mb-4">Aplikasi</h1>
      </div>
    </div>
  );
};

export default Login;
