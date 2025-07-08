import React from "react";
import {
  FaFileUpload,
  FaSearchDollar,
  FaChartLine,
  FaComments,
} from "react-icons/fa";

const timelineData = [
  {
    time: "Step 1",
    title: "Upload Financial Documents",
    description:
      "Easily upload your receipts, invoices, or complete financial statements in PDF or text format. Our system supports various formats and ensures your data is securely processed.",
    icon: <FaFileUpload className="h-6 w-6" />,
    color: "bg-blue-500",
  },
  {
    time: "Step 2",
    title: "OCR Data Extraction",
    description:
      "Our advanced OCR engine automatically scans and extracts critical financial details — including income, expenses, tax deductions, vendor names, and transaction dates — with high accuracy.",
    icon: <FaSearchDollar className="h-6 w-6"/>,
    color: "bg-blue-500",
  },
  {
    time: "Step 3",
    title: "AI-Powered Tax Optimization",
    description:
      "Using the extracted data, our intelligent system analyzes patterns and identifies legal, personalized strategies to minimize your tax liability — saving you both time and money.",
    icon: <FaChartLine className="h-6 w-6"/>,
    color: "bg-blue-500",
  },
  {
    time: "Step 4",
    title: "Talk to Your AI Accountant",
    description:
      "Got questions? Our AI accountant chatbot provides clear, human-like answers about your finances — no jargon, no waiting, and no need for a traditional accountant.",
    icon: <FaComments className="h-6 w-6"/>,
    color: "bg-blue-500",
  },
];

const Steps = () => {
  return (
    <div className="w-full bg-black pb-32" id="steps" >
      <div className="relative max-w-5xl mx-auto px-10 py-32">
        {/* Center Line */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-500 z-0" />

        <div className="flex flex-col space-y-12 relative z-10">
          {timelineData.map((item, index) => {
            const isLeft = index % 2 === 0;

            return (
              <div
                key={index}
                className="flex justify-between items-center w-full montserrat-font-medium "
              >
                {/* Left content */}
                {isLeft ? (
                  <>
                    <div className="w-5/12 text-right pr-4 text-white">
                      <p className="text-lg montserrat-font-medium text-blue-500 ">{item.time}</p>
                      <h3 className="text-2xl font-semibold montserrat-font-medium">{item.title}</h3>
                      <p className="montserrat-font-medium">{item.description}</p>
                    </div>
                    {/* Center dot */}
                    <div className="relative w-12 h-12 flex items-center justify-center rounded-full z-20 bg-blue-500 ">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md ${
                          item.outlined ? item.color : item.color
                        }`}
                      >
                        {item.icon}
                      </div>
                    </div>
                    <div className="w-5/12" />
                  </>
                ) : (
                  <>
                    <div className="w-5/12" />
                    {/* Center dot */}
                    <div className="relative w-12 h-12 flex items-center justify-center rounded-full z-20 bg-white">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md ${
                          item.outlined ? item.color : item.color
                        }`}
                      >
                        {item.icon}
                      </div>
                    </div>
                    <div className="w-5/12 pl-4 text-left text-white">
                      <p className="text-lg montserrat-font-medium text-blue-500">{item.time}</p>
                      <h3 className="text-2xl font-semibold montserrat-font-medium">{item.title}</h3>
                      <p className="montserrat-font-medium">{item.description}</p>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Steps;
