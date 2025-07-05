# 🔧 Step 1: Import necessary packages
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import time
import threading
from dotenv import load_dotenv
import os

# 🔧 Step 2: Load environment variables (Optional if using .env file)
load_dotenv()

# 🌐 Set your Function.Network API Key
FUNCTION_API_KEY = "wqhnQcOlKRHCuiZ1wqXDqQdhSknDpA=="  # Replace this with your key

# ✅ Create Flask app
app = Flask(__name__)
CORS(app)

def call_function_network_llm(prompt):
    url = "https://api.function.network/v1/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {FUNCTION_API_KEY}"
    }
    data = {
        "model": "thebloke/mistral-7b-instruct-v0.1-awq",  # Make sure this is an allowed model
        "prompt": prompt,
        "max_tokens": 200
    }
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        return response.json().get("choices", [{}])[0].get("text", "⚠️ No output received.")
    except requests.exceptions.RequestException as e:
        print(f"❌ API Error: {e}")
        return "⚠️ Failed to get response."

# ✅ Create /chat endpoint
@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message", "")
    answer = call_function_network_llm(user_message)
    return jsonify({"answer": answer, "source": "Function.Network"})

# ✅ Start Flask server with ngrok
port = 5000

# Run in background
def run():
    app.run(port=port)

threading.Thread(target=run).start()

# ✅ Optional: Test the endpoint
time.sleep(2)
test = requests.post(f"http://127.0.0.1:{port}/chat", json={"message": "what is 80c?"})

print("✅ Test Response:", test.json())
