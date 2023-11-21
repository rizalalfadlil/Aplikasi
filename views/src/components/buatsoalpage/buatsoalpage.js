import React, { useState, useEffect } from "react";
import { DatePicker, Popconfirm, message, Pagination, InputNumber } from "antd";
import TextEditor from "./texteditor";
import Sidebar from "../mainpage/sidebar";
import axios from "axios";
import { ResourceLink } from "../../config";

export const BuatSoal = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [jumlahPilihan, setJumlahPilihan] = useState(4);
  const [judul, setJudul] = useState(null);
  const [idUjian, setIdUjian] = useState(0);
  const [namaUjian, setNamaUjian] = useState('????');
  const [startTime, setStartTime] = useState(null);
  const [deadline, setDeadline] = useState('???');
  const [soalList, setSoalList] = useState([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const soalPerPage = 5; // Jumlah soal per halaman
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * soalPerPage;
  const endIndex = startIndex + soalPerPage;
  const displayedSoal = soalList.slice(startIndex, endIndex);
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
  const hapusSoal = (id) => {
    const newSoalList = soalList.filter((soal) => soal.id !== id);
    setSoalList(newSoalList);
    setCurrentPage(Math.ceil(newSoalList.length / soalPerPage));
  };

  useEffect(() => {
    const soal = localStorage.getItem('soal');
  if(soal){
    const parsedSoal = JSON.parse(soal);
    setIdUjian(parsedSoal.id);
    setNamaUjian(parsedSoal.title);
    const idTugas = localStorage.getItem('idTugas');
    if(idTugas){
        axios
          .get(`${ResourceLink}/api/subjects/${idTugas}`)
          .then((response) => {
            const data = JSON.stringify(response)
            const parsedData = JSON.parse(data)
            const dataUjian = parsedData.data;
            console.log(dataUjian);
            setJudul(dataUjian.name);
          })
          .catch((error) => { 
            console.error("Error fetching data:", error);
          });
      console.log('soal lama');
    }else{
      console.log('soal baru');
    }
  }else{
    message.error('data soal tidak ditemukan, pastikan untuk membuka halaman ini dari tombol tambahkan pelajaran di halaman utama!').then(() => goBack());
  }

  }, []);
const goBack = () =>{
  window.location.href = '/';
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
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }else if(!judul)message.warning('isi judul terlebih dahulu!');
   else if(!startTime)message.warning('isi waktu mulai terlebih dahulu');
};

  
  return (
    <div className="d-flex">
      <Sidebar/>
      <div className="container border mt-5 mb-5 h-25 rounded-5">
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
                    <input type="number" onChange={(event) => setDeadline(event.target.value)} className=" text-center form-control rounded-pill"/>
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
                <div className="mt-2 col-12"><hr/></div>
            </div>
      </div>
      <div>
        {displayedSoal.map((soal, soalIndex) => (
          <div className="border rounded-5 mt-3 p-4" key={soal.id}>
            <div className="row">
              <span className="p-3 col-11">No. {((currentPage - 1) * soalPerPage) + soalIndex + 1}</span>
              <button
                className="btn btn-outline-danger rounded-pill col border fa fa-times"
                onClick={() => hapusSoal(soal.id)}
              />
            </div>
            <hr />
            <TextEditor value={soal.pertanyaan} onChange={(value) => {
              const newSoalList = [...soalList];
              newSoalList[((currentPage - 1) * soalPerPage) + soalIndex].pertanyaan = value;
              setSoalList(newSoalList);
            }} />
            <hr />
            <span>Pilihan Jawaban</span>
            <div>
              {soal.pilihan.map((pilihan, pilihanIndex) => (
                <div className="border border-primary border-opacity-50 rounded-5 p-2 mt-3" key={pilihan.id}>
                  <TextEditor
                    value={pilihan.text}
                    onChange={(value) => {
                      const newSoalList = [...soalList];
                      newSoalList[((currentPage - 1) * soalPerPage) + soalIndex].pilihan[pilihanIndex].text = value;
                      setSoalList(newSoalList);
                    }}
                  />
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
          >
            Kirim
        </button>
        </div>
      </div>
    </div>
    </div>
  );
};
