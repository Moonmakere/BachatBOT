// InfoPanel.jsx
import React from "react";
import { IconCheck } from "@tabler/icons-react";

export const InfoPanel = () => {
  return (
    <div className="my-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
      <div className="flex items-start gap-2 montserrat-font-medium">
        <IconCheck size={18} className="text-blue-500 mt-1" />
        <div>
          <p className="text-blue-800 font-medium">AI-Powered Accounting</p>
          <p className="text-sm text-blue-600">
            Documents will be processed with OCR to automatically extract and categorize financial data
          </p>
        </div>
      </div>
    </div>
  );
};