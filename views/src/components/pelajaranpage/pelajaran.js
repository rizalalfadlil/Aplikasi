import React, { useState, useEffect } from "react";
import { Steps, ConfigProvider, Statistic, Progress, Tooltip, Popover } from "antd";
import axios from "axios"; // Import Axios
import RichTextEditor from "./texteditor";
import { FontSizeChanger } from "./fontSizeChanger";
import { calculateCountdown } from "./component/countDown";
import './style.css'
const { Step } = Steps;
const { Countdown } = Statistic;

const deadline = Date.now() + 1000 * 3 * 60;
const submitTime = 2.9;
const gradient = { '0%': 'rgb(0, 108, 196)', '100%': '#153ec5' };
export function HalamanUjian() {
  const [fontSize, setFontSize] = useState(5);
  const [current, setCurrent] = useState(0);
  const [isEditMode, setisEditMode] = useState(false);
  const [soalList, setSoalList] = useState([]); // Menyimpan daftar soal
  const [loading, setLoading] = useState(true);
  const [jawaban, setJawaban] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [semuaSoalSelesai, setSemuaSoalSelesai] = useState(false);
  const [waktuTungguTerlewati, setWaktuTungguterlewati] = useState(false);
// Hitung jumlah soal yang telah dijawab
const jumlahSoalDijawab = jawaban.filter(j => j !== 'x').length;

// Hitung persentase progres berdasarkan jumlah soal yang telah dijawab dan jumlah total soal
const persentaseProgres = (jumlahSoalDijawab / soalList.length) * 100;
const waitTime = () =>{
  setWaktuTungguterlewati(true);
}
const allDone = () =>{
  setSemuaSoalSelesai(true);
}
const [visibleSteps, setVisibleSteps] = useState(Array(soalList.length).fill(false));
const unlockSubmit = (
  <>
    <h6 className="mb-2">Syarat Penyelesaian</h6>
    <ul>
      {persentaseProgres < 100 && (
        <li>
          Selesaikan Semua Soal
          <Progress percent={persentaseProgres} />
        </li>
      )}
      {!waktuTungguTerlewati && (
        <li>
          Tunggu hingga
          <ConfigProvider
            theme={{
              token: {
                fontSize: 8
              }
            }}
          >
            <Countdown value={deadline - (submitTime * 1000 * 60)} onFinish={waitTime} />
          </ConfigProvider>
        </li>
      )}
    </ul>
  </>
);


  const toggleStepVisibility = (index) => {
    const newVisibleSteps = [...visibleSteps];
    newVisibleSteps[index] = true;
    setVisibleSteps(newVisibleSteps);
  };

  const handleJawabanChange = (selectedJawaban) => {
    const updatedJawaban = [...jawaban];
    updatedJawaban[current] = selectedJawaban;
    setJawaban(updatedJawaban);
    console.log(jawaban);
  };
  const onFinish = () => {
    console.log('finished!');
  };
  useEffect(() => {
    // Mengambil data soal dari "localhost:8000/contoh-soal"
    axios
      .get("http://localhost:8000/api/contoh-soal")
      .then((response) => {
        const jumlahSoal = response.data.length;
        const jawabanSementara = Array(jumlahSoal).fill('x');
        const soalSementara = Array(jumlahSoal).fill('kosong');
        setSoalList(response.data);
        setJawaban(jawabanSementara);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  
  const next = () => {
    if (current < soalList.length - 1) {
      setCurrent(current + 1);
    } else {
      // Buat variabel untuk menyimpan jawaban
      const collectedJawaban = [];
      
      // Iterasi melalui array soalList
      for (let i = 0; i < soalList.length; i++) {
        const jawabanIndex = i;
        const jawabanValue = jawaban[i] || ''; // Menggunakan jawaban yang ada, atau string kosong jika tidak ada
        
        // Contoh format nomor jawaban: 1.A
        const nomorJawaban = (i + 1) + '.' + jawabanValue;
  
        collectedJawaban.push(nomorJawaban);
      }
      
      // Tampilkan hasilnya di console.log
      console.log("Jawaban yang dikumpulkan:", collectedJawaban);
    }
  };
  
  const prev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };
  
  const onChange = (value) => {
    setCurrent(value);
  };

  const handleFontSizeChange = (event) => {
    const selectedFontSize = parseInt(event.target.value);
    setFontSize(selectedFontSize);
  };

  const toggleEditMode = () => {
    setisEditMode(!isEditMode);
  };

  return (
    <div className="appbg">
      <div className="d-flex align-items-center text-end justify-content-end">
        <div className="row w-100">
          <div className="col p-5">
            <div className="border row p-5 text-start rounded-5 text-bg-light">
              <div className="fs-5 col">
                <span className="p-2">Nama Pelajaran</span> |{" "}
                <span className="p-2">{current + 1}</span>
              </div>
              <div className="col-2">
              <Countdown title="waktu tersisa" value={deadline} onFinish={onFinish} />
              </div>
              <div className="col-1">
                <button
                  className={`bg-transparent text-primary border p-2 rounded-pill fa fa-` + (isEditMode ? `eye` : `pencil`)}
                  onClick={toggleEditMode}
                />
              </div>
              <hr className="mt-4 mb-4" />
              {loading ? (
                <p>Loading...</p>
              ) : isEditMode ? (
                <RichTextEditor />
              ) : (
                <p className={`pt-3 pb-3 fs-` + fontSize}>{soalList[current].pertanyaan}</p>
              )}
              <div className={`row mt-5 align-items-stretch g-4`}>
                {!loading ? ( // Tambahkan kondisi loading
                  soalList[current].pilihan_jawaban.map((pilihan, index) => (
                    <AnswerOption
                      isEditMode={isEditMode}
                      no={pilihan.id_pilihan}
                      fs={fontSize}
                      isi={pilihan.isi}
                      key={index}
                      jawaban={jawaban[current]}
                      onChange={handleJawabanChange}
                    />
                  ))
                ) : (
                  <p>Loading pilihan jawaban...</p> // Tampilkan pesan loading jika sedang dalam proses loading
                )}
              </div>

              <hr className="mt-5" />
              <div className="row mt-4 p-2">
                <button className="btn border border-primary border-opacity-25 btn-outline-primary p-2 rounded-pill col-5 col-md-2" onClick={prev}>
                  <i className="fa fa-arrow-left p-2" />
                  Kembali
                </button>
                <div className="col"></div>
                <Popover content={unlockSubmit} zIndex={(current < soalList.length -1) || (waktuTungguTerlewati && persentaseProgres === 100)?-1070:1070}>
                {current < soalList.length -1?(
                  <button className={`btn border border-primary border-opacity-25 btn-outline-primary p-2 rounded-pill col-5 col-md-2`} onClick={next}>
                  Selanjutnya
                  <i className={`fa fa-arrow-right p-2`} />
                </button>
                ):
                  waktuTungguTerlewati && persentaseProgres === 100 ?(
                    <button
                        className={`btn border border-primary border-opacity-25 btn-outline-primary p-2 rounded-pill col-5 col-md-2`}
                      >
                        Selesai
                        <i className={`fa fa-check p-2`} />
                      </button>
                  ):( 
                      <button
                        className={`btn border border-primary border-opacity-25 btn-outline-secondary p-2 rounded-pill col-5 col-md-2`}
                      >
                        Selesai
                        <i className={`fa fa-lock p-2`} />
                      </button>
                  
                  )}
                </Popover>
              </div>
            </div>
          </div>
          <div className={`col-2 gradient2 text-light text-start d-none d-md-block h100vh rsidebar fs-${fontSize}`}>
            <h5 className="p-4 mt-5 text-center">menu</h5>
            <div className=" p-5 pb-0 pt-0">
            <FontSizeChanger fontSize={fontSize} handleFontSizeChange={handleFontSizeChange}/>
            </div>
            <p className="p-5 pb-0">daftar soal</p>
            <div className="p-3 pt-0 overflow-y-scroll text-light h-50 rounded-5 list-soal">
              <ConfigProvider
               theme={{
                token: {
                  // Seed Token
                  colorText:'white',
                  colorTextLabel:'white',
                  colorTextDescription:'rgba(255, 255, 255, 0.226)',

                },
              }}
              >
              <Steps current={current} onChange={onChange} direction="vertical" className="p-4 pb-0">
                {soalList.map((soal, index) => {
                  const isFinished = jawaban[index] !== undefined && jawaban[index] !== "x";
                  const stepStatus = isFinished ? "finish" : index === current ? "process" : "wait";
                  const stepTitle = isFinished ? soalList[index].pertanyaan : visibleSteps[index] ? soalList[index].pertanyaan : "???";

                  if (!visibleSteps[index] && stepStatus === "process") {
                    toggleStepVisibility(index);
                  }

                  return (
                        <Step
                        key={index}
                        title={stepTitle}
                        className="pilihan-jawaban text-nowrap overflow-hidden"
                        status={stepStatus}
                      />
                  );
                })}
              </Steps>
              </ConfigProvider>
            </div>
            <div className="p-5 pt-2">
              <p>Progress Penyelesaian</p>
            <ConfigProvider
               theme={{
                token: {
                  // Seed Token
                  colorText:'white',

                },
              }}
              >
              <Progress percent={(persentaseProgres)} strokeColor={gradient} size={[180, 15]}/>
            </ConfigProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnswerOption(props) {
  const handleOptionChange = () => {
    if (props.onChange) {
      props.onChange(props.no); // Mengirimkan jawaban terpilih ke komponen induk
    }
  };

  return (
    <div className={`col-md-${props.isEditMode?'12':'3'} d-flex`}>
      {props.isEditMode?
      (
        <div className="border border-primary p-2 rounded-5 w-100">
          <RichTextEditor/>
        </div>
      )
      :
      (
       <>
        <input type="radio" className="btn-check" name="options" id={`option` + props.no} autoComplete="off" checked={props.no === props.jawaban} onChange={handleOptionChange}/>
          <label htmlFor={`option` + props.no} className="p-4 border rounded-5 btn btn-outline-primary answer-button d-flex flex-column align-items-center justify-content-center w-100">
            <div className={`col-content fs-${props.fs}`}>
              {props.isi}
            </div>
          </label>
        </>
      )
      }
    </div>
  );
}
const unlockSubmit =  (
  <ul>
    <li>Selesaikan Semua Soal
    <Progress percent={10} strokeColor={gradient} size={[180, 15]}/>
    </li>
    <li>Tunggu hingga 
      <ConfigProvider
        theme={{
          token: {
            fontSize:8
          },
        }}
      >
      <Countdown value={deadline - (submitTime * 1000 * 60)}/>
      </ConfigProvider>
    </li>
  </ul>
);
