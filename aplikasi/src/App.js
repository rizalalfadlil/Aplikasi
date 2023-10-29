import React, { useState } from 'react';
import './App.css';
import Navbar from './component/Navbar';
import Sidebar from './component/Sidebar';

function App() {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="d-flex" id="wrapper">
      <Sidebar />
      <div id="page-content-wrapper">
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="container-fluid">
          <h1>Main Content</h1>
          <p>This is the main content of your page.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
