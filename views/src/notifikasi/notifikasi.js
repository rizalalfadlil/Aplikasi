import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Notification({ message, type }){

  return (
    <div className='w-100 d-flex align-items-center text-center justify-content-center position-absolute notification'>
      <div className={`alert alert-${type} text-center alert-dismissible fade show`} role="alert">
          {message}
          <button
            type="button"
            className='bg-transparent'
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
    </div>
  );
};
export default Notification;

