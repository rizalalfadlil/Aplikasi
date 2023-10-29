import React, { Component, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import 'font-awesome/css/font-awesome.min.css';
import { ListGroup } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
const Login = () => {
  return (
    <>
    <LoginComponent/>
    <HalfScreenOverlay/></>
  );
}

export default Login;
function LoginComponent(){
  return(
    <div className="form-box form-shape d-flex align-items-center justify-content-center">
        <div className='container form-box p-4'>
          <h2 className='mb-2'>login</h2>
          <form>
          <Input name="Username" type="text" icon='user'/>
          <Input name="Password" type="password" icon='lock'/>
              <button type="submit" className="btn text-white shadow-sm mt-5 w-100 p-3 rounded-pill gradient1" formAction='#' formMethod='get'>Login</button>
            </form>
        </div>
      </div>
  )

}
const Input = (props) =>{
  return(
    <div className="form-group">
       <label className='mb-2 mt-2'>{props.name}</label>
        <ListGroup horizontal>
          <ListGroup.Item className='bg-body-tertiary rounded-start-pill'>
            <i className={`fa fa-`+props.icon}/>
          </ListGroup.Item>
          <ListGroup.Item className='w-100 bg-body-tertiary rounded-end-pill'>
          <input
                  type={props.type}
                  name={props.name}
                  className='w-100 bg-body-tertiary'
                />
          </ListGroup.Item>
        </ListGroup>
    </div>
  )
}
const HalfScreenOverlay = () => {
  return (
    <div
      className={`half-screen-overlay align-items-center text-white justify-content-center d-flex shifted gradient1`}
    >
      <div>
      <h1 className='mb-4'>Aplikasi</h1>
      </div>
    </div>
  );
};

