import React from "react";
import {
  FaLink, // Icon for linking accounts
  FaMagic, // Icon for AI analysis
  FaLightbulb, // Icon for insights/recommendations
  FaComments,
} from "react-icons/fa";

// --- NEW, USER-CENTRIC TIMELINE FOR BACHAT BOT ---
const timelineData = [
  {
    time: "Step 1",
    title: "Securely Link Your Accounts",
    description:
      "Connect your bank accounts in minutes using our secure, encrypted platform. Bachat Bot creates a unified view of your finances without ever storing your credentials.",
    icon: <FaLink className="h-6 w-6" />, // Changed Icon
    color: "bg-blue-500",
  },
  {
    time: "Step 2",
    title: "Let the AI Work Its Magic",
    description:
      "Our intelligent bot analyzes your income, spending, and investments in real-time. It automatically categorizes transactions to understand your complete financial picture.",
    icon: <FaMagic className="h-6 w-6" />, // Changed Icon
    color: "bg-blue-500",
  },
  {
    time: "Step 3",
    title: "Get Personalized Insights",
    description:
      "Receive actionable recommendations tailored just for you. From maximizing tax savings and finding better investment opportunities to choosing the right insurance plan.",
    icon: <FaLightbulb className="h-6 w-6" />, // Changed Icon
    color: "bg-blue-500",
  },
  {
    time: "Step 4",
    title: "Chat with Your Financial Dost",
    description:
      "Have questions? Just ask! Your 24/7 AI companion provides clear, simple answers about your finances, helping you make smarter decisions with confidence.",
    icon: <FaComments className="h-6 w-6" />,
    color: "bg-blue-500",
  },
];

const Steps = () => {
  return (
    <div className="w-full bg-black pb-32" id="steps">
      {/* --- ADD A TITLE TO THE SECTION --- */}
      <h2 className="text-6xl font-bold text-white text-center pt-20 montserrat-font-medium">
        Getting Started is Easy
      </h2>
      <div className="relative max-w-5xl mx-auto px-10 pt-20 pb-10">
        {" "}
        {/* Adjusted padding */}
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
                      <p className="text-lg montserrat-font-medium text-blue-500 ">
                        {item.time}
                      </p>
                      <h3 className="text-2xl font-semibold montserrat-font-medium">
                        {item.title}
                      </h3>
                      <p className="montserrat-font-medium">
                        {item.description}
                      </p>
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
                      <p className="text-lg montserrat-font-medium text-blue-500">
                        {item.time}
                      </p>
                      <h3 className="text-2xl font-semibold montserrat-font-medium">
                        {item.title}
                      </h3>
                      <p className="montserrat-font-medium">
                        {item.description}
                      </p>
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
