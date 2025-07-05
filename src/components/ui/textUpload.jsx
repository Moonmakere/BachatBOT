import { cn } from "../../lib/utils";
import React, { useState } from "react";
import { motion } from "motion/react";
import {
  IconCheck,
  IconAlertCircle,
  IconFileAnalytics,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import axios from "axios";

const formVariant = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
};

export const AccountingFormInput = ({
  onSuccess,
  onError,
  apiEndpoint = "/api/process-form-data", // Default API endpoint
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDocType, setSelectedDocType] = useState(null);
  const [formData, setFormData] = useState({
    // Bills & Invoices fields
    bills: {
      vendor: "",
      invoiceNumber: "",
      issueDate: "",
      dueDate: "",
      totalAmount: "",
      items: [{ description: "", amount: "" }],
    },
    // Investments fields
    investment: {
      institution: "",
      accountNumber: "",
      investmentType: "",
      transactionDate: "",
      amount: "",
      shares: "",
      pricePerShare: "",
      transactionType: "buy", // Default to "buy"
    },
    // Salary fields
    spending: {
      employer: "",
      payPeriod: "",
      grossAmount: "",
      netAmount: "",
      taxWithheld: "",
      deductions: [{ description: "", amount: "" }],
    },
  });

  const handleTypeSelection = (type) => {
    // If the type is already selected, deselect it
    if (selectedDocType === type) {
      setSelectedDocType(null);
    } else {
      // Otherwise, select the new type (replacing any existing selection)
      setSelectedDocType(type);
    }
    setError(null);
  };

  const handleChange = (category, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const handleArrayItemChange = (category, index, field, value) => {
    const newArray = [...formData[category][field]];
    newArray[index] = {
      ...newArray[index],
      [field === "items" ? "description" : "description"]: value,
    };

    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: newArray,
      },
    }));
  };

  const handleAmountChange = (category, index, field, value) => {
    const newArray = [...formData[category][field]];
    newArray[index] = {
      ...newArray[index],
      amount: value,
    };

    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: newArray,
      },
    }));
  };

  const addItem = (category, field) => {
    const newArray = [
      ...formData[category][field],
      { description: "", amount: "" },
    ];

    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: newArray,
      },
    }));
  };

  const removeItem = (category, field, index) => {
    const newArray = [...formData[category][field]];
    newArray.splice(index, 1);

    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: newArray,
      },
    }));
  };

  const validateSubmission = () => {
    if (!selectedDocType) {
      setError("Please select a document category");
      return false;
    }

    const currentData = formData[selectedDocType];
    const requiredFields = {
      bills: ["vendor", "totalAmount"],
      investment: ["institution", "amount", "transactionType"],
      spending: ["employer", "grossAmount", "netAmount"],
    };

    for (const field of requiredFields[selectedDocType]) {
      if (!currentData[field] || currentData[field].trim() === "") {
        setError(`Please fill in the required field: ${field}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any existing errors
    setError(null);

    // Validate submission
    if (!validateSubmission()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create document type object with only the selected type set to true
      const documentType = {
        bills: selectedDocType === "bills",
        investment: selectedDocType === "investment",
        spending: selectedDocType === "spending",
      };

      // Prepare data for API request
      const submissionData = {
        documentType: selectedDocType,
        documentTypes: documentType,
        formData: formData[selectedDocType],
      };

      // Make API request using axios
      const response = await axios.post(apiEndpoint, submissionData, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 seconds timeout
      });

      // Handle successful response
      if (response.status === 200) {
        if (onSuccess) {
          onSuccess(response.data);
        }
        // Reset form after successful submission
        setSelectedDocType(null);
      } else {
        throw new Error(`Server responded with status code ${response.status}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);

      const errorMessage =
        error.message || "Failed to submit form. Please try again.";
      setError(errorMessage);

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renders the appropriate form based on the selected document type
  const renderForm = () => {
    if (!selectedDocType) return null;

    switch (selectedDocType) {
      case "bills":
        return (
          <motion.div
            initial="initial"
            animate="animate"
            variants={formVariant}
            className="mt-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
          >
            <h3 className="text-lg font-medium text-gray-800 mb-4 montserrat-font-medium">
              Bills & Invoices Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 montserrat-font-medium">
                  Vendor/Company Name *
                </label>
                <input
                  type="text"
                  value={formData.bills.vendor}
                  onChange={(e) =>
                    handleChange("bills", "vendor", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter vendor name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 montserrat-font-medium">
                  Invoice Number
                </label>
                <input
                  type="text"
                  value={formData.bills.invoiceNumber}
                  onChange={(e) =>
                    handleChange("bills", "invoiceNumber", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter invoice number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 montserrat-font-medium">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={formData.bills.issueDate}
                  onChange={(e) =>
                    handleChange("bills", "issueDate", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 montserrat-font-medium">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.bills.dueDate}
                  onChange={(e) =>
                    handleChange("bills", "dueDate", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1 montserrat-font-medium">
                Total Amount *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  value={formData.bills.totalAmount}
                  onChange={(e) =>
                    handleChange("bills", "totalAmount", e.target.value)
                  }
                  className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 montserrat-font-medium">
                  Line Items
                </label>
                <button
                  type="button"
                  onClick={() => addItem("bills", "items")}
                  className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700 montserrat-font-medium"
                >
                  <IconPlus size={16} />
                  Add Item
                </button>
              </div>

              {formData.bills.items.map((item, index) => (
                <div key={index} className="flex gap-3 mb-2">
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        handleArrayItemChange(
                          "bills",
                          index,
                          "items",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Item description"
                    />
                  </div>
                  <div className="w-32">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) =>
                          handleAmountChange(
                            "bills",
                            index,
                            "items",
                            e.target.value
                          )
                        }
                        className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                  {formData.bills.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem("bills", "items", index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <IconTrash size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        );

      case "investment":
        return (
          <motion.div
            initial="initial"
            animate="animate"
            variants={formVariant}
            className="mt-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
          >
            <h3 className="text-lg font-medium text-gray-800 mb-4 montserrat-font-medium">
              Investment Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 montserrat-font-medium">
                  Financial Institution *
                </label>
                <input
                  type="text"
                  value={formData.investment.institution}
                  onChange={(e) =>
                    handleChange("investment", "institution", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter institution name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 montserrat-font-medium">
                  Account Number
                </label>
                <input
                  type="text"
                  value={formData.investment.accountNumber}
                  onChange={(e) =>
                    handleChange("investment", "accountNumber", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter account number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 montserrat-font-medium">
                  Investment Type
                </label>
                <select
                  value={formData.investment.investmentType}
                  onChange={(e) =>
                    handleChange("investment", "investmentType", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select type</option>
                  <option value="stock">Stock</option>
                  <option value="bond">Bond</option>
                  <option value="mutual_fund">Mutual Fund</option>
                  <option value="etf">ETF</option>
                  <option value="crypto">Cryptocurrency</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 montserrat-font-medium">
                  Transaction Date
                </label>
                <input
                  type="date"
                  value={formData.investment.transactionDate}
                  onChange={(e) =>
                    handleChange(
                      "investment",
                      "transactionDate",
                      e.target.value
                    )
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 montserrat-font-medium">
                  Transaction Type *
                </label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={formData.investment.transactionType === "buy"}
                      onChange={() =>
                        handleChange("investment", "transactionType", "buy")
                      }
                      className="form-radio h-4 w-4 text-blue-500"
                    />
                    <span className="ml-2 text-gray-700 montserrat-font-medium">
                      Buy
                    </span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={formData.investment.transactionType === "sell"}
                      onChange={() =>
                        handleChange("investment", "transactionType", "sell")
                      }
                      className="form-radio h-4 w-4 text-blue-500"
                    />
                    <span className="ml-2 text-gray-700 montserrat-font-medium">
                      Sell
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 montserrat-font-medium">
                  Amount *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    value={formData.investment.amount}
                    onChange={(e) =>
                      handleChange("investment", "amount", e.target.value)
                    }
                    className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 montserrat-font-medium">
                  Number of Shares
                </label>
                <input
                  type="number"
                  value={formData.investment.shares}
                  onChange={(e) =>
                    handleChange("investment", "shares", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  step="0.001"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 montserrat-font-medium">
                  Price Per Share
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    value={formData.investment.pricePerShare}
                    onChange={(e) =>
                      handleChange(
                        "investment",
                        "pricePerShare",
                        e.target.value
                      )
                    }
                    className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "spending":
        return (
          <motion.div
            initial="initial"
            animate="animate"
            variants={formVariant}
            className="mt-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
          >
            <h3 className="text-lg font-medium text-gray-800 mb-4 montserrat-font-medium">
              Salary/Income Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 montserrat-font-medium">
                  Employer/Source *
                </label>
                <input
                  type="text"
                  value={formData.spending.employer}
                  onChange={(e) =>
                    handleChange("spending", "employer", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter employer name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 montserrat-font-medium">
                  Pay Period
                </label>
                <input
                  type="text"
                  value={formData.spending.payPeriod}
                  onChange={(e) =>
                    handleChange("spending", "payPeriod", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Jan 1 - Jan 15, 2025"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 montserrat-font-medium">
                  Gross Amount *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    value={formData.spending.grossAmount}
                    onChange={(e) =>
                      handleChange("spending", "grossAmount", e.target.value)
                    }
                    className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 montserrat-font-medium">
                  Net Amount *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    value={formData.spending.netAmount}
                    onChange={(e) =>
                      handleChange("spending", "netAmount", e.target.value)
                    }
                    className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 montserrat-font-medium">
                  Tax Withheld
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    value={formData.spending.taxWithheld}
                    onChange={(e) =>
                      handleChange("spending", "taxWithheld", e.target.value)
                    }
                    className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 montserrat-font-medium">
                  Deductions
                </label>
                <button
                  type="button"
                  onClick={() => addItem("spending", "deductions")}
                  className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700 montserrat-font-medium"
                >
                  <IconPlus size={16} />
                  Add Deduction
                </button>
              </div>

              {formData.spending.deductions.map((deduction, index) => (
                <div key={index} className="flex gap-3 mb-2">
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={deduction.description}
                      onChange={(e) =>
                        handleArrayItemChange(
                          "spending",
                          index,
                          "deductions",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Deduction description (e.g., 401k, Health Insurance)"
                    />
                  </div>
                  <div className="w-32">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        value={deduction.amount}
                        onChange={(e) =>
                          handleAmountChange(
                            "spending",
                            index,
                            "deductions",
                            e.target.value
                          )
                        }
                        className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                  {formData.spending.deductions.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        removeItem("spending", "deductions", index)
                      }
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <IconTrash size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
          <IconAlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <h2 className="text-5xl font-semibold text-blue-500 mb-4 montserrat-font-medium">
          Manual Data Entry
        </h2>
        <p className="text-gray-600 mb-4 montserrat-font-medium">
          Enter your financial information manually using the form below:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div
            onClick={() => handleTypeSelection("bills")}
            className={cn(
              "flex items-center gap-2 p-4 rounded-lg cursor-pointer border-2 transition-all",
              selectedDocType === "bills"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            )}
          >
            <div
              className={cn(
                "w-5 h-5 rounded-full border flex items-center justify-center",
                selectedDocType === "bills"
                  ? "bg-blue-500 border-blue-500"
                  : "border-gray-400"
              )}
            >
              {selectedDocType === "bills" && (
                <IconCheck size={14} className="text-white" />
              )}
            </div>
            <span className="font-medium montserrat-font-medium">
              Bills & Invoices
            </span>
          </div>

          <div
            onClick={() => handleTypeSelection("investment")}
            className={cn(
              "flex items-center gap-2 p-4 rounded-lg cursor-pointer border-2 transition-all",
              selectedDocType === "investment"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            )}
          >
            <div
              className={cn(
                "w-5 h-5 rounded-full border flex items-center justify-center",
                selectedDocType === "investment"
                  ? "bg-blue-500 border-blue-500"
                  : "border-gray-400"
              )}
            >
              {selectedDocType === "investment" && (
                <IconCheck size={14} className="text-white" />
              )}
            </div>
            <span className="font-medium montserrat-font-medium">
              Investments
            </span>
          </div>

          <div
            onClick={() => handleTypeSelection("spending")}
            className={cn(
              "flex items-center gap-2 p-4 rounded-lg cursor-pointer border-2 transition-all",
              selectedDocType === "spending"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            )}
          >
            <div
              className={cn(
                "w-5 h-5 rounded-full border flex items-center justify-center",
                selectedDocType === "spending"
                  ? "bg-blue-500 border-blue-500"
                  : "border-gray-400"
              )}
            >
              {selectedDocType === "spending" && (
                <IconCheck size={14} className="text-white" />
              )}
            </div>
            <span className="font-medium montserrat-font-medium">Salary</span>
          </div>
        </div>

        {renderForm()}

        {selectedDocType && (
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-md text-white font-medium montserrat-font-medium",
                isSubmitting
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              )}
            >
              {isSubmitting ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                <>
                  <IconFileAnalytics size={18} />
                  Submit for Processing
                </>
              )}
            </button>
          </div>
        )}
      </form>

      <div className="mt-8 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="text-lg font-medium text-blue-800 mb-2 montserrat-font-medium">
          Need Help?
        </h3>
        <p className="text-blue-700 montserrat-font-medium">
          If you have questions about how to fill out this form or what
          information to include, please refer to our
          <a
            href="/documentation"
            className="text-blue-600 underline hover:text-blue-900 ml-1"
          >
            documentation
          </a>{" "}
          or
          <a
            href="/support"
            className="text-blue-600 underline hover:text-blue-900 ml-1"
          >
            contact our support team
          </a>
        </p>
      </div>
    </div>
  );
};

export default AccountingFormInput;
