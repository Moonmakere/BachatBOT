from flask import Flask, request, jsonify
import json
import google.generativeai as genai
from dotenv import load_dotenv
import os
 
app = Flask(__name__)
 
# Configure Gemini API
load_dotenv()
 
# Get API key from environment
# API_KEY = os.getenv("GEMINI_API_KEY")
API_KEY = os.getenv("FUNCTION_API_KEY")

# FUNCTION_API_KEY=wqhnQcOlKRHCuiZ1wqXDqQdhSknDpA==
 
if not API_KEY:
    print("❌ API key not found. Please check your .env file.")
else:
    print("✅ API key found!")
 
# Initialize Gemini API
try:
    genai.configure(api_key=API_KEY)
    print("🚀 Gemini API initialized successfully!")
except Exception as e:
    print(f"❌ Error initializing Gemini API: {e}")
 
def get_gemini_insights(user_data):
    prompt = f"""
    Given the following user financial data:
    {json.dumps(user_data, indent=4)}
   
    Provide personalized tax-saving and investment insights, considering the Indian tax laws. Format the response with clear headings and bullet points for readability.
    """
    try:
        # model = genai.GenerativeModel("gemini-1.5-flash")
        model = genai.GenerativeModel("google/gemma-7b-it")
        response = model.generate_content(prompt)
        return response.text if response else "No insights generated."
    except Exception as e:
        return f"Error fetching insights from Gemini: {e}"
 
@app.route("/generate-report", methods=["POST"])
def generate_report():
    try:
        user_data = request.json
        if not user_data:
            return jsonify({"error": "Invalid input data"}), 400
 
        tax_report = compute_tax_report(user_data)
        return jsonify(tax_report)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
 
def compute_tax_report(user_data):
    def get_value(data, key, default=0):
        return data.get(key, default)
 
    income_details = user_data.get("income_details", {})
    deductions = user_data.get("deductions", {})
    exemptions = user_data.get("exemptions", {})
    tax_paid = user_data.get("tax_paid", {})
 
    salary_income = get_value(income_details, "salary_income")
    rental_income = get_value(income_details, "rental_income")
    interest_income = get_value(income_details, "interest_income")
    other_income = get_value(income_details, "other_income")
 
    section_80C = get_value(deductions, "section_80C", 150000)
    section_80D = get_value(deductions, "section_80D", 25000)
    section_24B = get_value(deductions, "section_24B", 200000)
    nps_contribution = get_value(deductions, "nps_contribution", 50000)
 
    hra_exemption = get_value(exemptions, "hra_exemption", 100000)
    lta_exemption = get_value(exemptions, "lta_exemption", 20000)
    other_exemptions = get_value(exemptions, "other_exemptions", 15000)
 
    tds_paid = get_value(tax_paid, "tds")
    advance_tax_paid = get_value(tax_paid, "advance_tax")
    self_assessment_tax = get_value(tax_paid, "self_assessment_tax")
 
    total_income = salary_income + rental_income + interest_income + other_income
    total_exemptions = hra_exemption + lta_exemption + other_exemptions
    total_deductions = section_80C + section_80D + section_24B + nps_contribution
 
    taxable_income_old = max(total_income - total_exemptions - total_deductions, 0)
    taxable_income_new = max(total_income - 50000, 0)
 
    def calculate_old_tax(income):
        tax = 0
        if income <= 250000:
            return 0
        if income > 1000000:
            tax += (income - 1000000) * 0.3
            income = 1000000
        if income > 500000:
            tax += (income - 500000) * 0.2
            income = 500000
        if income > 250000:
            tax += (income - 250000) * 0.05
        return tax
 
    def calculate_new_tax(income):
        tax = 0
        if income <= 300000:
            return 0
        if income > 1500000:
            tax += (income - 1500000) * 0.3
            income = 1500000
        if income > 1200000:
            tax += (income - 1200000) * 0.2
            income = 1200000
        if income > 900000:
            tax += (income - 900000) * 0.15
            income = 900000
        if income > 600000:
            tax += (income - 600000) * 0.1
            income = 600000
        if income > 300000:
            tax += (income - 300000) * 0.05
        return tax
 
    total_tax_old = calculate_old_tax(taxable_income_old)
    total_tax_new = calculate_new_tax(taxable_income_new)
 
    if taxable_income_old <= 500000:
        total_tax_old = 0
    if taxable_income_new <= 700000:
        total_tax_new = 0
 
    total_tax_old *= 1.04
    total_tax_new *= 1.04
 
    total_tax_paid = tds_paid + advance_tax_paid + self_assessment_tax
    tax_due_or_refund_old = total_tax_paid - total_tax_old
    tax_due_or_refund_new = total_tax_paid - total_tax_new
 
    gemini_insights = get_gemini_insights(user_data)
 
    return {
        "total_income": total_income,
        "taxable_income_old": taxable_income_old,
        "taxable_income_new": taxable_income_new,
        "total_tax_old": round(total_tax_old, 2),
        "total_tax_new": round(total_tax_new, 2),
        "tax_due_or_refund_old": round(tax_due_or_refund_old, 2),
        "tax_due_or_refund_new": round(tax_due_or_refund_new, 2),
        "investment_insights": gemini_insights,
    }
 
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7000, debug=True)
 