
"use client"


import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import axios from 'axios';

export default function PDFUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]); // Store image URLs

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      console.log('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('Imported pdf', file);

    try {
      const response = await axios.post('https://pdf2llm-d4y3d99yh-maximus305s-projects.vercel.app/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload successful:', response.data);

      // Assuming response.data.images is an array of image URLs
      setImages(response.data.images.map((img: any) => img.url)); // Extract image URLs
    } catch (error) {
      console.error('Error uploading PDF:', error);
    }
  };

  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={!file}>Upload a PDF</Button>

      {/* Display images after upload */}
      <div>
        {images.length > 0 && (
          <div>
            <h3>Converted Images:</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {images.map((imageUrl, index) => (
                <img key={index} src={imageUrl} alt={`Converted Image ${index + 1}`} style={{ width: '200px', margin: '10px' }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
