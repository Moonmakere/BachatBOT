'use client';
 
import React, { useRef, useState } from "react";
import axios from "axios";
import { DocumentTypeSelector } from "./typeSelector";
import { FileUploadArea } from "./fileUpload";
import { FilePreview } from "./filePreview";
import { ErrorMessage } from "./errorMsg";
import { InfoPanel } from "./infoPanel";
import { toast } from "react-hot-toast";
import FormattedSummary from "../../home/formattedSummary";
 
export const AccountingFileUpload = ({
  onChange,
  onVerify,
  onSuccess,
  onError,
  apiEndpoint = "http://localhost:3005/upload"
}) => {
  const [file, setFile] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDocType, setSelectedDocType] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const fileInputRef = useRef(null);
 
  const handleFileChange = (newFiles) => {
    if (newFiles.length > 0) {
      const newFile = newFiles[0];
      if (
        newFile.type === "image/jpeg" ||
        newFile.type === "image/png"
      ) {
        setFile(newFile);
        setResponseData(null);
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
 
    const formData = new FormData();
    formData.append('files', file);  // Corrected from 'file' to 'files'
 
    setIsUploading(true);
 
    try {
      const response = await axios.post(apiEndpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
       
      if (response.status === 200) {
        toast.success("Data processed successfully!");
        setResponseData(response.data);
        if (onSuccess) onSuccess(response.data);
 
        // Optional: log summaries returned from backend
        console.log('Backend Summary:', response.data);
 
        // Reset
        setFile(null);
        setSelectedDocType(null);
      } else {
        throw new Error(`Server responded with status ${response.status}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      const message = error.response?.data?.error || error.message || "Upload failed. Try again.";
      setError(message);
      if (onError) onError(message);
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
      {responseData?.files?.map((fileResult, idx) => (
        <div key={idx} className="bg-white mt-6 p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold mb-2">{fileResult.fileName}</h4>
          <p className="text-sm text-gray-600 mb-1">Type: {fileResult.documentType}</p>
          <FormattedSummary
            className="text-sm bg-gray-100 p-3 rounded whitespace-pre-wrap overflow-x-auto"
            text={typeof fileResult.summary === 'object' ? fileResult.summary.text : fileResult.summary}
          />
 
        </div>
      ))}
 
 
    </div>
  );
};