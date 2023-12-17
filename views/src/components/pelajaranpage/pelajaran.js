import React, { useState, useEffect } from "react";
import { Statistic, message, Skeleton, Image } from "antd";
import axios from "axios"; // Import Axios
import { AnswerOption } from "./component/answeroption";
import './style.css';
import { ResourceLink } from "../../config";
import { RightSidebar } from "./component/sidebar";
import { LoadingOutlined } from "@ant-design/icons";
const { Countdown } = Statistic;

export function HalamanUjian() {
  const [submitTime, setSubmitTime] = useState(1);
  const [idPelajaran, setIdPelajaran] = useState(1)
  const [fontSize, setFontSize] = useState(5);
  const [current, setCurrent] = useState(0);
  const [isEditMode, setisEditMode] = useState(false);
  const [soalList, setSoalList] = useState([]); // Menyimpan daftar soal
  const [loading, setLoading] = useState(true);
  const [jawaban, setJawaban] = useState([]);
  const [namaUjian, setNamaUjian] = useState();
  const [done, setDone] = useState(false);
  const [deadline, setDeadline] = useState();
  const dataUser = JSON.parse(localStorage.getItem('user'));
  const modeBuatKunjaw = dataUser.role === 'guru';
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
  
    // Simpan jawaban di localStorage
    localStorage.setItem('jawaban', JSON.stringify(updatedJawaban));
  };
  const onFinish = () => {
    setDone(true);
     // Buat variabel untuk menyimpan jawaban dalam format JSON
     const collectedJawaban = [];

     // Iterasi melalui array soalList
     for (let i = 0; i < soalList.length; i++) {
       const jawabanValue = jawaban[i] || ''; // Menggunakan jawaban yang ada, atau string kosong jika tidak ada
       const pertanyaanText = soalList[i].pertanyaan; // Tekst pertanyaan
       const chosenAnswerText = soalList[i].pilihan.find(pilihan => pilihan.id === jawabanValue)?.text || ''; // Text of the chosen answer
 
       // JSON object yang berisi pertanyaan, jawaban, dan teks jawaban yang dipilih
       const jawabanObject = {
         pertanyaan: pertanyaanText,
         jawaban: chosenAnswerText,
       };
 
       collectedJawaban.push(jawabanObject);
     }

    const dataJawaban = {
      username: dataUser.username,
      userId:dataUser.id,
      pelajaran:namaUjian,
      pelajaranId:idPelajaran,
      answer:collectedJawaban
    }
    const dataKunjaw = {
      pelajaranId:idPelajaran,
      answer:collectedJawaban
    }
    
    if(!modeBuatKunjaw)SendJawaban(dataJawaban);
    else SendKunjaw(dataKunjaw);
  };
  const SendKunjaw = async (data) => {
    try {
      // Periksa apakah data dengan ID yang sama sudah ada di server
      const existingData = await fetchDataWithId(data.pelajaranId);
  
      if (existingData) {
        // Jika data sudah ada, gunakan metode PUT
        await updateKunjaw(existingData.id, data);
        message.success("Berhasil Mengirimkan Kunci Jawaban (Update)").then(() => goBack());
        console.log('Kunci jawaban berhasil diupdate');
      } else {
        // Jika data belum ada, gunakan metode POST
        await postKunjaw(data);
        message.success("Berhasil Mengirimkan Kunci Jawaban (Create)").then(() => goBack());
        console.log('Kunci jawaban berhasil dibuat');
      }
    } catch (error) {
      console.error('Gagal mengirim kunci jawaban', error);
      message.error("Gagal Mengirim Kunci Jawaban");
    }
  };
  
  // Fungsi untuk mengambil data dengan ID tertentu dari server
  const fetchDataWithId = async (id) => {
    try {
      const response = await fetch(`${ResourceLink}/api/answer-key/${id}`);
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      return null;
    } catch (error) {
      console.error('Gagal mengambil data dengan ID tertentu', error);
      throw error;
    }
  };
  
  // Fungsi untuk mengirim data dengan metode POST
  const postKunjaw = async (data) => {
    try {
      const response = await fetch(`${ResourceLink}/api/answer-key`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Gagal membuat kunci jawaban');
      }
    } catch (error) {
      console.error('Gagal membuat kunci jawaban', error);
      throw error;
    }
  };
  
  // Fungsi untuk mengirim data dengan metode PUT
  const updateKunjaw = async (id, data) => {
    try {
      const response = await fetch(`${ResourceLink}/api/answer-key/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Gagal mengupdate kunci jawaban');
      }
    } catch (error) {
      console.error('Gagal mengupdate kunci jawaban', error);
      throw error;
    }
  };
  
  const SendJawaban = async (data) => {
    console.log('data yang dikirimkan' + JSON.stringify(data));
    try {
      const response = await fetch(`${ResourceLink}/api/student-answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      message.success("Berhasil Menyelesaikan Soal").then(() => goBack());
      console.log('berhasil dikirimkan');
    } catch (error) {
      console.error('Gagal mengirim jawaban', error);
    }
  };

  useEffect(() => {
    const subjectId = localStorage.getItem('idTugas');
    setIdPelajaran(subjectId);
    axios
      .get(`${ResourceLink}/api/subjects/${subjectId}`)
      .then((response) => {
        const data = response.data;
        const parsedQuestion = JSON.parse(data.questions);
        const jumlahSoal = parsedQuestion.length;
        const jawabanSementara = Array(jumlahSoal).fill('x');
        const soalSementara = Array(jumlahSoal).fill('kosong'); 
        const storedStartTime = localStorage.getItem('startTime');
        const storedJawaban = localStorage.getItem('jawaban');
        setSoalList(parsedQuestion);
        setJawaban(jawabanSementara);
        if (storedJawaban) {
          setJawaban(JSON.parse(storedJawaban));
        }
        if (storedStartTime) {
          setDeadline(parseInt(storedStartTime, 10) + 1000 * data.submissionDeadline * 60);
        } else {
          setDeadline(Date.now() + 1000 * data.submissionDeadline * 60);
          localStorage.setItem('startTime', Date.now()); // Simpan waktu awal di localStorage
        }
        console.log(localStorage.getItem('startTime') + ' vs ' + Date.now());
        if((submitTime) >= 0){
          setSubmitTime(data.submissionDeadline - 0.1);
        }else{
          onFinish();
        }
        setNamaUjian(data.name);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // message.error('soal ujian tidak ditemukan').then(() => goBack());
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
  return (
    <div className="appbg">
      <div className="">
        <div className="d-flex">
          <div className="p-5 container-fluid">
            <div className="border row p-5 text-start rounded-5 text-bg-light">
              <div className="fs-5 col">
                <p className="fs-6 badge fw-light mb-0 text-opacity-50 text-secondary">Nama Ujian</p>
                <div className="fs-4">
                <span className="p-2">{namaUjian}</span> |{" "}
                <span className="p-2">{current + 1}</span>
                </div>
              </div>
              <div className="col-3 col-lg-2">
              {modeBuatKunjaw?(<h5 className="text-center text-capitalize gradient1 text-light py-2 rounded-3">buat kunci jawaban</h5>):(<Countdown title="waktu tersisa" value={deadline} onFinish={onFinish} />)}
              </div>
              <hr className="mt-4 mb-4" />
              {loading ? (
                <Skeleton/>
              ) :(<div>
                <ImageUrl width={500} src={`${ResourceLink}/download?filePath=/uploads/${idPelajaran}/${current + 1}/question.png`}/>
                <p
                className={`col danger-html pt-3 pb-3 fs-${fontSize}`}
                dangerouslySetInnerHTML={{ __html: soalList[current].pertanyaan }}
              />
              </div>
              )}
              <div className={`row mt-5 align-items-stretch g-4`}>
                {!loading ? 
                (
                  
                  soalList[current].pilihan.map((pilihan, index) => (
                    <AnswerOption
                      isEditMode={isEditMode}
                      no={pilihan.id}
                      src={`${ResourceLink}/download?filePath=/uploads/${idPelajaran}/${current + 1}/answer${index}.png`}
                      fs={fontSize}
                      isi={pilihan.text}
                      key={index}
                      jawaban={jawaban[current]}
                      onChange={handleJawabanChange}
                    />
                  ))
                  
                ) : (
                  <p><LoadingOutlined className="me-2"/>Loading pilihan jawaban</p> // Tampilkan pesan loading jika sedang dalam proses loading
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
            done={done}
            modeBuatKunjaw={modeBuatKunjaw}
          />
        </div>
      </div>
    </div>
  );
}

async function isImageAvailable(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok && response.headers.get('Content-Type').startsWith('image');
  } catch (error) {
    return false;
  }
}

export const ImageUrl = (props) => {
  const { src, width } = props;
  const [isValidImage, setIsValidImage] = useState(false);

  useEffect(() => {
    const checkImageValidity = async () => {
      if (src) {
        const valid = await isImageAvailable(src);
        setIsValidImage(valid);
      }
    };

    checkImageValidity();
  }, [src]);

  return (
    <>
      {isValidImage ? <Image width={width} src={src} /> : null}
    </>
  );
};
