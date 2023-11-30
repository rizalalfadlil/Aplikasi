# APLIKASI UJIAN

> Hafidz Rizal AL-Fadlil

aplikasi ujian sekolah dengan tampilan modern dan interaktif.


## Untuk Memulai
---
1. Install Aplikasi yang dibutuhkan
    - [Node.js](https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi)
    - mySQL sebagai database (atau bisa menggunakan [xampp](https://www.apachefriends.org/download.html))
    - [npm](https://www.npmjs.com/package/npm)

2. Pastikan server database nyala dan bisa digunakan
    - Jika menggunakan [xampp](https://www.apachefriends.org/download.html)
        1. Buka aplikasi xampp control panel
        2. Tekan ***start*** di bagian **Apache** dan **MySQL**

3. Buka ***Back-end*** (projek ini) dan ***Front-end*** (di dalam folder views) dengan terminal (disarankan menggunakan 2 terminal, masukkan perintah `cd views` di terminal kedua/front-end).

(Back-end/terminal back-end)

4. Install semua ***package*** dengan `npm install` atau `npm i`

5. Buat ***Database*** dengan `sequelize db:create` (jika sudah ada bisa lewati atau hapus dengan `sequelize db:drop` dan buat kembali untuk memastikan database berfungsi dengan benar)

6. ***Migrasi*** database dengan `sequelize db:migrate`

7. Nyalakan ***Server*** back-end dengan `node server/server.js`

(Front-end/terminal front-end)

8. Nyalakan Aplikasi dengan `npm start`