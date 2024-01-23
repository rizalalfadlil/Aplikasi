import React, { useState, useEffect } from "react";
import { DatePicker, Popconfirm, message, Pagination, InputNumber, Upload, Button, Tooltip} from "antd";
import { UploadOutlined, PlusOutlined, DownloadOutlined } from "@ant-design/icons";
import { LoadingOutlined } from "@ant-design/icons";
import TextEditor from "./texteditor";
import JSZip from 'jszip';
import Sidebar from "../mainpage/sidebar";
import axios from "axios";
import { ResourceLink } from "../../config";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import ImageUploader from "./imageUploader";
dayjs.extend(customParseFormat);

export const BuatSoal = () => {
  const [jumlahPilihan, setJumlahPilihan] = useState(4);
  const [judul, setJudul] = useState(null);
  const [idUjian, setIdUjian] = useState(0);
  const [idPelajaran, setIdPelajaran] = useState(0);
  const [namaUjian, setNamaUjian] = useState('????');
  const [startTime, setStartTime] = useState(null);
  const [isUpdate, setisUpdate] = useState(false);
  const [deadline, setDeadline] = useState();
  const [soalList, setSoalList] = useState([]);
  const [done, setDone] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const soalPerPage = 5; // Jumlah soal per halaman
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * soalPerPage;
  const endIndex = startIndex + soalPerPage;
  const displayedSoal = soalList.slice(startIndex, endIndex);

  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      const formData = new FormData();
      formData.append('zipFile', file);

      // Kirim file zip ke server
      const response = await axios.post(ResourceLink + '/upload-zip/' + idPelajaran, formData);
      console.log(response);
      const jsonFile = await extractJsonFromZip(file);
      const parsedSoalList = JSON.parse(jsonFile);
      const parsedPilihan = JSON.parse(parsedSoalList.questions);
      setSoalList(parsedPilihan);
      setJumlahPilihan(parsedPilihan[0].pilihan.length);
      confirm();
      onSuccess();
      message.success('File diunggah dan diproses dengan sukses!');
    } catch (error) {
      console.error('Error processing zip file:', error);
      onError(error);
      message.error('Terjadi kesalahan saat memproses file.');
    }
  };

  const extractJsonFromZip = async (zipFile) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (event) => {
        const zip = new JSZip();
        const zipContent = await zip.loadAsync(event.target.result);

        // Replace 'yourFile.json' with the actual file name in the zip
        const jsonContent = await zipContent.file('question.json').async('string');
        resolve(jsonContent);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(zipFile);
    });
  };
  useEffect(() => {
    const fetchData = async () => {
      const soal = localStorage.getItem('soal');
      if (soal) {
        const parsedSoal = JSON.parse(soal);
        setIdUjian(parsedSoal.id);
        setNamaUjian(parsedSoal.title);
        const idTugas = localStorage.getItem('idTugas');
        if (idTugas) {
          try {
            setisUpdate(true);
            const response = await axios.get(`${ResourceLink}/api/subjects/${idTugas}`);
            const dataUjian = response.data;
            console.log(dataUjian);
            setJudul(dataUjian.name);
            setDeadline(parseInt(dataUjian.submissionDeadline));
            setStartTime(dayjs(dataUjian.startTime));
            console.log(startTime);
            if (dataUjian.questions) {
              const soal = JSON.parse(dataUjian.questions);
              console.log(soal);
              setJumlahPilihan(soal[0].pilihan.length)
              confirm();
              setSoalList(soal);
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
          console.log('soal lama');
        } else {
          console.log('soal baru');
        }
      } else {
        message.error('data soal tidak ditemukan, pastikan untuk membuka halaman ini dari tombol tambahkan pelajaran di halaman utama!').then(() => goBack());
      }
    };
  
    fetchData();
  }, []); // Don't forget the dependency array
  
  useEffect(() => {
    const storedIdTugas = localStorage.getItem('idTugas');

    if (storedIdTugas) {
      // Jika idTugas sudah ada di localStorage, gunakan nilainya
      setIdPelajaran(storedIdTugas);
    } else {
      // Jika tidak, ambil data dari server untuk mendapatkan id tertinggi
      fetch(`${ResourceLink}/api/subjects`)
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            // Ambil id tertinggi dan tambahkan 1
            const highestId = Math.max(...data.map((subject) => subject.id));
            setIdPelajaran(highestId + 1);
          } else {
            // Jika tidak ada data, idTugas dijadikan 1
            setIdPelajaran(1);
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const tambahSoal = () => {
    if(isConfirmed){
        const newSoalList = [...soalList];
    const nextId = newSoalList.length + 1;
    const pilihanJawaban = Array.from({ length: jumlahPilihan }, (_, index) => {
      return { id: index + 1, text: "" };
    });
  
    newSoalList.push({
      id: nextId,
      pertanyaan: "",
      pilihan: pilihanJawaban,
    });
    setSoalList(newSoalList);
    setCurrentPage(Math.ceil(newSoalList.length / soalPerPage));
    }else{
        message.warning('Isi jumlah pilihan terlebih dahulu!');
    }
  };
  
const confirm = () =>{
  setIsConfirmed(true);
}
const hapusSoal = async (id) => {
  try {
    // Menghapus soal dari state lokal (client-side)
    const newSoalList = soalList.filter((soal) => soal.id !== id);
    setSoalList(newSoalList);
    setCurrentPage(Math.ceil(newSoalList.length / soalPerPage));

    // Mengirim permintaan ke server untuk menghapus folder terkait (server-side)
    const response = await fetch(`${ResourceLink}/delete-folder/${idPelajaran}/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      console.log('Folder dihapus di server.');
    } else {
      console.error('Gagal menghapus folder di server.', response);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};


const goBack = () =>{
  window.location.href = '/';
}
const exportPelajaran = async () => {
  const fileUrl =`${ResourceLink}/api/download-subjects/${idPelajaran}`;
  KirimSoal().then(window.open(fileUrl, '_blank'));
}
const KirimSoal = async () => {
  if(judul && startTime){
    try {
      const data = {
        name: judul,
        questions: soalList,
        startTime: startTime,
        submissionDeadline: deadline,
        examSessionId: idUjian.toString(),
      };
  
      console.log(data);

     if(!isUpdate){
      const apiUrl = (ResourceLink + "/api/subjects");
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();
      console.log("Data berhasil dikirim:", responseData);
      message.success("Berhasil Membuat Soal").then(() => goBack());
     }else{
      const idTugas = localStorage.getItem('idTugas');
      const apiUrl = (ResourceLink + "/api/subjects/" + idTugas);
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();
      console.log("Data berhasil dikirim:", responseData);
      setDone(true)
      message.success("Berhasil Memperbarui Soal").then(() => goBack());
     }

    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }else if(!judul)message.warning('isi judul terlebih dahulu!');
   else if(!startTime)message.warning('isi waktu mulai terlebih dahulu');
};

  
  return (
    <div className="d-flex">
      <Sidebar/>
      <div className="container border mt-5 mb-5 h-25 rounded-3">
      <div className="row">
      <h4 className="mt-5 mb-5">Buat Soal</h4>
            <div className="row">
                <div className="col-6">
                    <span className="p-2">Soal Untuk</span>
                    <input value={namaUjian} disabled className="text-center form-control rounded-pill"/>
                </div>
                <div className="col-3">
                <span className="p-2">id ujian</span>
                    <input value={idUjian} disabled className=" text-center form-control rounded-pill"/>
                </div>
                <div className="col-3">
                <span className="p-2">deadline(menit)</span>
                    <input type="number" onChange={(event) => setDeadline(event.target.value)} defaultValue={deadline} className=" text-center form-control rounded-pill"/>
                </div>
                <div className="col-9 mt-2">
                    <span className="p-2">Nama Pelajaran</span>
                    <input className="text-center border w-100 p-1 rounded-pill" defaultValue={judul} placeholder="masukkan judul" onChange={(event) => setJudul(event.target.value)}/>
                </div>
                <div className="col-3 mt-2">
                    <span className="p-2">Waktu Mulai</span>
                    <div className="border rounded-pill"><DatePicker showTime bordered={false} defaultValue={startTime} onChange={setStartTime} placeholder="pilih waktu mulai" className="w-100"/></div>
                </div>
                <div className="col-2 mt-3">
                    <span className="p-2">Jumlah Soal</span>
                    <input value={soalList.length} disabled className="text-center form-control rounded-pill"/>{/* sesuaikan dengan jumlah soal yang ada */}
                </div>
                <div className="col-2 mt-3">
                    <span className="p-2">Jumlah Pilihan</span>
                    <div className="d-flex">
                    {isConfirmed?(
                      <input value={jumlahPilihan} disabled className="text-center form-control rounded-pill"/>
                    ):
                    (
                      <>
                    <InputNumber
                      defaultValue={jumlahPilihan}
                      type="number"
                      onChange={setJumlahPilihan}
                      className={`text-center form-control bg-secondary bg-opacity-10 rounded-start-pill`}
                      style={{textAlign:'center'}}
                      size="small"
                  />
                    <Popconfirm
                    title='Konfirmasi Jumlah pilihan?'
                    description='setelah jumlah pilihan ditetapkan, tidak akan bisa diubah lagi'
                    okText='Ok'
                    cancelText='Batal'
                    onConfirm={confirm}>
                        <button className="btn btn-outline-primary rounded-end-pill border">Konfirmasi</button>
                    </Popconfirm>
                  </>
                    )}
                    </div>
                </div>
                <div className="col-2 mt-3">
                <span className="p-2">Import Soal</span>
                <Upload
                  customRequest={customRequest}
                  showUploadList={false}
                  action={`${ResourceLink}/upload-zip`}
                >
                  <Button type="primary" className="rounded-pill" icon={<UploadOutlined />}>Upload Soal</Button>
                </Upload>
                </div>
                <div className="mt-2 col-12"><hr/></div>
            </div>
      </div>
      <div>
        {displayedSoal.map((soal, soalIndex) => (
          <div className="border rounded-3 shadow-sm mt-3 p-4" key={soal.id}>
            <div className="row">
              <span className="p-3 col-11">No. {((currentPage - 1) * soalPerPage) + soalIndex + 1}</span>
              <button
                className="btn btn-outline-danger rounded-pill m-3 col border fa fa-times"
                onClick={() => hapusSoal(soal.id)}
              />
            </div>
            <hr />
            <div className="row">
            <div className="col-10">
            <TextEditor value={soal.pertanyaan} onChange={(value) => {
              const newSoalList = [...soalList];
              newSoalList[((currentPage - 1) * soalPerPage) + soalIndex].pertanyaan = value;
              setSoalList(newSoalList);
            }} />
            </div>
            <div className="col d-flex justify-content-end align-items-center">
            <ImageUploader action={ResourceLink + '/upload'} idPelajaran = {idPelajaran} noSoal={((currentPage - 1) * soalPerPage) + soalIndex + 1} fileName='question'/>
            </div>
            </div>
            <hr />
            <span>Pilihan Jawaban</span>
            <div>
              {soal.pilihan.map((pilihan, pilihanIndex) => (
                <div className="border shadow-sm rounded-3 p-2 mt-3 row" key={pilihan.id}>
                  <div className="col-10">
                  <TextEditor
                    value={pilihan.text}
                    onChange={(value) => {
                      const newSoalList = [...soalList];
                      newSoalList[((currentPage - 1) * soalPerPage) + soalIndex].pilihan[pilihanIndex].text = value;
                      setSoalList(newSoalList);
                    }}
                  />
                  </div>
                  <div className="col d-flex justify-content-end align-items-center">
                  <ImageUploader action={ResourceLink + '/upload'} idPelajaran = {idPelajaran} noSoal={((currentPage - 1) * soalPerPage) + soalIndex + 1} fileName={'answer' + pilihanIndex}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="w-100 justify-content-center d-flex mt-3">
        <Pagination
        current={currentPage}
        total={soalList.length} // Total jumlah soal
        pageSize={soalPerPage}
        onChange={handlePageChange}
        />

        </div>
        <div className="row p-3 gap-3">
        <button
            className={`col-2 btn btn-${isConfirmed?'primary':'secondary'} rounded-pill`}
            onClick={tambahSoal}
          >
            Tambah Soal
        </button>
        <button
            className={`col-2 btn btn-primary d-${isConfirmed && soalList.length > 0?'block':'none'} rounded-pill`}
            onClick={KirimSoal}
            disabled={done}
          >
            {isUpdate?'Perbarui':'Kirim'}
            {done && <LoadingOutlined className="ms-2"/>}
        </button>
        <Tooltip title='Export soal ke file zip'>
        <button
            className={`col-2 btn btn-${isConfirmed?'primary':'secondary'} rounded-pill`}
            onClick={exportPelajaran}
            disabled={judul === null || startTime === null}
          >
            Download <DownloadOutlined className="ms-2"/>
        </button>
        </Tooltip>
        </div>
      </div>
    </div>
    </div>
  );
};
