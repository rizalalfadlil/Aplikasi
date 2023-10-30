import React from "react";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from "./loginpage/login";
import { MainPage } from "./mainpage/main";
export const AppRoute = () => {
    return(
    <BrowserRouter>
        <Routes>
            <Route exact path="/" Component={MainPage}/>
            <Route path="/login" Component={Login}/>
        </Routes>
    </BrowserRouter>
    )
}