import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <div onClick={toggleSidebar}u className={`d-md-block text-light sidebar ${isOpen ? 'open' : 'd-none d-md-block'}`}>
      <button className="navbar-toggler m-3">
        ☰
      </button>
      <div className='pt-4'>
        <div className={`w-100 text-center mt-5 text-nowrap opacity-${isOpen?'100':'0'}`}>
          <h2>Nama User</h2>
          <span>id user | tipe akun</span>
        </div>
        <div className='list-group mt-5 bg-transparent text-center w-100 pt-5 p-2'>
          <SideMenu isOpen={isOpen} icon="user" title="Menu 1"/>
          <SideMenu isOpen={isOpen} icon="bars" title="Menu 2"/>
        </div>
      </div>
    </div>
  );
}
function SideMenu(props){

  return(
    <button type="button" className={`list-group-item pt-3 rounded-pill text-light justify-content-center menu-item list-group-item-action d-flex`}><i className={`fa fa-${props.icon} ${props.isOpen?'':'show-icon'}`}/><h5 className={`text-nowrap overflow-hidden opacity-${props.isOpen?'100':'0'}`}>{props.title}</h5></button>
  )
}
export default Sidebar;

