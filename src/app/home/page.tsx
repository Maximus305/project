"use client"


import React, { useState, useRef, ChangeEvent } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileText, Copy, Download } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

interface PDFFile {
  file: File;
  id: string;
  isProcessing: boolean;
  pages: AnalyzedPage[];
}

interface AnalyzedPage {
  page: number;
  description: string;
}

export default function PDFAnalyzerDashboard() {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedPdfId, setSelectedPdfId] = useState<string | null>(null);
  const [copiedPage, setCopiedPage] = useState<number | null>(null); // State to track copied page
  const fileInputRef = useRef<HTMLInputElement>(null);

  const transitionStyle = "transition-all duration-150 ease-in-out";

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPDFs = Array.from(files).filter(file => file.type === "application/pdf");
      if (newPDFs.length > 0) {
        setPdfFiles(prev => [
          ...prev,
          ...newPDFs.map(file => ({ file, id: Math.random().toString(36).substr(2, 9), isProcessing: false, pages: [] }))
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
      const arrayBuffer = await pdfFile.file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const numPages = pdfDoc.getPageCount();

      const formData = new FormData();
      formData.append('file', pdfFile.file);

      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const analyzedPages = await Promise.all(
        Array.from({ length: numPages }, async (_, i) => {
          const analysisResponse = await axios.post('/api/analyze-image', { image: response.data.images[i].image });
          return {
            page: i + 1,
            description: analysisResponse.data.analyzedImage.description
          };
        })
      );

      setPdfFiles(prev => prev.map(pdf => 
        pdf.id === pdfFile.id ? { ...pdf, isProcessing: false, pages: analyzedPages } : pdf
      ));

      setSelectedPdfId(pdfFile.id);
    } catch (error) {
      console.error('Error processing PDF:', error);
      setErrorMessage('An error occurred while processing the PDF.');
      setPdfFiles(prev => prev.map(pdf => 
        pdf.id === pdfFile.id ? { ...pdf, isProcessing: false } : pdf
      ));
    }
  };

  const handleCopy = (text: string, page: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedPage(page); // Set the copied page
      setTimeout(() => setCopiedPage(null), 2000); // Reset the state after 2 seconds
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  const handleDownload = (text: string, filename: string) => {
    const element = document.createElement('a');
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const selectedPdf = pdfFiles.find(pdf => pdf.id === selectedPdfId);

  return (
    <div className="flex h-screen p-[35px] space-x-[35px]">
      {/* Left side (PDF files) */}
      <div className="w-3/5">
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
                  Add a PDF
                </Button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 mb-4">
                {pdfFiles.map((pdf) => (
                  <div key={pdf.id} className="relative cursor-pointer" onClick={() => handleProcessing(pdf)}>
                    <div 
                      className={`w-24 h-24 rounded-lg flex items-center justify-center ${pdf.isProcessing ? 'bg-gray-100' : 'bg-gray-100 hover:bg-gray-200'} ${transitionStyle}`}
                    >
                      {pdf.isProcessing ? (
                        <div className="spinner"></div>
                      ) : (
                        <FileText size={36} className="text-gray-600" />
                      )}
                    </div>
                    <p className="mt-2 text-xs font-medium text-center truncate w-24">{pdf.file.name}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {errorMessage && (
            <p className="text-red-500 mt-4">{errorMessage}</p>
          )}
        </div>
      </div>

      {/* Right side (Markdown display) */}
      <div className="w-2/5 flex flex-col">
        <div className="h-full bg-white border border-[#E3E4E6] rounded-[10px] p-[35px] flex flex-col overflow-hidden">
          <h2 className="text-2xl font-bold mb-4">Markdown</h2>
          {selectedPdf ? (
            <div className="flex-grow overflow-y-auto">
              {selectedPdf.pages.map((page, index) => (
                <div key={index} className="mb-8 bg-gray-100 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold">Page {page.page}:</h3>
                    <div>
                      <Button
                        onClick={() => handleCopy(page.description, page.page)}
                        className={`mr-2 shadow-md ${copiedPage === page.page ? 'bg-green-500' : 'bg-gray-200 text-gray-800'} rounded-md px-2 py-1`}
                        size="sm"
                        variant="outline"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDownload(page.description, `page_${page.page}.md`)}
                        className={`shadow-md bg-gray-200 text-gray-800 rounded-md px-2 py-1`}
                        size="sm"
                        variant="outline"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="prose max-w-full bg-white p-4 rounded-md whitespace-pre-wrap break-words overflow-hidden">
                    <ReactMarkdown>{page.description || "No description available."}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Select a PDF to view its analysis.</p>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.3); /* Change border color to black */
          border-top: 4px solid #000; /* Change border top color to black */
          border-radius: 50%;
          width: 24px;
          height: 24px;
          animation: spin 1s linear infinite;
        }

        .prose {
          width: 100%;
          max-width: 100% !important;
          overflow-wrap: break-word;
          word-break: break-word;
        }
      `}</style>
    </div>
  );
}
