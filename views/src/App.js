import './App.css';
import { AppRoute } from './components/route';
import { message } from 'antd';
function App() {
  message.config({
    duration: 1,
    maxCount: 1,
  });
  return (
    <AppRoute />
  );
}

export default App;
