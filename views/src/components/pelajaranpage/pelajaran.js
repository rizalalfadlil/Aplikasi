import React, {useState} from "react";
import Sidebar from "../mainpage/sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
export function HalamanUjian(){
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
      };

    return(
        <div className="appbg">
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} openSidebar={setIsSidebarOpen} />
          <div className="d-flex align-items-center text-end justify-content-end">
          <div className="row w-100">
            <div className="col p-5">
              <div className="border p-5 mt-5 rounded">
                s
              </div>
            </div>
            <div className="col-2 gradient2 text-light text-center h100vh">
            <h5 className="p-4 mt-5">A list</h5>
            
            </div>
          </div>
          </div>
        </div>
    )
}