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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert('Form submitted successfully');
      setFormData({ name: '', email: '', message: '' });
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

        <button type="submit" className={styles.button}>Submit</button>
      </form>
    </div>
  );
};

export default ContactForm;
