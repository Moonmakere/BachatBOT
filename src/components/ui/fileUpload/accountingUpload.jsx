'use client';

import React, { useRef, useState } from "react";
import axios from "axios";
import { DocumentTypeSelector } from "./typeSelector";
import { FileUploadArea } from "./fileUpload";
import { FilePreview } from "./filePreview";
import { ErrorMessage } from "./errorMsg";
import { InfoPanel } from "./infoPanel";
import { toast } from "react-hot-toast"; 

export const AccountingFileUpload = ({
  onChange,
  onVerify,
  onSuccess,
  onError,
  apiEndpoint = "/api/billandExpense"
}) => {
  const [file, setFile] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDocType, setSelectedDocType] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (newFiles) => {
    if (newFiles.length > 0) {
      const newFile = newFiles[0];
      if (
        newFile.type === "image/jpeg" ||
        newFile.type === "image/png"
      ) {
        setFile(newFile);
        setError(null);
        if (onChange) {
          onChange([newFile]);
        }
      } else {
        setError("Only JPG and PNG image files are supported");
      }
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setError(null);
    if (onChange) {
      onChange([]);
    }
  };

  const handleVerify = (e) => {
    e.stopPropagation();
    if (file && onVerify) {
      setIsVerifying(true);
      setTimeout(() => {
        onVerify(file);
        setIsVerifying(false);
      }, 1000);
    }
  };

  const handleTypeSelection = (type) => {
    if (selectedDocType === type) {
      setSelectedDocType(null);
    } else {
      setSelectedDocType(type);
    }
    setError(null);
  };

  const validateSubmission = () => {
    if (!file) {
      setError("Please upload a document first");
      return false;
    }

    if (!selectedDocType) {
      setError("Please select a document category");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.stopPropagation();

    setError(null);

    if (!validateSubmission()) return;

    const documentType = {
      bills: selectedDocType === 'bills',
      investment: selectedDocType === 'investment',
      spending: selectedDocType === 'spending',
      salary: selectedDocType === 'salary'
    };

    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', selectedDocType);
    formData.append('documentTypes', JSON.stringify(documentType));

    setIsUploading(true);

    try {
      // Choose the appropriate API endpoint based on document type
      const endpoint = selectedDocType === 'salary' 
        ? '/api/salaryOCR' 
        : apiEndpoint;

      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 60000,
      });

      if (response.status === 200) {
        toast.success("Data added to your dashboard!");
        if (onSuccess) onSuccess(response.data);
        // Reset file & selection
        setFile(null);
        setSelectedDocType(null);
      } else {
        throw new Error(`Server responded with status code ${response.status}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      const errorMessage = error.response?.data?.error || error.message || "Failed to upload file. Please try again.";
      setError(errorMessage);
      if (onError) onError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {error && <ErrorMessage message={error} />}

      <div className="">
        <h2 className="text-5xl font-semibold text-blue-500 mb-4 montserrat-font-medium">Upload Document</h2>
        <p className="text-gray-600 mb-4 montserrat-font-medium">Select the type of financial document you're uploading (one category only):</p>

        <DocumentTypeSelector 
          selectedDocType={selectedDocType} 
          onSelectType={handleTypeSelection} 
        />
      </div>

      <div className="">
        {file ? (
          <FilePreview 
            file={file} 
            onRemove={removeFile}
            onVerify={handleVerify}
            onSubmit={handleSubmit}
            isVerifying={isVerifying}
            isUploading={isUploading}
            selectedDocType={selectedDocType}
          />
        ) : (
          <FileUploadArea 
            onFileChange={handleFileChange}
            fileInputRef={fileInputRef}
          />
        )}
      </div>

      <InfoPanel />
    </div>
  );
};