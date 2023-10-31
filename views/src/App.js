import logo from './logo.svg';
import './App.css';
import Login from './components/loginpage/login';
import { MainPage } from './components/mainpage/main';
import { AppRoute } from './components/route';
import Notification from './notifikasi/notifikasi';
function App() {
  
  return (
    <>
    <Notification/>
    <AppRoute/>
    </>
  );
}

export default App;
