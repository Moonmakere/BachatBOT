import React from "react";
import { motion } from "framer-motion";
import { IconUpload } from "@tabler/icons-react";
import { cn } from "../../../lib/utils";
import { useDropzone } from "react-dropzone";

const mainVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 20, y: -20, opacity: 0.9 },
};

const secondaryVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

export const FileUploadArea = ({ onFileChange, fileInputRef }) => {
  const onInputChange = (e) => {
    const files = Array.from(e.target.files || []);
    onFileChange(files);
  };

  const handleManualClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // manually trigger file input
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true, // disable default click to prevent double trigger
    onDrop: onFileChange,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    onDropRejected: () => {
      console.error("Only JPG and PNG image files are supported");
    },
  });

  return (
    <motion.div
      {...getRootProps()}
      onClick={handleManualClick}
      whileHover="animate"
      className="group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
    >
      {/* Hidden manual file input */}
      <input
        type="file"
        accept=".jpg,.jpeg,.png"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={onInputChange}
      />

      <div className="pb-8">
        <p className="relative z-20 font-sans font-normal text-neutral-500 mt-2 montserrat-font-medium">
          Drag or drop your image file here or click to upload (one document only)
        </p>
        <div className="relative w-full mt-6 max-w-xl mx-auto">
          <div className="flex flex-col items-center">
            <motion.div
              layoutId="file-upload"
              variants={mainVariant}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={cn(
                "relative group-hover/file:shadow-xl z-40 bg-gray-100 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md border-2 border-dashed border-gray-300",
              )}
            >
              {isDragActive ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-blue-500 flex flex-col items-center montserrat-font-medium"
                >
                  Drop it
                  <IconUpload className="h-4 w-4 text-blue-500" />
                </motion.p>
              ) : (
                <IconUpload className="h-6 w-6 text-blue-500" />
              )}
            </motion.div>

            <p className="text-sm text-gray-500 mt-4 montserrat-font-medium">
              Supported formats: JPG, PNG
            </p>
          </div>

          <motion.div
            variants={secondaryVariant}
            className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
          ></motion.div>
        </div>
      </div>
    </motion.div>
  );
};
