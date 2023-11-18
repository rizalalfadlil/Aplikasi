import React, { useState, useEffect } from "react";
import { MainPage } from "./mainpage/main";
import { MainSiswa } from "./mainpagesiswa/main";

export const Main = () => {
  const [userType, setUserType] = useState('Tipe Akun');

  useEffect(() => {
    const user = localStorage.getItem('user');

    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser && parsedUser.role) {
        setUserType(parsedUser.role);
      }
    }
  }, []);

  return (
    <div>
      {userType === 'Guru' ? <MainPage /> : <MainSiswa />}
    </div>
  );
};
