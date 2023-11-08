import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Mengimpor stylesheet
import ImageUploader from 'react-quill-image-uploader'; // Mengimpor ekstensi image-uploader
import 'bootstrap/dist/css/bootstrap.min.css';
class RichTextEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['image'], // Menambahkan tombol "Insert Image" ke toolbar
        ],
      },
    };
    this.handleChange = this.handleChange.bind(this);
    this.imageHandler = this.imageHandler.bind(this);
  }

  handleChange(value) {
    this.setState({ text: value });
  }

  imageHandler() {
    // Logika untuk mengunggah dan menyisipkan gambar
    // Anda dapat menggunakan library seperti axios untuk mengunggah gambar ke server
    // Setelah diunggah, Anda dapat menyisipkan gambar ke editor menggunakan "this.quill" seperti di bawah

    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('image', file);

        // Lakukan permintaan HTTP ke server untuk mengunggah gambar
        // Simpan URL gambar yang diterima dari server

        // Setelah gambar diunggah, sisipkan gambar ke editor
        if (this.quill) {
          const range = this.quill.getSelection();
          const link = prompt('Masukkan URL gambar:');
          this.quill.insertEmbed(range.index, 'image', link);
        }
      }
    };
  }

  render() {
    return (
      <div className='text-editor'>
        <ReactQuill
          value={this.state.text}
          onChange={this.handleChange}
          modules={this.state.modules}
          className='text-editor'
          ref={(el) => { this.quill = el; }}
        />
      </div>
    );
  }
}

export default RichTextEditor;
