// FilePreview.jsx
import React from "react";
import { motion } from "framer-motion";
import { IconX, IconCheck } from "@tabler/icons-react";
import { cn } from "../../../lib/utils";

export const FilePreview = ({ 
  file, 
  onRemove, 
  onVerify, 
  onSubmit, 
  isVerifying, 
  isUploading,
  selectedDocType
}) => {
  return (
    <motion.div
      layoutId="file-upload"
      className={cn(
        "relative overflow-hidden z-40 bg-gray-50 flex flex-col items-start justify-start md:h-auto p-4 mt-4 w-full mx-auto rounded-md",
        "shadow-md border border-gray-200"
      )}
    >
      <div className="flex justify-between w-full items-center gap-4 montserrat-font-medium">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          layout
          className="text-base text-neutral-700 truncate max-w-xs"
        >
          {file.name}
        </motion.p>
        <div className="flex items-center gap-2">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            layout
            className="rounded-lg px-2 py-1 w-fit shrink-0 text-sm text-neutral-600 shadow-input"
          >
            {(file.size / (1024 * 1024)).toFixed(2)} MB
          </motion.p>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onRemove}
            className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 text-blue-500"
          >
            <IconX size={16} />
          </motion.button>
        </div>
      </div>

      <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600 montserrat-font-medium">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          layout
          className="px-1 py-0.5 rounded-md bg-gray-100"
        >
          {file.type}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          layout
        >
          modified{" "}
          {new Date(file.lastModified).toLocaleDateString()}
        </motion.p>
      </div>
      
      <FileActions 
        onVerify={onVerify}
        onSubmit={onSubmit}
        isVerifying={isVerifying}
        isUploading={isUploading}
        file={file}
        selectedDocType={selectedDocType}
      />
    </motion.div>
  );
};

const FileActions = ({ 
  onVerify, 
  onSubmit, 
  isVerifying, 
  isUploading, 
  file, 
  selectedDocType 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full mt-4 flex justify-end gap-2"
    > 
      <button
        onClick={onSubmit}
        disabled={isUploading || !file || !selectedDocType}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium montserrat-font-medium",
          isUploading || !file || !selectedDocType
            ? "bg-blue-300 cursor-not-allowed" 
            : "bg-blue-500 hover:bg-blue-600"
        )}
      >
        {isUploading ? (
          <span className="animate-pulse">Processing...</span>
        ) : (
          "Process Document"
        )}
      </button>
    </motion.div>
  );
};