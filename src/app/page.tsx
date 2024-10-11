
"use client"

import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";

interface ConvertedImage {
  image: string;
  page: number;
}

export default function PDFUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      setUploadStatus('Uploading...');

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadStatus('Upload successful');
      console.log('Response:', response.data);
      setConvertedImages(response.data.images);
    } catch (error) {
      console.error('Error uploading PDF:', error);
      setUploadStatus('Error uploading file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={!file || isUploading}>
        {isUploading ? 'Uploading...' : 'Upload a PDF'}
      </Button>
      {uploadStatus && <p>{uploadStatus}</p>}
      {convertedImages.length > 0 && (
        <div>
          <h2>Converted Images:</h2>
          {convertedImages.map((img, index) => (
            <div key={index}>
              <h3>Page {img.page}</h3>
              <img src={`data:image/jpeg;base64,${img.image}`} alt={`Page ${img.page}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}