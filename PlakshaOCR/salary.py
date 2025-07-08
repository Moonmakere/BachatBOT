import sys
import cv2
import numpy as np
import easyocr
import google.generativeai as genai
import json
import time
import os
from PIL import Image

# Initialize EasyOCR reader (forcing CPU to prevent GPU errors)
reader = easyocr.Reader(['en'], gpu=False)

def image_with_bb(image_to_edit, results):
    """Draw bounding boxes around detected text."""
    for detection in results:
        top_left = tuple(map(int, detection[0][1]))
        bottom_right = tuple(map(int, detection[0][3]))
        cv2.rectangle(image_to_edit, top_left, bottom_right, (0, 255, 0), 2)
    return image_to_edit

def process_image(image_data):
    """Process image, apply OCR, and return extracted text & annotated image."""
    try:
        np_arr = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        # Convert image to grayscale and apply adaptive thresholding
        gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        thresh_image = cv2.adaptiveThreshold(gray_image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 199, 5)

        # Run OCR
        result = reader.readtext(thresh_image)
        extracted_text = " ".join([detection[1] for detection in result])

        # Draw bounding boxes on image
        annotated_image = image_with_bb(image, result)

        return extracted_text, annotated_image

    except Exception as e:
        return "", f"❌ Error processing image: {str(e)}"

def load_image(image):
    """Convert OpenCV BGR image to PIL format."""
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    return Image.fromarray(image_rgb)

def generate_salary_prompt(ocr_text):
    """Generate structured prompt for salary extraction."""
    return f"""
    You are a salary document parser. You are given:
    OCR Extracted Text -> {ocr_text}
    Use it to extract the following fields:
    - Salary Income
    - Date (ISO format)
    - Concerned Organization
    - Document Number
    - Payment Method (Bank Transfer, Cash, Cheque, UPI, etc.)
    - HRA Exemption
    - ITA Exemption
    - TDS Deducted
    Return as JSON.
    """

def generate_response_with_retry(model, prompt, image, max_retries=3, delay=5):
    """Retry API call if it fails due to timeout or errors."""
    for attempt in range(max_retries):
        try:
            response = model.generate_content([prompt, image])
            return response.text
        except Exception as e:
            print(f"⚠️ Gemini API error: {e} (Retry {attempt + 1}/{max_retries})")
            time.sleep(delay)

    return json.dumps({"error": "Gemini API failed after retries"})

def master_function():
    """Main function to run OCR and salary extraction."""
    try:
        # Read image from stdin (used when piping from API)
        image_data = sys.stdin.buffer.read()
        extracted_text, annotated_image = process_image(image_data)

        if not extracted_text:
            return json.dumps({"error": "No text extracted from image."})

        # Generate prompt for AI model
        prompt = generate_salary_prompt(extracted_text)
        image_final = load_image(annotated_image)

        # Configure Google Gemini API
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))   # 🔴 REPLACE WITH YOUR ACTUAL API KEY
        model = genai.GenerativeModel("gemini-1.5-flash")

        # Generate structured JSON response using AI
        response = generate_response_with_retry(model, prompt, image_final)

        return response

    except Exception as e:
        return json.dumps({"error": str(e)})

if __name__ == "__main__":
    print(master_function())
