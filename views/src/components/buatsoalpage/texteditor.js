// texteditor.jsx

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Gaya standar Snow theme
import './style.css'
import { Upload } from 'antd';

const TextEditor = ({ value, onChange }) => {
  
  return (
    <>
    <ReactQuill
      theme="snow" // Tema Snow
      value={value}
      onChange={onChange}
      style={{fontSize:'large'}}
      modules={{
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
        ],
      }}
    />
    <Upload>
    </Upload></>
  );
};

export default TextEditor;
