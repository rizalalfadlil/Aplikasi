import React from "react";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from "./loginpage/login";
import { MainPage } from "./mainpage/main";
import { HalamanUjian } from "./pelajaranpage/pelajaran";
import { BuatSoal } from "./buatsoalpage/buatsoalpage";
import { MainSiswa } from "./mainpagesiswa/main";
import { Main } from "./pagenavigator";
export const AppRoute = () => {
    return(
    <BrowserRouter>
        <Routes>
            <Route exact path="/" Component={Main}/>
            <Route path="/login" Component={Login}/>
            <Route path="/pelajaran" Component={HalamanUjian}/>
            <Route path="/create-soal" Component={BuatSoal}/>
            <Route path="/siswa" Component={MainSiswa}/>
        </Routes>
    </BrowserRouter>
    )
}