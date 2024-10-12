"use client";

import React, { useState, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';

export default function Home() {
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const transitionStyle = "transition-all duration-150 ease-in-out";

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFiles(prevFiles => [...prevFiles, file]);
      setErrorMessage(null);
    } else if (file) {
      setErrorMessage(`The selected file "${file.name}" is not a PDF file.`);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const truncateFileName = (fileName: string) => {
    const nameWithoutExtension = fileName.replace(/\.pdf$/i, '');
    if (nameWithoutExtension.length <= 20) return nameWithoutExtension;
    return nameWithoutExtension.slice(0, 37) + '...';
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
                  className={`w-[150px] h-[40px] rounded-[10px] text-white font-poppins bg-black hover:bg-[#2F2F31] ${transitionStyle}`}
                  onClick={handleButtonClick}
                >
                  Convert new PDF
                </Button>
              </div>
              <div className="flex-grow flex items-center justify-center">
                <div className="flex flex-wrap justify-center gap-4">
                  {pdfFiles.map((file, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="w-[75px] h-[85px] bg-[#E4E5E7] rounded-[10px] mb-2"
                      ></div>
                      <p className="text-[#717179] font-poppins text-xs text-center w-[75px] overflow-hidden line-clamp-2">
                        {truncateFileName(file.name)}
                      </p>
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
