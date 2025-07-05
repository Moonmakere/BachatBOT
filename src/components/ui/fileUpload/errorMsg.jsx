// ErrorMessage.jsx
import React from "react";
import { IconAlertCircle } from "@tabler/icons-react";

export const ErrorMessage = ({ message }) => {
  return (
    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
      <IconAlertCircle size={18} />
      <span>{message}</span>
    </div>
  );
};