import React, { useState } from 'react';
import Navbar from './navbar';
import Sidebar from './sidebar';
import './style.css'; // Import file CSS untuk styling

export function MainPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="App">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      {/* Content area */}
    </div>
  );
}
