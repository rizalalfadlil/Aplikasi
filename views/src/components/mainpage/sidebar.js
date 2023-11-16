import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { useHistory } from 'react-router-dom';

import { message } from 'antd';
import { Tooltip } from 'antd';
function Sidebar({ isOpen, toggleSidebar }) {
  const [username, setUsername] = useState('Nama User');
  const [userId, setUserId] = useState('id user');
  const [userType, setUserType] = useState('Tipe Akun');

  message.config({
    duration: 2,
    maxCount: 1,
  });
  
  useEffect(() => {
    const user = localStorage.getItem('user');

    if (user) {
      const parsedUser = JSON.parse(user);
        setUsername(parsedUser.username);
        setUserId(parsedUser.id);
        setUserType(parsedUser.role);
    } else {
      message.error('Anda Belum Login!').then(() => goBack());
    }
  }, []);
  const goBack = () =>{
    window.location.href = '/login';
  }

  return (
    <div onClick={toggleSidebar}u className={`d-md-block text-light sidebar ${isOpen ? 'open' : 'd-none d-md-block'}`}>
      <button className="navbar-toggler m-3" oc>
        ☰
      </button>
      <div className='pt-4'>
        <div className={`w-100 text-center mt-5 text-nowrap opacity-${isOpen?'100':'0'}`}>
          <h2>{username}</h2>
          <span>{userType} | {userId} </span>
        </div>
        <div className='list-group mt-5 bg-transparent text-center w-100 pt-5 p-2'>
          <SideMenu isOpen={isOpen} icon="user" title="Menu 1" link='/'/>
          <SideMenu isOpen={isOpen} icon="bars" title="Kerjakan Soal" link='pelajaran'/>
          <SideMenu isOpen={isOpen} icon='sign-out' title='Log-out' link='login'/>
        </div>
      </div>
    </div>
  );
}
function SideMenu(props){

  return(
      <>
      {props.isOpen?
      <a type="button" href={props.link} className={`list-group-item pt-3 border-0 align-items-center rounded-pill text-light justify-content-center menu-item list-group-item-action d-flex`}><i className={`fa fa-${props.icon} ${props.isOpen?'':'show-icon'}`}/><h5 className={`text-nowrap mt-2 overflow-hidden opacity-${props.isOpen?'100':'0'}`}>{props.title}</h5></a>
      :(
      <Tooltip title={props.title} placement='right' color='blue'>
        <a type="button" href={props.link} className={`list-group-item pt-3 border-0 align-items-center rounded-pill text-light justify-content-center menu-item list-group-item-action d-flex`}><i className={`fa fa-${props.icon} ${props.isOpen?'':'show-icon'}`}/><h5 className={`text-nowrap mt-2 overflow-hidden opacity-${props.isOpen?'100':'0'}`}>{props.title}</h5></a>
      </Tooltip>
      )}
      </>
  )
}
export default Sidebar;

