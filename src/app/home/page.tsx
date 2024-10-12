"use client";

import React, { useState, useRef, ChangeEvent } from 'react';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import Image from 'next/image'; // Import Image from next/image

interface ConvertedImage {
  image: string;
  page: number;
  description?: string;
}

export default function Home() {
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const transitionStyle = "transition-all duration-150 ease-in-out";

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFiles([file]); // Only handling a single file here
      setErrorMessage(null);
    } else if (file) {
      setErrorMessage(`The selected file "${file.name}" is not a PDF file.`);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (pdfFiles.length === 0) {
      setErrorMessage('No PDF file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', pdfFiles[0]); // Handling one PDF at a time

    try {
      setIsUploading(true);

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setConvertedImages(response.data.images); // API expected to return converted images
    } catch (error) {
      console.error('Error uploading PDF:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const analyzeImages = async () => {
    setIsAnalyzing(true);
    try {
      const analyzedImages = await Promise.all(
        convertedImages.map(async (img) => {
          const response = await axios.post('/api/analyze-image', { image: img.image });
          return { ...img, description: response.data.analyzedImage.description };
        })
      );
      setConvertedImages(analyzedImages);
    } catch (error) {
      console.error('Error analyzing images:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className={`flex h-screen p-[35px] space-x-[35px] ${transitionStyle}`}>
      <div className={`w-1/5 flex flex-col space-y-[35px] ${transitionStyle}`}>
        <div className={`h-1/3 ${transitionStyle}`}>
          {/* Branding Box */}
          <div className={`h-full bg-white border border-[#E3E4E6] rounded-[10px] p-[35px] ${transitionStyle}`}>
            {/* Content for the branding box */}
          </div>
        </div>
        <div className={`h-2/3 ${transitionStyle}`}>
          {/* Extra Box */}
          <div className={`h-full bg-white border border-[#E3E4E6] rounded-[10px] p-[35px] ${transitionStyle}`}>
            {/* Content for the extra box */}
          </div>
        </div>
      </div>

      <div className={`w-4/5 ${transitionStyle}`}>
        {/* Main Box */}
        <div className={`h-full bg-white border border-[#E3E4E6] rounded-[10px] p-[35px] flex flex-col ${transitionStyle}`}>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
          {pdfFiles.length === 0 && (
            <div className="flex-grow flex items-center justify-center">
              <Button
                className={`w-[200px] h-[40px] rounded-[10px] text-white font-poppins bg-black hover:bg-[#2F2F31] ${transitionStyle}`}
                onClick={handleButtonClick}
              >
                Convert your first
              </Button>
            </div>
          )}

          {pdfFiles.length > 0 && (
            <>
              <div className="flex justify-between items-center mb-6">
                <div className="relative flex-grow mr-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search PDFs..."
                      className="pl-8 h-[40px]"
                    />
                  </div>
                </div>
                <Button
                  className={`w-[150px] h-[40.0px] rounded-[10px] text-white font-poppins bg-black hover:bg-[#2F2F31] ${transitionStyle}`}
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Convert PDF'}
                </Button>
              </div>

              {/* Display converted images */}
              {convertedImages.length > 0 && (
                <div className="flex-grow flex items-center justify-center">
                  <div className="flex flex-wrap justify-center gap-4">
                    {convertedImages.map((img, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <Image
                          src={`data:image/jpeg;base64,${img.image}`}
                          alt={`Page ${img.page}`}
                          width={75}
                          height={85}
                          className="bg-[#E4E5E7] rounded-[10px] mb-2"
                        />
                        <p className="text-[#717179] font-poppins text-xs text-center w-[75px] overflow-hidden line-clamp-2">
                          Page {img.page}
                        </p>
                        {img.description && (
                          <div className="mt-2 p-4 bg-gray-100 rounded">
                            <h4 className="font-bold">Image Description:</h4>
                            <p>{img.description}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {convertedImages.length > 0 && (
                <Button onClick={analyzeImages} disabled={isAnalyzing}>
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Images'}
                </Button>
              )}
            </>
          )}
          {errorMessage && (
            <p className="text-red-500 mt-4">{errorMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}