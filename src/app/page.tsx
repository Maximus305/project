"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";


export default function PDFUploader() {
  const [file, setFile] = useState<File | null>(null);

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
      const response = await fetch('https://pdf2llm-d4y3d99yh-maximus305s-projects.vercel.app/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Upload successful:', result);
    } catch (error) {
      console.error('Error uploading PDF:', error);
    }
  };

  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={!file}>Upload a PDF</Button>
    </div>
  );
}