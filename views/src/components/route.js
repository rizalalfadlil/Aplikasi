import React from "react";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from "./loginpage/login";
import { MainPage } from "./mainpage/main";
import { HalamanUjian } from "./pelajaranpage/pelajaran";
export const AppRoute = () => {
    return(
    <BrowserRouter>
        <Routes>
            <Route exact path="/" Component={MainPage}/>
            <Route path="/login" Component={Login}/>
            <Route path="/pelajaran" Component={HalamanUjian}/>
        </Routes>
    </BrowserRouter>
    )
}