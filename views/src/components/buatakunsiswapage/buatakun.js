import React, { useState, useEffect } from 'react';
import { ResourceLink } from '../../config';
import { Form, Input, Button, Radio, Select, message, Table, Modal, Checkbox } from 'antd';
import axios from 'axios';
import Sidebar from '../mainpage/sidebar';
const { confirm } = Modal;
const { Option } = Select;
const { Search } = Input;

export const Buatakun = ({fetchAccounts}) => {
  const [form] = Form.useForm();
  const [autoGenerate, setAutoGenerate] = useState(false); // State untuk checkbox
  const [selectedRole, setSelectedRole] = useState('siswa');

  
  const [userType, setUserType] = useState('siswa');
  useEffect(() => {
    const user = localStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    setUserType(parsedUser.role);

    if(parsedUser.role !== 'guru'){
      window.location.href = '/';
    }
  }, [userType]);

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post( ResourceLink + '/api/users', values);
      console.log(response.data);
      fetchAccounts()
      message.success('Berhasil Membuat Akun');
      
      if(autoGenerate){
        let { username } = values;
        const isNumeric = /^\d+$/.test(username);
        if(isNumeric){
          form.setFieldsValue({
            fullname: null,
            username: (parseInt(username) + 1).toString(),
            password: generatePassword(),
          });
        }else{
          form.setFieldsValue({
            fullname: null,
            password: generatePassword(),
          });
        }
      }else{
        form.setFieldsValue({
          fullname: null,
          username: null,
          password: null,
          grade: null,
          departement: null,
        });
      }
    } catch (error) {
      console.error(error);
      message.error('Gagal Membuat Akun : ' + error);
    }
  };

  const generatePassword = () => {
    // Logika untuk menghasilkan password
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const passwordLength = Math.floor(Math.random() * (8 - 5 + 1)) + 5; // Panjang password antara 5 dan 8 karakter
    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters.charAt(randomIndex);
    }
    return password;
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
    setAutoGenerate(false);
  };

  return (
    <div className=''>
        <h2 className='pb-5'>Buat Akun Baru</h2>
        <Form form={form} layout='vertical' onFinish={handleSubmit}>
        <Form.Item name="role" label="Tipe" rules={[{ required: true, message: 'Tipe wajib diisi' }]}>
            <Radio.Group onChange={handleRoleChange} value={selectedRole}>
              <Radio value="guru">Guru</Radio>
              <Radio value="siswa">Siswa</Radio>
            </Radio.Group>
          </Form.Item>
        <Form.Item name="fullname" label="Nama Lengkap" rules={[{ required: true, message: 'Username wajib diisi' }]}>
            <Input className='rounded-pill'/>
          </Form.Item>
        {selectedRole === 'siswa' && (
          <Form.Item>
          <Checkbox onChange={(e) => setAutoGenerate(e.target.checked)}>Isi Otomatis</Checkbox>
        </Form.Item>
        )}
          <div className='row'>
          <Form.Item name="username" label="Username" className='col-12 col-sm-6' rules={[{ required: true, message: 'Username wajib diisi' }]}>
            <Input className='rounded-pill'/>
          </Form.Item>
          <Form.Item name="password" label="Password" className='col-12 col-sm-6' rules={[{ required: true, message: 'Password wajib diisi' }]}>
            <Input className='rounded-pill' />
          </Form.Item>
          </div>
          {selectedRole === 'siswa' && (
            <div className='row'>
              <Form.Item name="grade" label="Kelas" className='col-12 col-sm-6'>
                <Select className='rounded-pill border' bordered={false}>
                  <Option value="X">X</Option>
                  <Option value="XI">XI</Option>
                  <Option value="XII">XII</Option>
                </Select>
              </Form.Item>
              <Form.Item name="department" label="Jurusan" className='col-12 col-sm-6'>
                <Select className='rounded-pill border' bordered={false}>
                  <Option value="RPL">Rekayasa Perangkat Lunak</Option>
                  <Option value="TKJ">Teknik Komputer dan Jaringan</Option>
                  <Option value="TBSM">Teknik Bengkel dan Sepeda Motor</Option>
                  <Option value="TKRO">Teknik Kendaran Ringan dan Otomotif</Option>
                  <Option value="TP">Teknik Permesinan</Option>
                </Select>
              </Form.Item>
            </div>
          )}
          <Form.Item>
            <Button type="primary" className='rounded-pill' htmlType="submit">
              Buat Akun
            </Button>
          </Form.Item>
        </Form>
      </div>
  );
};
export const AccountTable = () => {
    const [accounts, setAccounts] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filterRole, setFilterRole] = useState('');
  
    const fetchAccounts = async () => {
        try {
          const response = await axios.get(ResourceLink + '/api/users');
          setAccounts(response.data);
        } catch (error) {
          console.error(error);
          message.error('Gagal mengambil daftar akun.');
        }
      };

      useEffect(() => {
        // Mengambil data dari API
        fetch( ResourceLink + '/api/users')
          .then((response) => response.json())
          .then((data) => setAccounts(data))
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
      }, []);
  
    const handleDeleteAccount = (accountId) => {
      confirm({
        title: 'Konfirmasi Hapus Akun',
        centered: true,
        cancelText: 'Batal',
        content: 'Apakah Anda yakin ingin menghapus akun ini?',
        onOk: async () => {
          try {
            // Kirim permintaan hapus akun ke server
            await axios.delete(`${ResourceLink}/api/users/${accountId}`);
            message.success('Akun berhasil dihapus.');
            // Perbarui daftar akun setelah menghapus
            fetchAccounts();
          } catch (error) {
            console.error(error);
            message.error('Gagal menghapus akun.');
          }
        },
      });
    };
  
    const handleSearch = (value) => {
      setSearchText(value);
    };
  
    const handleFilterRole = (value) => {
      setFilterRole(value);
    };
  
    const filteredAccounts = filterRole
    ? accounts.filter((account) => account.role === filterRole)
    : accounts;

    const viewAccount = (accountId) =>{
      window.location.href = 'user/' + accountId;
    }
    const columns = [
      {
        title: 'Username',
        key: 'username',
        render:(record) =>(
          <button className='bg-transparent p-2 w-100 text-start text-primary' onClick={() => viewAccount(record.id)}>
            {record.username}
          </button>
        )
      },
      {
        title: 'Tipe',
        dataIndex: 'role',
        key: 'role',
      },
      {
        title: 'Nama Lengkap',
        dataIndex: 'fullname',
        key: 'fullname',
      },
      {
        title: 'password',
        dataIndex: 'password',
        key: 'password',
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <Button
            className='btn btn-outline-danger d-flex align-items-center border border-danger border-opacity-25 rounded-pill'
            type="danger"
            onClick={() => handleDeleteAccount(record.id)}
          >
            Hapus
          </Button>
        ),
      },
    ];
  
    return (
      <div className='d-flex'>
        <Sidebar />
        <div className='border rounded-3 container my-5 p-5'>
          <Buatakun fetchAccounts={fetchAccounts} />
          <h1 className='py-5'>Daftar Akun</h1>
          <div className='mb-3'>
            <Search
              placeholder='Cari berdasarkan username'
              onSearch={handleSearch}
              bordered={false}
              className='border rounded-pill bg-transparent pe-3'
              style={{ width: 300, marginRight: 10 }}
            />
            <Select
              placeholder='Tipe Akun'
              style={{ width: 120 }}
              bordered={false}
              className='rounded-pill border'
              onChange={handleFilterRole}
              allowClear
            >
              <Option value='guru'>Guru</Option>
              <Option value='siswa'>Siswa</Option>
            </Select>
          </div>
          <Table dataSource={filteredAccounts} columns={columns} />
        </div>
      </div>
    );
  };