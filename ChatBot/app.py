from flask import Flask, request, jsonify
import google.generativeai as genai
from flask_cors import CORS
import os
from dotenv import load_dotenv

# ✅ Load environment variables from .env file
env_path = r"C:\\Users\\aksha\\OneDrive\\Desktop\\EZTax-Plaksha-main\\PlakshaChatbot\\.env"  # Ensure correct path
load_dotenv(env_path)

# ✅ Get API key from environment (no hardcoding)
API_KEY = os.getenv("GEMINI_API_KEY_2")

if not API_KEY:
    raise ValueError("❌ Error: GEMINI_API_KEY_2 not found in .env file!")

# ✅ Configure Gemini API
genai.configure(api_key=API_KEY)

# ✅ Initialize Gemini model
model = genai.GenerativeModel("gemini-1.5-pro-latest")

app = Flask(__name__)
CORS(app)

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        user_message = data.get("message")

        if not user_message:
            return jsonify({"error": "No message provided."}), 400

        response = model.generate_content(user_message)

        if response and response.text:
            return jsonify({
                "source": "Gemini",
                "answer": response.text
            })
        else:
            return jsonify({
                "error": "No valid response from Gemini."
            }), 500

    except Exception as e:
        print(f"❌ Error in /chat: {e}")
        return jsonify({ "error": str(e) }), 500

if __name__ == "_main_":
    app.run(debug=True, host="0.0.0.0", port=5000)