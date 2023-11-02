import React, {useState} from "react";
import { Image } from "antd";
import Sidebar from "../mainpage/sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import {Steps} from "antd";
import './style.css'
import { FontSizeChanger } from "./fontSizeChanger";
const { Step } = Steps;
export function HalamanUjian(){
  const [fontSize, setFontSize] = useState(5);
  const [current, setCurrent] = useState(0);
  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  const onChange = (value) => {
    console.log('onChange:', value);
    setCurrent(value);
  };

  const handleFontSizeChange = (event) => {
    const selectedFontSize = parseInt(event.target.value);
    setFontSize(selectedFontSize);
  };

    return(
        <div className="appbg">
          <div className="d-flex align-items-center text-end justify-content-end">
          <div className="row w-100 ">
            <div className="col p-5">
              <div className="border p-5 text-start rounded-5 text-bg-light ">
                <div className='fs-5'><span className="p-2">Nama Pelajaran</span> | <span className="p-2">01</span></div>
                <hr className="mt-4 mb-4"/>
              <p className={`pt-3 pb-3 fs-`+fontSize}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi in velit at aut tempore facere fuga maxime asperiores expedita autem temporibus minus laudantium eum praesentium vero, amet laborum fugiat reiciendis!
              </p>
              <div className={`row mt-5 align-items-stretch g-4`}>
                <AnswerOption no='1' fs={fontSize} isi='Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi in velit at aut tempore facere fuga maxime asperiores expedita autem temporibus minus laudantium eum praesentium vero, amet laborum fugiat reiciendis!'/>
                <AnswerOption no='2' fs={fontSize} isi='jawaban kedua'/>
                <AnswerOption no='3' fs={fontSize} isi='jawaban lain'/>
                <AnswerOption no='4' fs={fontSize} isi="teks awal (gambar=https://miro.medium.com/v2/resize:fit:2000/1*ds4zdN5glMQOsPrGrLUPMA.png) teks akhir"/>
              </div>
              <hr className="mt-5"/>
              <div className="row mt-4 p-2">
                <button className="btn btn-primary p-2 rounded-pill col-2" onClick={prev}><i className="fa fa-arrow-left p-2"/>kembali</button>
                <div className="col"></div>
                <button className="btn btn-primary p-2 rounded-pill col-2" onClick={next}>Selanjutnya<i className="fa fa-arrow-right p-2"/></button>
              </div>
              </div>
            </div>
            <div className="col-2 gradient2 text-light text-center h100vh rsidebar">
            <h5 className="p-4 mt-5">A list</h5>
            <FontSizeChanger fontSize={fontSize} handleFontSizeChange={handleFontSizeChange}/>
            <div className="p-3 mt-5 overflow-y-scroll text-light h-50 rounded-5 list-soal ">
            <Steps
            current={current}
            onChange={onChange}
            direction='vertical'
            className="p-4"
            >
              <Step title="Langkah 1" />
              <Step title="Langkah 2"/>
              <Step title="Langkah 3" />
              <Step title="Langkah 1" />
              <Step title="Langkah 2"/>
              <Step title="Langkah 3" />
              <Step title="Langkah 1" />
              <Step title="Langkah 2"/>
              <Step title="Langkah 3" />
              <Step title="Langkah 1" />
              <Step title="Langkah 2"/>
              <Step title="Langkah 3" />
              <Step title="Langkah 1" />
              <Step title="Langkah 2"/>
              <Step title="Langkah 3" />
              <Soal/>
            </Steps>
            </div>
            </div>
          </div>
          </div>
        </div>
    )
}
function Soal(){
  return (<Step title='Langkah 1'/>)
}

function AnswerOption(props) {
  const renderContentWithImage = (isi) => {
    const regex = /\(gambar=(.*?)\)/g; // Mencari tanda "(gambar=...)"
    const matches = isi.split(regex); // Membagi isi berdasarkan tanda

    return matches.map((part, index) => {
      if (part.match(regex)) {
        // Jika bagian ini adalah tanda "(gambar=...)"
        const imgUrl = part.replace(/\(gambar=/, '').replace(')', ''); // Mendapatkan URL gambar
        return <Image key={index} src={imgUrl} />; // Menggunakan komponen Image dari antd
      } else {
        // Jika bukan tanda "(gambar=...)"
        return <span key={index}>{part}</span>; // Menampilkan teks biasa
      }
    });
  };

  return (
    <div className="col-md-3 d-flex">
      <input type="radio" className="btn-check" name="options" id={`option` + props.no} autoComplete="off" />
      <label htmlFor={`option` + props.no} className="p-4 border rounded-5 btn btn-outline-primary answer-button d-flex flex-column align-items-center justify-content-center w-100">
        <div className={`col-content fs-${props.fs}`}>
          {renderContentWithImage(props.isi)}
        </div>
      </label>
    </div>
  );
}

export default AnswerOption;
