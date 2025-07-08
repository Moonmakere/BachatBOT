"use client";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import SidebarComponent from "../../components/layout/Sidebar";

const TaxDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [userData, setUserData] = useState({
    income_details: {
      salary_income: 1200000,
      rental_income: 240000,
      interest_income: 50000,
      other_income: 25000
    },
    deductions: {
      section_80C: 150000,
      section_80D: 25000,
      section_24B: 200000,
      nps_contribution: 50000
    },
    exemptions: {
      hra_exemption: 100000,
      lta_exemption: 20000,
      other_exemptions: 15000
    },
    tax_paid: {
      tds: 120000,
      advance_tax: 30000,
      self_assessment_tax: 0
    }
  });

  const handleInputChange = (category, field, value) => {
    setUserData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: Number(value)
      }
    }));
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/generate-report", userData);
      setReport(response.data);
      toast.success("Tax report generated successfully");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate tax report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarComponent />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Indian Tax Calculator & Advisor</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Your Financial Data</h2>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Income Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Salary Income</label>
                  <input
                    type="number"
                    value={userData.income_details.salary_income}
                    onChange={(e) => handleInputChange('income_details', 'salary_income', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Rental Income</label>
                  <input
                    type="number"
                    value={userData.income_details.rental_income}
                    onChange={(e) => handleInputChange('income_details', 'rental_income', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Interest Income</label>
                  <input
                    type="number"
                    value={userData.income_details.interest_income}
                    onChange={(e) => handleInputChange('income_details', 'interest_income', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Other Income</label>
                  <input
                    type="number"
                    value={userData.income_details.other_income}
                    onChange={(e) => handleInputChange('income_details', 'other_income', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Deductions</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Section 80C</label>
                  <input
                    type="number"
                    value={userData.deductions.section_80C}
                    onChange={(e) => handleInputChange('deductions', 'section_80C', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Section 80D</label>
                  <input
                    type="number"
                    value={userData.deductions.section_80D}
                    onChange={(e) => handleInputChange('deductions', 'section_80D', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Section 24B</label>
                  <input
                    type="number"
                    value={userData.deductions.section_24B}
                    onChange={(e) => handleInputChange('deductions', 'section_24B', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">NPS Contribution</label>
                  <input
                    type="number"
                    value={userData.deductions.nps_contribution}
                    onChange={(e) => handleInputChange('deductions', 'nps_contribution', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Exemptions</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">HRA Exemption</label>
                  <input
                    type="number"
                    value={userData.exemptions.hra_exemption}
                    onChange={(e) => handleInputChange('exemptions', 'hra_exemption', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">LTA Exemption</label>
                  <input
                    type="number"
                    value={userData.exemptions.lta_exemption}
                    onChange={(e) => handleInputChange('exemptions', 'lta_exemption', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Other Exemptions</label>
                  <input
                    type="number"
                    value={userData.exemptions.other_exemptions}
                    onChange={(e) => handleInputChange('exemptions', 'other_exemptions', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Tax Already Paid</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">TDS</label>
                  <input
                    type="number"
                    value={userData.tax_paid.tds}
                    onChange={(e) => handleInputChange('tax_paid', 'tds', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Advance Tax</label>
                  <input
                    type="number"
                    value={userData.tax_paid.advance_tax}
                    onChange={(e) => handleInputChange('tax_paid', 'advance_tax', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Self Assessment Tax</label>
                  <input
                    type="number"
                    value={userData.tax_paid.self_assessment_tax}
                    onChange={(e) => handleInputChange('tax_paid', 'self_assessment_tax', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
            
            <button
              onClick={generateReport}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-blue-400"
            >
              {loading ? "Generating Report..." : "Generate Tax Report"}
            </button>
          </div>
          
          {/* Results Display */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Your Tax Report</h2>
            
            {!report && !loading && (
              <div className="text-gray-500 text-center p-8">
                Fill in your financial details and generate a report to see your tax calculation and personalized insights.
              </div>
            )}
            
            {loading && (
              <div className="text-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
                <p className="mt-4 text-gray-600">Analyzing your data and generating insights...</p>
              </div>
            )}
            
            {report && !loading && (
              <div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="font-medium text-lg mb-2">Old Tax Regime</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Taxable Income:</span> ₹{report.taxable_income_old.toLocaleString()}</p>
                      <p><span className="font-medium">Tax Amount:</span> ₹{report.total_tax_old.toLocaleString()}</p>
                      <p className={report.tax_due_or_refund_old >= 0 ? "text-green-600" : "text-red-600"}>
                        <span className="font-medium">{report.tax_due_or_refund_old >= 0 ? "Refund" : "Due"}:</span> 
                        ₹{Math.abs(report.tax_due_or_refund_old).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="font-medium text-lg mb-2">New Tax Regime</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Taxable Income:</span> ₹{report.taxable_income_new.toLocaleString()}</p>
                      <p><span className="font-medium">Tax Amount:</span> ₹{report.total_tax_new.toLocaleString()}</p>
                      <p className={report.tax_due_or_refund_new >= 0 ? "text-green-600" : "text-red-600"}>
                        <span className="font-medium">{report.tax_due_or_refund_new >= 0 ? "Refund" : "Due"}:</span> 
                        ₹{Math.abs(report.tax_due_or_refund_new).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-500 mb-4">
                  <h3 className="font-medium text-lg mb-2">Recommended Regime</h3>
                  <p className="font-medium">
                    {report.total_tax_old < report.total_tax_new ? "Old Tax Regime" : "New Tax Regime"} is better for you.
                  </p>
                  <p>
                    You'll save ₹{Math.abs(report.total_tax_old - report.total_tax_new).toLocaleString()} 
                    with the {report.total_tax_old < report.total_tax_new ? "Old" : "New"} regime.
                  </p>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium text-lg mb-3">Personalized Insights</h3>
                  <div className="prose max-w-none">
                    {report.investment_insights ? (
                      <div dangerouslySetInnerHTML={{ __html: report.investment_insights.replace(/\n/g, '<br>') }} />
                    ) : (
                      <p className="text-gray-500">No additional insights available.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxDashboard;