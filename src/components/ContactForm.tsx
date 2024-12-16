"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import styles from '@/styles/ContactForm.module.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // 验证文件类型
      if (selectedFile.type.match(/(image.*|application\/pdf)/)) {
        setFile(selectedFile);
      } else {
        alert('Please upload only images or PDF files');
        e.target.value = ''; // 清除选择
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('message', formData.message);
    if (file) {
      formDataToSend.append('file', file);
    }

    const response = await fetch('/api/contact', {
      method: 'POST',
      body: formDataToSend, // 不需要设置 Content-Type，浏览器会自动设置
    });

    if (response.ok) {
      alert('Form submitted successfully');
      setFormData({ name: '', email: '', message: '' });
      setFile(null);
    } else {
      alert('Error submitting form');
    }
  };

  return (
    <div className={styles.container}>
      {/* Display QR Code Screenshot using next/image */}
      <div className={styles.qrContainer}>
        <Image 
          src="/images/qr-code.jpg"
          alt="QR Code"
          width={200}
          height={200}
          className={styles.qrImage}
          priority
        />
        <p>Scan the QR code to connect with us!</p>
      </div>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.formLabel}>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className={styles.formInput}
        />

        <label className={styles.formLabel}>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className={styles.formInput}
        />

        <label className={styles.formLabel}>Message</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          className={styles.formTextarea}
        ></textarea>

        <label className={styles.formLabel}>Upload File (Images or PDF)</label>
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          className={styles.formInput}
        />
        {file && (
          <p className={styles.fileName}>Selected file: {file.name}</p>
        )}

        <button type="submit" className={styles.button}>Submit</button>
      </form>
    </div>
  );
};

export default ContactForm;
