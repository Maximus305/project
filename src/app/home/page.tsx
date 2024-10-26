'use client'

import React, { useState, useCallback } from 'react';
import { Upload, AlertCircle, FileUp, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

// Maximum file size in bytes (50MB)
const MAX_FILE_SIZE = 50 * 1024 * 1024;

type FileStatus = 'idle' | 'dragging' | 'uploading' | 'error' | 'success';

interface FileUploaderProps {
  onFileUpload?: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const [fileStatus, setFileStatus] = useState<FileStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [dragCounter, setDragCounter] = useState(0);

  // Create a specific validation function with proper typing
  const validateFile = (file: File | undefined): string | null => {
    if (!file) {
      return 'No file selected';
    }
    
    if (!file.type.includes('pdf')) {
      return 'Only PDF files are allowed';
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 50MB';
    }
    
    return null;
  };

  const simulateFileUpload = (file: File) => {
    setFileStatus('uploading');
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setFileStatus('success');
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleFile = async (file: File | undefined) => {
    const error = validateFile(file);
    if (error) {
      setFileStatus('error');
      setErrorMessage(error);
      return;
    }

    if (file) {
      // Call the optional callback if provided
      onFileUpload?.(file);
      // Simulate file upload - replace with actual upload logic
      simulateFileUpload(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragCounter(0);
    
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragCounter(prev => prev + 1);
    setFileStatus('dragging');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragCounter(prev => prev - 1);
    if (dragCounter - 1 === 0) {
      setFileStatus('idle');
    }
  }, [dragCounter]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <input
        type="file"
        id="file-input"
        className="hidden"
        accept=".pdf"
        onChange={handleFileInput}
      />
      
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8
          ${fileStatus === 'dragging' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${fileStatus === 'error' ? 'border-red-500 bg-red-50' : ''}
          transition-colors duration-200
        `}
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
      >
        <div className="flex flex-col items-center justify-center gap-4">
          {fileStatus === 'uploading' ? (
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          ) : (
            <Upload className={`w-12 h-12 ${fileStatus === 'dragging' ? 'text-blue-500' : 'text-gray-400'}`} />
          )}
          
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-1">
              {fileStatus === 'dragging' ? 'Drop your PDF here' : 'Upload your PDF'}
            </h3>
            <p className="text-sm text-gray-500">
              Drag and drop your PDF here, or{' '}
              <label
                htmlFor="file-input"
                className="text-blue-500 hover:text-blue-700 cursor-pointer"
              >
                browse
              </label>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Maximum file size: 50MB
            </p>
          </div>
        </div>
      </div>

      {fileStatus === 'uploading' && (
        <div className="mt-4">
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-sm text-gray-500 mt-2">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}

      {fileStatus === 'error' && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {fileStatus === 'success' && (
        <Alert className="mt-4 bg-green-50 border-green-200">
          <FileUp className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-700">Success</AlertTitle>
          <AlertDescription className="text-green-600">
            Your PDF has been uploaded successfully
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default FileUploader;