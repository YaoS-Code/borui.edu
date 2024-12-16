"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '@/styles/Gallery.module.css';

interface ImageData {
  filename: string;
  uploadDate: string;
  title?: string;
}

const Gallery = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/gallery', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          setImages(data.images || []);
        } else {
          throw new Error(data.error || 'Failed to load images');
        }
      } catch (error) {
        console.error('Error fetching images:', error);
        setError(error instanceof Error ? error.message : 'Failed to load images');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.gallery}>
      <h2 className={styles.title}>Image Gallery</h2>
      {images.length === 0 ? (
        <p className={styles.noImages}>No images uploaded yet.</p>
      ) : (
        <div className={styles.cardGrid}>
          {images.map((image, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image
                  src={`/uploads/${image.filename}`}
                  alt={image.title || 'Uploaded image'}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={styles.image}
                />
              </div>
              <div className={styles.cardContent}>
                <h3>{image.title || 'Untitled'}</h3>
                <p>Uploaded: {new Date(image.uploadDate).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery; 