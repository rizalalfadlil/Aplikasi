import React, {useState, useEffect} from 'react'
import { message, Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ResourceLink } from '../../config';
import axios from 'axios';
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Tambah Gambar
      </div>
    </div>
  );
const ImageUploader = (props) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const maxImage = 1;
    const [fileList, setFileList] = useState([]);
    useEffect(() => {
        // Fungsi untuk mendapatkan file dari server
        const getFilesFromServer = async () => {
          try {
            const response = await axios.get(`${ResourceLink}/getFiles/${props.idPelajaran}/${props.noSoal}/${props.fileName}.png`);
            setFileList([{ uid: '-1', name: 'question.png', status: 'done', url: response.config.url }]);
          } catch (error) {
            // Tangani kesalahan di sini
                if (error.response && error.response.status === 404) {
                    // File tidak ditemukan, tidak perlu menampilkan pesan kesalahan
                    console.log('File not found');
                } else {
                    // Kesalahan lainnya, tampilkan pesan kesalahan
                    console.error('Error fetching data:', error.message);
                }
          }
        };
    
        // Panggil fungsi untuk mendapatkan file saat komponen dimuat
        getFilesFromServer();
      }, [props.idPelajaran, props.noSoal]);
  
    const handleChange = ({ fileList }) => {
      setFileList(fileList);
    };
  
    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setPreviewImage(file.url || file.preview);
      setPreviewOpen(true);
      setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const handleDelete = async (fileName) => {
        try {
          const response = await axios.delete(`${ResourceLink}/deleteFile/${props.idPelajaran}/${props.noSoal}/${props.fileName}.png`);
          console.log(response.data.message); // Pesan server (opsional)
          // Lakukan sesuatu setelah file dihapus
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      };
  return (
    <>
    <Upload
    action={props.action}
    listType="picture-card"
    className='d-flex justify-content-end'
    onPreview={handlePreview}
    onRemove={handleDelete}
    maxCount={1}
    fileList={fileList}
    data={(file) => ({
      idPelajaran: props.idPelajaran,
      noSoal: props.noSoal,
      filename: props.fileName,
    })}
    onChange={handleChange}
  >
    {fileList.length >= maxImage ? null : uploadButton}
</Upload>
<Modal open={previewOpen} title={previewTitle} footer={null} centered onCancel={handleCancel}>
        <img
          alt="example"
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal>
</>
  )
}

export default ImageUploader
