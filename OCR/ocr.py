import cv2
import pytesseract
import re
import numpy as np

# Make sure Tesseract path is correctly configured
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def extract_text_from_image(image_path):
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    text = pytesseract.image_to_string(thresh)
    return text

def extract_financial_data(text):
    data = {}

    # Salary or CTC
    salary_match = re.search(r'(?:gross|basic|monthly|ctc|salary)[^\d]*(\d[\d,]*)', text, re.IGNORECASE)
    if salary_match:
        salary = int(salary_match.group(1).replace(",", ""))
        data['monthly_salary'] = salary
        data['annual_salary'] = salary * 12

    # HRA
    hra_match = re.search(r'hra[^\d]*(\d[\d,]*)', text, re.IGNORECASE)
    if hra_match:
        data['hra'] = int(hra_match.group(1).replace(",", ""))

    # Deductions under 80C
    ded_match = re.search(r'80C[^\d]*(\d[\d,]*)', text, re.IGNORECASE)
    if ded_match:
        data['deductions_80C'] = int(ded_match.group(1).replace(",", ""))
    else:
        data['deductions_80C'] = 0

    return data

def tax_analysis(data):
    annual_salary = data.get('annual_salary', 0)
    deductions = data.get('deductions_80C', 0)

    # Standard deduction of ₹50,000
    std_deduction = 50000
    total_deductions = std_deduction + deductions
    taxable_income = max(annual_salary - total_deductions, 0)

    # Basic Old Regime Slabs
    if taxable_income <= 250000:
        tax = 0
    elif taxable_income <= 500000:
        tax = 0.05 * (taxable_income - 250000)
    elif taxable_income <= 1000000:
        tax = 12500 + 0.2 * (taxable_income - 500000)
    else:
        tax = 112500 + 0.3 * (taxable_income - 1000000)

    # Rebate under 87A if income < 5L
    if taxable_income <= 500000:
        tax = 0

    data['taxable_income'] = taxable_income
    data['estimated_tax'] = round(tax, 2)

    # Suggestion if under max 80C limit
    if deductions < 150000:
        extra_investment = 150000 - deductions
        potential_saving = extra_investment * 0.2
        data['recommendation'] = f"Invest ₹{extra_investment} more under 80C to save approx ₹{round(potential_saving)} in tax."
    else:
        data['recommendation'] = "You're already claiming full 80C benefits."

    return data

def main(image_path):
    print(f"\n🖼️ Processing image: {image_path}")

    text = extract_text_from_image(image_path)
    print("\n📄 OCR Extracted Text:\n", text)

    financial_data = extract_financial_data(text)
    result = tax_analysis(financial_data)

    print("\n📊 Extracted Financial Information:")
    for key, value in result.items():
        if "salary" in key or "hra" in key or "deduction" in key or "tax" in key:
            print(f"- {key.replace('_', ' ').capitalize()}: ₹{value}")
    print("\n💡 Recommendation:")
    print(result.get("recommendation", "No recommendation."))

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python ocr_tax_analysis.py <image_path>")
    else:
        main(sys.argv[1])
