import './App.css';
import { AppRoute } from './components/route';
import Notification from './notifikasi/notifikasi';
import { message } from 'antd';
function App() {
  message.config({
    duration: 1,
    maxCount: 1,
  });
  return (
    <>
    <Notification/>
    <AppRoute/>
    </>
  );
}

export default App;
