import React, { useState, useEffect } from "react";
import { Statistic } from "antd";
import axios from "axios"; // Import Axios
import { AnswerOption } from "./component/answeroption";
import './style.css'
import { RightSidebar } from "./component/sidebar";
const { Countdown } = Statistic;
const submitTime = 29.9;
const time = 30;
export function HalamanUjian() {

  const [deadline, setDeadline] = useState(() => {
    const storedDeadline = localStorage.getItem('deadline');
    if (storedDeadline) {
      return parseInt(storedDeadline, 10);
    } else {
      // Jika tidak ada nilai di localStorage, setel nilai awal di sini
      return Date.now() + 1000 * time * 60; // Contoh: 1 jam ke depan
    }
  });

  const [fontSize, setFontSize] = useState(5);
  const [current, setCurrent] = useState(0);
  const [isEditMode, setisEditMode] = useState(false);
  const [soalList, setSoalList] = useState([]); // Menyimpan daftar soal
  const [loading, setLoading] = useState(true);
  const [jawaban, setJawaban] = useState([]);
// Hitung jumlah soal yang telah dijawab
const jumlahSoalDijawab = jawaban.filter(j => j !== 'x').length;

// Hitung persentase progres berdasarkan jumlah soal yang telah dijawab dan jumlah total soal
const persentaseProgres = (jumlahSoalDijawab / soalList.length) * 100;
const [visibleSteps, setVisibleSteps] = useState(Array(soalList.length).fill(false));
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
                <p className="fs-6 badge fw-light mb-0 text-opacity-50 text-secondary">Nama Ujian</p>
                <div className="fs-4">
                <span className="p-2">Nama Pelajaran</span> |{" "}
                <span className="p-2">{current + 1}</span>
                <button className="btn btn-outline-primary border"
                  onClick={() => {
                    // Mengubah nilai deadline menjadi waktu saat ini
                    const newDeadline = Date.now() + 1000 * time * 60;
                    setDeadline(newDeadline);

                    // Simpan nilai baru ke localStorage
                    localStorage.setItem('deadline', newDeadline.toString());
                    window.location.reload()
                  }}
                >
                  Reset Timer
                </button>
                </div>
              </div>
              <div className="col-1">
              <Countdown title="waktu tersisa" value={deadline} onFinish={onFinish} />
              </div>
              <hr className="mt-4 mb-4" />
              {loading ? (
                <p>Loading...</p>
              ) :(<p className={`pt-3 pb-3 fs-` + fontSize}>{soalList[current].pertanyaan}</p>)}
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
                {current !== 0 ?(
                  <button className="btn border border-primary border-opacity-25 btn-outline-primary p-2 rounded-pill col-5 col-md-2" onClick={prev}>
                  <i className="fa fa-arrow-left p-2" />
                  Kembali
                </button>
                ):''}
                <div className="col"></div>
                {current < soalList.length -1?(
                  <button className={`btn border border-primary border-opacity-25 btn-outline-primary p-2 rounded-pill col-5 col-md-2`} onClick={next}>
                  Selanjutnya
                  <i className={`fa fa-arrow-right p-2`} />
                </button>
                ): (
                <button className={`btn border border-primary border-opacity-25 btn-outline-primary p-2 rounded-pill col-5 col-md-2`} onClick={() => onChange(0)}>
                  kembali ke awal
                  <i className={`fa fa-arrow-up p-2`} />
                </button>
                )}
              </div>
            </div>
          </div>
          <RightSidebar
            fontSize={fontSize}
            current={current}
            soalList={soalList}
            jawaban={jawaban}
            toggleEditMode={toggleEditMode}
            handleJawabanChange={handleJawabanChange}
            next={next}
            prev={prev}
            persentaseProgres={persentaseProgres}
            submitTime={submitTime}
            deadline={deadline}
            toggleStepVisibility={toggleStepVisibility}
            visibleSteps={visibleSteps}
            handleFontSizeChange={handleFontSizeChange}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
}
