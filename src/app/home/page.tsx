"use client";

import React, { useState, useRef, ChangeEvent } from 'react';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileText } from 'lucide-react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PDFFile {
  file: File;
  id: string;
  isProcessing: boolean;
}

interface ConvertedImage {
  image: string;
  page: number;
  description?: string;
  pdfId: string;
}

export default function Home() {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const transitionStyle = "transition-all duration-150 ease-in-out";

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPDFs = Array.from(files).filter(file => file.type === "application/pdf");
      if (newPDFs.length > 0) {
        setPdfFiles(prev => [
          ...prev,
          ...newPDFs.map(file => ({ file, id: Math.random().toString(36).substr(2, 9), isProcessing: false }))
        ]);
        setErrorMessage(null);
      } else {
        setErrorMessage("Please select valid PDF files.");
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleProcessing = async (pdfFile: PDFFile) => {
    setPdfFiles(prev => prev.map(pdf => 
      pdf.id === pdfFile.id ? { ...pdf, isProcessing: true } : pdf
    ));

    try {
      const formData = new FormData();
      formData.append('file', pdfFile.file);
      const uploadResponse = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const convertedImages = uploadResponse.data.images;

      const analyzedImages = await Promise.all(
        convertedImages.map(async (img: ConvertedImage) => {
          const response = await axios.post('/api/analyze-image', { image: img.image });
          return { ...img, description: response.data.analyzedImage.description, pdfId: pdfFile.id };
        })
      );

      setConvertedImages(prev => [...prev, ...analyzedImages]);
    } catch (error) {
      console.error('Error processing PDF:', error);
      setErrorMessage('An error occurred while processing the PDF.');
    } finally {
      setPdfFiles(prev => prev.map(pdf => 
        pdf.id === pdfFile.id ? { ...pdf, isProcessing: false } : pdf
      ));
    }
  };

  const removePDF = (id: string) => {
    setPdfFiles(prev => prev.filter(pdf => pdf.id !== id));
    setConvertedImages(prev => prev.filter(img => img.pdfId !== id));
  };

  const editPDF = (id: string) => {
    // Implement edit functionality
    console.log(`Editing PDF with id: ${id}`);
  };

  return (
    <div className={`flex h-screen p-[35px] space-x-[35px] ${transitionStyle}`}>
      <div className={`w-1/5 flex flex-col space-y-[35px] ${transitionStyle}`}>
        <div className={`h-1/3 ${transitionStyle}`}>
          <div className={`h-full bg-white border border-[#E3E4E6] rounded-[10px] p-[35px] ${transitionStyle}`}>
            {/* Branding content */}
          </div>
        </div>
        <div className={`h-2/3 ${transitionStyle}`}>
          <div className={`h-full bg-white border border-[#E3E4E6] rounded-[10px] p-[35px] ${transitionStyle}`}>
            {/* Extra content */}
          </div>
        </div>
      </div>

      <div className={`w-4/5 ${transitionStyle}`}>
        <div className={`h-full bg-white border border-[#E3E4E6] rounded-[10px] p-[35px] flex flex-col relative ${transitionStyle}`}>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
            multiple
          />

          {pdfFiles.length === 0 ? (
            <div className="flex-grow flex items-center justify-center">
              <Button
                className={`w-[200px] h-[40px] rounded-[10px] text-white font-poppins bg-black hover:bg-[#2F2F31] ${transitionStyle}`}
                onClick={handleButtonClick}
              >
                Convert your first PDF
              </Button>
            </div>
          ) : (
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
                  className={`w-[130px] h-[40px] rounded-[10px] text-white font-poppins bg-black hover:bg-[#2F2F31] ${transitionStyle}`}
                  onClick={handleButtonClick}
                >
                  convert new pdf
                </Button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 mb-4">
                {pdfFiles.map((pdf) => (
                  <DropdownMenu key={pdf.id}>
                    <DropdownMenuTrigger asChild>
                      <div className="relative cursor-pointer">
                        <div 
                          className={`w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center ${pdf.isProcessing ? 'opacity-50' : 'hover:bg-gray-200'} ${transitionStyle}`}
                        >
                          <FileText size={36} className="text-gray-600" />
                        </div>
                        <p className="mt-2 text-xs font-medium text-center truncate w-24">{pdf.file.name}</p>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleProcessing(pdf)}>Convert</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => removePDF(pdf.id)}>Delete</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => editPDF(pdf.id)}>Edit</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ))}
              </div>

              <div className="flex-grow overflow-auto">
                <div className="flex flex-wrap justify-start gap-4">
                  {convertedImages.map((img, index) => (
                    <div key={index} className="flex flex-col items-center mb-4">
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
                        <div className="mt-2 p-4 bg-gray-100 rounded max-w-xs">
                          <h4 className="font-bold">Image Description:</h4>
                          <p className="text-sm">{img.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
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