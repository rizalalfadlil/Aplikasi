import React, { useState } from "react";
import { DatePicker, Popconfirm, message, Pagination, InputNumber } from "antd";
import RichTextEditor from "./texteditor";
import Sidebar from "../mainpage/sidebar";

export const BuatSoal = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [jumlahPilihan, setJumlahPilihan] = useState(4);
  const [soalList, setSoalList] = useState([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const soalPerPage = 3; // Jumlah soal per halaman
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * soalPerPage;
  const endIndex = startIndex + soalPerPage;
  const displayedSoal = soalList.slice(startIndex, endIndex);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
  };

  const tambahPilihan = (soalId) => {
    const newSoalList = [...soalList];
    const soalIndex = newSoalList.findIndex((soal) => soal.id === soalId);
    const soal = newSoalList[soalIndex];
    const nextPilihanId = soal.pilihan.length + 1;
    soal.pilihan.push({ id: nextPilihanId, text: "" });
    setSoalList(newSoalList);
  };

  const hapusPilihan = (soalId, pilihanId) => {
    const newSoalList = [...soalList];
    const soalIndex = newSoalList.findIndex((soal) => soal.id === soalId);
    const soal = newSoalList[soalIndex];
    soal.pilihan = soal.pilihan.filter((pilihan) => pilihan.id !== pilihanId);
    setSoalList(newSoalList);
  };
const showSoalList = () =>{
    console.log(soalList);
}
  return (
    <div className="container border mt-5 rounded-5">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} openSidebar={setIsSidebarOpen} />
      <div className="row">
      <h4 className="mt-5 mb-5">Buat Soal</h4>
      <button onClick={showSoalList}>show</button>
            <div className="row">
                <div className="col-9">
                    <span className="p-2">Soal Untuk</span>
                    <input value='ujian 1' disabled className="text-center form-control rounded-pill"/>
                </div>
                <div className="col-3">
                <span className="p-2">id ujian</span>
                    <input value='01' disabled className=" text-center form-control rounded-pill"/>
                </div>
                <div className="col-9 mt-2">
                    <span className="p-2">Nama Pelajaran</span>
                    <input className="text-center border w-100 p-1 rounded-pill" placeholder="masukkan judul"/>
                </div>
                <div className="col-3 mt-2">
                    <span className="p-2">Waktu Mulai</span>
                    <div className="border rounded-pill"><DatePicker showTime bordered={false} placeholder="pilih waktu mulai" className="w-100"/></div>
                </div>
                <div className="col-2 mt-3">
                    <span className="p-2">Jumlah Soal</span>
                    <input value={soalList.length} disabled className="text-center form-control rounded-pill"/>{/* sesuaikan dengan jumlah soal yang ada */}
                </div>
                <div className="col-2 mt-3">
                    <span className="p-2">Jumlah Pilihan</span>
                    <div className="d-flex">
                    <InputNumber
                        defaultValue={jumlahPilihan}
                        type="number"
                        onChange={setJumlahPilihan}
                        className={`text-center form-control bg-secondary bg-opacity-10 rounded-${isConfirmed?'':'start-'}pill`}
                        disabled={isConfirmed}
                        size="small"
                    />
                    {isConfirmed?'':
                    (
                    <Popconfirm
                    title='Konfirmasi Jumlah pilihan?'
                    description='setelah jumlah pilihan ditetapkan, tidak akan bisa diubah lagi'
                    okText='Ok'
                    cancelText='Batal'
                    onConfirm={confirm}>
                        <button className="btn btn-outline-primary rounded-end-pill border">Konfirmasi</button>
                    </Popconfirm>
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
            <RichTextEditor value={soal.pertanyaan} onChange={(value) => {
              const newSoalList = [...soalList];
              newSoalList[((currentPage - 1) * soalPerPage) + soalIndex + 1].pertanyaan = value;
              setSoalList(newSoalList);
            }} />
            <hr />
            <span>Pilihan Jawaban (masukkan jawaban yang benar di pilihan berwarna biru)</span>
            <div>
              {soal.pilihan.map((pilihan, pilihanIndex) => (
                <div className="border border-primary border-opacity-50 rounded-5 p-2 mt-3" key={pilihan.id}>
                  <RichTextEditor
                    value={pilihan.text}
                    onChange={(value) => {
                      const newSoalList = [...soalList];
                      newSoalList[((currentPage - 1) * soalPerPage) + soalIndex + 1].pilihan[pilihanIndex].text = value;
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
        <button
            className={`btn btn-${isConfirmed?'primary':'secondary'} p-2 mt-4 mb-4 w-100 rounded-pill`}
            onClick={tambahSoal}
          >
            Tambah Soal
        </button>
      </div>
    </div>
  );
};
