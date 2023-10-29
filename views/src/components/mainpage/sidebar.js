import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <div className={`text-light sidebar ${isOpen ? 'open' : ''}`}>
      <button className="navbar-toggler m-3" onClick={toggleSidebar}>
        ☰
      </button>
      <div className='pt-4'>
        <h1 className={`w-100 text-center opacity-${isOpen?'100':'0'}`}>Aplikasi</h1>
        <div className='list-group mt-5 bg-transparent text-center w-100 pt-5 p-2'>
          <button type="button" className={`list-group-item pt-3 rounded-pill text-light justify-content-center menu-item list-group-item-action d-flex`}><i className={`fa fa-user ${isOpen?'':'show-icon'}`}/><h5 className={`text-nowrap overflow-hidden opacity-${isOpen?'100':'0'}`}>button menu</h5></button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
