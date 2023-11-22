import React from "react";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from "./loginpage/login";
import { MainPage } from "./mainpage/main";
import { HalamanUjian } from "./pelajaranpage/pelajaran";
import { BuatSoal } from "./buatsoalpage/buatsoalpage";
import { MainSiswa } from "./mainpagesiswa/main";
import { Main } from "./pagenavigator";
import { AccountTable } from "./buatakunsiswapage/buatakun";
import { Empty, Layout } from "antd";
import UserProfile from "./profilpage/userprofile";
import { Nilai } from "./nilaipage/nilai";
export const AppRoute = () => {
    return(
    <BrowserRouter>
        <Routes>
            <Route exact path="/" Component={Main}/>
            <Route path="/login" Component={Login}/>
            <Route path="/pelajaran" Component={HalamanUjian}/>
            <Route path="/create-soal" Component={BuatSoal}/>
            <Route path="/siswa" Component={MainSiswa}/>
            <Route path="*" Component={EmptyPage}/>
            <Route path="/create-account" Component={AccountTable}/>
            <Route path="/user/:id" Component={UserProfile}/>
            <Route path="/nilai-ujian" Component={Nilai}/>
        </Routes>
    </BrowserRouter>
    )
}
const EmptyPage = () =>{
    return(
        <Layout
        className="d-flex align-items-center justify-content-center"
        style={{height:'100vh'}}>
            <Empty description='Tidak Ada apa apa disini'/>
            <a className="btn btn-outline-secondary my-3 rounded-pill" href="/">Ke halaman utama</a>
        </Layout>
    )
}