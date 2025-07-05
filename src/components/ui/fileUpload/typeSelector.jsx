// DocumentTypeSelector.jsx
import React from "react";
import { cn } from "../../../lib/utils";
import { IconCheck } from "@tabler/icons-react";

export const DocumentTypeSelector = ({ selectedDocType, onSelectType }) => {
  const documentTypes = [
    { id: 'bills', label: 'Bills & Invoices' },
    { id: 'investment', label: 'Investments' },
    { id: 'spending', label: 'Salary' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {documentTypes.map(type => (
        <div 
          key={type.id}
          onClick={() => onSelectType(type.id)}
          className={cn(
            "flex items-center gap-2 p-4 rounded-lg cursor-pointer border-2 transition-all",
            selectedDocType === type.id 
              ? "border-blue-500 bg-blue-50" 
              : "border-gray-200 hover:border-blue-300"
          )}
        >
          <div className={cn(
            "w-5 h-5 rounded-full border flex items-center justify-center",
            selectedDocType === type.id 
              ? "bg-blue-500 border-blue-500" 
              : "border-gray-400"
          )}>
            {selectedDocType === type.id && <IconCheck size={14} className="text-white" />}
          </div>
          <span className="font-medium montserrat-font-medium">{type.label}</span>
        </div>
      ))}
    </div>
  );
};