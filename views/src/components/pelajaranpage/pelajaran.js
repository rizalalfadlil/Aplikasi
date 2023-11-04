import React, { useState, useEffect } from "react";
import { Steps, ConfigProvider, Statistic, Progress, Tooltip } from "antd";
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
  const [countdown, setCountdown] = useState(calculateCountdown(deadline));
  const [isDisabled, setIsDisabled] = useState(true);
// Hitung jumlah soal yang telah dijawab
const jumlahSoalDijawab = jawaban.filter(j => j !== 'x').length;

// Hitung persentase progres berdasarkan jumlah soal yang telah dijawab dan jumlah total soal
const persentaseProgres = (jumlahSoalDijawab / soalList.length) * 100;

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
        setSoalList(response.data);
        setJawaban(jawabanSementara);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateCountdown(deadline - (submitTime * 1000 * 60)));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [deadline]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      } else {
        setIsDisabled(false); // Menghilangkan atribut disabled saat waktu habis
        clearInterval(timer); // Memberhentikan interval
      }
    }, 1000); // Update setiap 1 detik

    return () => {
      clearInterval(timer); // Membersihkan interval saat komponen dibongkar
    };
  }, [countdown]);
  
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
                {current < soalList.length -1?(
                  <button className={`btn border border-primary border-opacity-25 btn-outline-primary p-2 rounded-pill col-5 col-md-2`} onClick={next}>
                  Selanjutnya
                  <i className={`fa fa-arrow-right p-2`} />
                </button>
                ):(
                  <Tooltip title={`Tombol ini akan terbuka dalam ${countdown} detik`} fresh>
                    <button
                      className={`btn border border-primary border-opacity-25 btn-outline-primary p-2 rounded-pill col-5 col-md-2 ${isDisabled ? "disabled" : ""}`}
                    >
                      Selesai
                      <i className={`fa fa-check p-2`} />
                    </button>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
          <div className="col-2 gradient2 text-light text-center d-none d-md-block h100vh rsidebar">
            <h5 className="p-4 mt-5">A list</h5>
            <FontSizeChanger fontSize={fontSize} handleFontSizeChange={handleFontSizeChange} />
            <div className="p-3 mt-5 overflow-y-scroll text-light h-50 rounded-5 list-soal">
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
              <Steps current={current} onChange={onChange} direction="vertical" className="p-4">
                {soalList.map((soal, index) => {
                  const isFinished = jawaban[index] !== undefined && jawaban[index] !== "x"; // Periksa apakah ada jawaban yang terkait dengan langkah ini
                  const stepStatus = isFinished ? "finish" : index === current ? "process" : "wait"; // Set status sesuai dengan kondisi
                  return (
                    <Step
                      key={index}
                      title={soalList[index].pertanyaan}
                      className="pilihan-jawaban text-nowrap overflow-hidden"
                      status={stepStatus}
                    />
                  );
                })}
              </Steps>
              </ConfigProvider>
            </div>
            <div className="p-5">
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

