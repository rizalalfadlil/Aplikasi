import React, { useState, useEffect } from "react";
import { Statistic, message } from "antd";
import axios from "axios"; // Import Axios
import { AnswerOption } from "./component/answeroption";
import './style.css';
import { ResourceLink } from "../../config";
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
  const [namaUjian, setNamaUjian] = useState();
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
  };
  const onFinish = () => {
    console.log('finished!');
    console.log(jawaban);
  };
  useEffect(() => {
    const subjectId = localStorage.getItem('idTugas'); // Ganti dengan ID mata pelajaran yang diinginkan
    // Mengambil data mata pelajaran dari "http://localhost:8000/api/subjects/:id"
    axios
      .get(`${ResourceLink}/api/subjects/${subjectId}`)
      .then((response) => {
        const data = response.data;
        const parsedQuestion = JSON.parse(data.questions)
        const jumlahSoal = parsedQuestion.length;
        const jawabanSementara = Array(jumlahSoal).fill('x');
        const soalSementara = Array(jumlahSoal).fill('kosong');
        setSoalList(parsedQuestion);
        setJawaban(jawabanSementara);
        setLoading(false);
        setNamaUjian(data.name)
        console.log(subjectId);
      })
      .catch((error) => { 
        console.error("Error fetching data:", error);
        message.error('soal ujian tidak ditemukan').then(() => goBack());
      });
  }, []);
  
  const goBack = () =>{
    window.location.href = '/';
  }

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
  const parsedPilihan = (pilihan) =>{
    return JSON.parse(pilihan);
  }
  return (
    <div className="appbg">
      <div className="d-flex align-items-center text-end justify-content-end">
        <div className="row w-100">
          <div className="col p-5">
            <div className="border row p-5 text-start rounded-5 text-bg-light">
              <div className="fs-5 col">
                <p className="fs-6 badge fw-light mb-0 text-opacity-50 text-secondary">Nama Ujian</p>
                <div className="fs-4">
                <span className="p-2">{namaUjian}</span> |{" "}
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
              ) :(<p
                className={`danger-html pt-3 pb-3 fs-${fontSize}`}
                dangerouslySetInnerHTML={{ __html: soalList[current].pertanyaan }}
              />)}
              <div className={`row mt-5 align-items-stretch g-4`}>
                {!loading ? 
                (
                  soalList[current].pilihan.map((pilihan, index) => (
                    <AnswerOption
                      isEditMode={isEditMode}
                      no={pilihan.id}
                      fs={fontSize}
                      isi={pilihan.text}
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
            onSubmit={onFinish}
          />
        </div>
      </div>
    </div>
  );
}
