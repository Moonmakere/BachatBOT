import sys
import json
import cv2
import numpy as np
from PIL import Image
import easyocr
import google.generativeai as genai
import os
import traceback

# Debug information
print(f"Python script starting. Arguments: {sys.argv}", file=sys.stderr)
print(f"Current working directory: {os.getcwd()}", file=sys.stderr)

# Check if command line arguments are provided
if len(sys.argv) < 3:
    print(json.dumps({"error": "Missing arguments. Usage: python process_document.py <file_path> <document_type>"}))
    sys.exit(1)

# Get file path and document type from command line arguments
file_path = sys.argv[1]
document_type = sys.argv[2]

# Debug file info
print(f"File path: {file_path}", file=sys.stderr)
print(f"File exists: {os.path.exists(file_path)}", file=sys.stderr)
print(f"Document type: {document_type}", file=sys.stderr)

# Initialize EasyOCR reader
try:
    reader = easyocr.Reader(['en'], gpu=False)  # Set gpu=True if available
    print("EasyOCR initialized successfully", file=sys.stderr)
except Exception as e:
    print(json.dumps({"error": f"Failed to initialize EasyOCR: {str(e)}"}))
    sys.exit(1)

def image_with_bb(image_to_edit, results):
    """Draw bounding boxes around detected text"""
    for detection in results: 
        top_left = tuple(map(int, detection[0][0]))
        bottom_right = tuple(map(int, detection[0][2]))
        text = detection[1]
        cv2.rectangle(image_to_edit, top_left, bottom_right, (0, 255, 0), 2)
    return image_to_edit

def final_out(file_path):
    """Process the image with OCR"""
    try:
        print(f"Reading image from: {file_path}", file=sys.stderr)
        image = cv2.imread(file_path)
        if image is None:
            print(f"Could not read image file: {file_path}", file=sys.stderr)
            return f"Error: Could not read image file: {file_path}", None
        
        print(f"Image shape: {image.shape}", file=sys.stderr)
        image_gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) 
        thresh2 = cv2.adaptiveThreshold(image_gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 199, 5)
        
        print("Starting OCR processing", file=sys.stderr)
        result = reader.readtext(image_gray)
        print(f"OCR completed with {len(result)} text regions detected", file=sys.stderr)
        
        extracted_text = ""
        for detection in result:
            extracted_text = extracted_text + " " + detection[1]
        
        print(f"Extracted text length: {len(extracted_text)}", file=sys.stderr)
        extracted_image = image_with_bb(image.copy(), result)   
        return extracted_text, extracted_image
    except Exception as e:
        error_msg = f"Error during OCR processing: {str(e)}\n{traceback.format_exc()}"
        print(error_msg, file=sys.stderr)
        return error_msg, None

def load_image(image_input):
    """Convert OpenCV image to PIL Image for Gemini API"""
    # Convert OpenCV image (BGR) to RGB for compatibility with PIL
    image_rgb = cv2.cvtColor(image_input, cv2.COLOR_BGR2RGB)
    # Convert OpenCV image to PIL Image
    pil_image = Image.fromarray(image_rgb)
    return pil_image

def generate_prompt(ocr_text, doc_type):
    """Generate an appropriate prompt based on document type"""
    if doc_type == 'investment':
        return f"""You are an investment document parser. You are given:
this is the OCR Extracted Text -> {ocr_text} along with it I have also uploaded the OCR extracted bounded box image.
Use both inputs to extract only relevant investment details useful for financial records, tax deductions, or portfolio tracking. 
Match labels with values accurately using bounding positions to eliminate OCR misalignment or duplicates.

Extract the following fields for each identified investment entry:
- totalAmount  
- date (in ISO format if possible)  
- organization
- documentNumber (Transaction ID, Reference No., or Policy No.)  
- investmentType (choose from: Stocks, Mutual Funds, Fixed Deposit, Bonds, Real Estate, Crypto, PPF, Other)  
- paymentMethod (optional: Cash, Card, Bank Transfer, UPI, etc.)  
- lockInPeriod (if applicable)  
- maturityDate (if applicable)  
- taxBenefits (true/false based on investment type)  

Return the result as a single JSON object with these field names exactly as specified above. 
Do not include null or undefined values. Format as valid JSON.
"""
    elif doc_type == 'bills':
        return f"""You are a bills and invoice parser. You are given:
this is the OCR Extracted Text -> {ocr_text} along with it I have also uploaded the OCR extracted bounded box image.
Use both inputs to extract only relevant invoice details useful for expense tracking and accounting.
Match labels with values accurately using bounding positions to eliminate OCR misalignment or duplicates.

Extract the following fields:
- totalAmount
- date (in ISO format if possible)
- vendor
- invoiceNumber
- itemDescription (brief summary of what was purchased)
- category (e.g., Utilities, Groceries, Entertainment, Medical, etc.)
- paymentMethod (if available)
- taxAmount (if shown separately)

Return the result as a single JSON object with these field names exactly as specified above.
Do not include null or undefined values. Format as valid JSON.
"""
    elif doc_type == 'spending':
        return f"""You are a salary/income document parser. You are given:
this is the OCR Extracted Text -> {ocr_text} along with it I have also uploaded the OCR extracted bounded box image.
Use both inputs to extract only relevant salary/income details useful for personal finance tracking.
Match labels with values accurately using bounding positions to eliminate OCR misalignment or duplicates.

Extract the following fields:
- grossAmount
- netAmount
- date (in ISO format if possible)
- employer
- employeeId (if available)
- taxDeductions
- otherDeductions (if available)
- period (e.g., "March 2025", "Q1 2025")

Return the result as a single JSON object with these field names exactly as specified above.
Do not include null or undefined values. Format as valid JSON.
"""
    else:
        return f"""You are a financial document parser. You are given:
this is the OCR Extracted Text -> {ocr_text} along with it I have also uploaded the OCR extracted bounded box image.
Extract all important financial information from this document into a structured JSON format.
Include at least these fields if present:
- amount
- date
- payee/payer
- description
- documentType
- referenceNumber

Return the result as a single valid JSON object.
"""

def process_document(file_path, document_type):
    """Main processing function to extract data from document"""
    try:
        # Extract text and annotated image with OCR
        print("Starting OCR extraction", file=sys.stderr)
        ocr_text, annotated_image = final_out(file_path)
        if annotated_image is None:
            return {"error": ocr_text}  # If OCR failed, return the error message
        
        # Convert the annotated image to PIL format for Gemini
        print("Preparing image for Gemini API", file=sys.stderr)
        image_for_gemini = load_image(annotated_image)
        
        # Generate appropriate prompt based on document type
        prompt = generate_prompt(ocr_text, document_type)
        
        # Configure Gemini API
        print("Configuring Gemini API", file=sys.stderr)
        genai.configure(api_key="AIzaSyC7GK9bFtQ1tbAW6Ld97cqKJ48nblLDIgg")
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        # Generate content with Gemini
        print("Sending request to Gemini API", file=sys.stderr)
        response = model.generate_content([prompt, image_for_gemini])
        
        # Extract JSON from response
        response_text = response.text
        print(f"Response received from Gemini. Text length: {len(response_text)}", file=sys.stderr)
        
        # Try to extract and parse JSON from the response
        try:
            # Look for JSON in the response (sometimes it might be surrounded by markdown code blocks)
            json_text = response_text
            if "json" in response_text:
                print("Extracting JSON from markdown code block", file=sys.stderr)
                json_text = response_text.split("json")[1].split("")[0].strip()
            elif "" in response_text:
                print("Extracting JSON from generic code block", file=sys.stderr)
                json_text = response_text.split("```")[1].strip()
            
            # Parse the JSON
            print(f"Parsing JSON. Text length: {len(json_text)}", file=sys.stderr)
            result_json = json.loads(json_text)
            return result_json
        except json.JSONDecodeError as e:
            # If we can't parse the JSON, return the raw text
            error_msg = f"Could not parse JSON from AI response: {str(e)}"
            print(error_msg, file=sys.stderr)
            return {"error": error_msg, "rawText": response_text}
            
    except Exception as e:
        error_msg = f"Error processing document: {str(e)}\n{traceback.format_exc()}"
        print(error_msg, file=sys.stderr)
        return {"error": error_msg}

# Process the document and print the result as JSON
try:
    print("Starting document processing", file=sys.stderr)
    result = process_document(file_path, document_type)
    print("Document processing completed", file=sys.stderr)
    print(json.dumps(result))
except Exception as e:
    error_msg = f"Unhandled exception: {str(e)}\n{traceback.format_exc()}"
    print(error_msg, file=sys.stderr)
    print(json.dumps({"error": error_msg}))