
# BachatBot: Your AI-Powered Financial Assistant

<p align="center">
  <img src="Screenshot 2025-07-07 232418.png" alt="BachatBot Banner"/>
</p>

**🏆 1st Place Winner (out of 1000+ Teams) | AI Hiring Show by Rabbitt Learning 🏆**

**BachatBot** is a sophisticated, AI-driven financial assistant designed to demystify personal finance for the Indian market. Born from the **AI Hiring Show by Rabbitt Learning**, where it secured **1st Place out of over 1000 participating teams**, BachatBot provides personalized banking, insurance, and tax advisory services, empowering users to make brilliant financial decisions with ease and confidence.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-black?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-green?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-blue?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 🎯 The Problem: Financial Complexity in India

The Indian financial landscape is a maze of complex products and dense jargon. This leads to:
*   **Poor Planning**: 60% of middle-income earners live paycheck to paycheck, with 45% failing to optimize taxes.
*   **Missed Opportunities**: A significant number of taxpayers overlook major tax-saving options under sections 80C, 80D, 24B, and NPS.
*   **Ineffective Tracking**: 70% of salaried individuals struggle to track expenses, hindering their ability to build wealth.

## ✨ Our Solution: An Intelligent Financial Co-Pilot

BachatBot is an AI-powered system designed to be the ultimate financial co-pilot. It understands financial documents, automates data analysis, and offers hyper-personalized tax-saving and investment advice, all within a secure and user-friendly platform.

### Core Features:
-   **🤖 Advanced OCR & Document Intelligence**: Securely upload financial documents (bills, salary slips, investment statements). Our AI pipeline, powered by **EasyOCR** and **OpenCV** for image processing and text extraction, intelligently analyzes the document. The extracted text is then structured by **Google Gemini**, turning unstructured data into actionable insights.
-   **💬 Intelligent Tax Chatbot (RAG-Powered)**: Ask complex questions about Indian tax law in plain English. Our chatbot uses a Retrieval-Augmented Generation (RAG) pipeline to provide accurate, context-aware answers from a specialized knowledge base.
-   **💸 Dual-Regime Tax Calculator & Advisor**: Input your financial data to see a real-time, side-by-side comparison of your tax liability under the Old and New Indian tax regimes.
-   **📈 Personalized AI Reports**: Generate comprehensive financial reports with actionable investment and tax-saving strategies, powered by Google Gemini.
-   **☂️ AI Insurance Advisor**: A dedicated module that connects to a Streamlit-powered interface, helping users find the best insurance policies (term, health, etc.) tailored to their age, income, and risk profile.
-   **🔒 Secure User Authentication & Profile Management**: A complete auth system with JWT, email verification, and a detailed user profile manager.


### ✨ Feature Spotlight: AI Insurance Advisor

Navigating the complex world of insurance is a major challenge. To address this, BachatBot includes a dedicated **AI Insurance Advisor**, an interactive tool designed to help users find the perfect policies tailored to their unique financial situation and life stage.

The advisor is seamlessly integrated into the main dashboard, providing a specialized environment for in-depth analysis without cluttering the primary user experience. It turns a confusing process into a simple conversation.

| 1. Start the Conversation | 2. Get Instant, Personalized Analysis | 3. Receive Actionable Advice |
| :------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------: |
| ![AI Insurance Advisor Welcome Screen](AI%20INSURANCE%20BUDDY%20-%201.png) | ![AI Insurance Advisor Full UI](AI%20INSURANCE%20BUDDY%20-%202.png) | ![AI Insurance Advisor Detailed Calculation](AI%20INSURANCE%20BUDDY%20-%203.png) |
| *The advisor begins with a simple, conversational prompt, making it easy for users to provide their details.* | *The AI immediately processes the user's profile within a full-featured interface to begin the recommendation process.* | *Users receive a clear, transparent breakdown of the recommended coverage and its estimated premium.* |

### Technical Rationale: Why Streamlit?

We chose **Streamlit** for the AI Insurance Advisor to leverage its strengths in rapidly building interactive, data-centric applications. This architectural decision allows us to:

-   **Decouple Specialized Tools:** Keep the main Next.js application lean and focused on core financial management, while offering a powerful, dedicated tool for a specific, complex task like insurance planning.
-   **Accelerate Development:** Quickly iterate on the insurance analysis model and its user interface without needing to redeploy the entire core application.
-   **Provide Rich Interactivity:** Enable complex data visualizations, sliders for risk assessment, and real-time feedback that are native to data science workflows, providing a superior user experience for this specific feature.

## 🏗️ Technical Architecture

BachatBot employs a robust microservices architecture, separating the frontend presentation layer from the specialized AI/ML backend services. This design ensures scalability, maintainability, and resilience.

![Architecture Workflow](Architecture%20BachatBot.png)

## 🔬 Technical Deep Dive

Our implementation showcases a modern, full-stack approach to building AI applications.

#### 1. Frontend: A Modern, Reactive Experience
-   **Framework**: Built with **Next.js 15** and the App Router, leveraging Server Components for performance and Client Components for interactivity.
-   **State Management**: **Redux Toolkit** is used for global state management (e.g., sidebar state), ensuring a predictable and scalable state container.
-   **UI & Styling**: **Tailwind CSS 4** with `tailwind-merge` and `clsx` for a utility-first, conflict-free styling experience. Custom fonts (`ClashDisplay`, `Montserrat`) are loaded via `next/font`.
-   **Animations**: **Framer Motion** is used extensively to create fluid page transitions and micro-interactions, enhancing the user experience.
-   **File Handling**: `react-dropzone` provides a seamless drag-and-drop interface for document uploads.

#### 2. Backend API Gateway & Authentication
-   **Gateway Pattern**: The Next.js API Routes (`/src/app/api`) act as a secure gateway (Backend-for-Frontend), proxying requests to the downstream Python microservices. This simplifies CORS and centralizes API interaction logic.
-   **Authentication**: Secure, token-based authentication is implemented using **JSON Web Tokens (JWT)** and `bcrypt.js` for password hashing.
-   **Session Management**: JWTs are stored in `HttpOnly` cookies for enhanced security against XSS attacks.
-   **Protected Routes**: The `middleware.js` file intercepts requests to protected pages (`/dashboard`, `/profile`), verifying the JWT cookie before allowing access and redirecting unauthenticated users.

#### 3. AI/ML Microservices (Python, Flask, Express)
-   **Document Intelligence Service (`/OCR`)**: An Express.js server acts as a receiver for file uploads. It uses Node.js's `spawn` to invoke a Python script (`bills_and_expense.py`). The Python script leverages **OpenCV** for image preprocessing and **EasyOCR** for robust text extraction. The raw text is then passed to the **Google Gemini API** for intelligent structuring and JSON conversion.
-   **RAG Tax Chatbot Service (`/PlakshaChatbot`)**: A Flask-based service that implements a classic Retrieval-Augmented Generation pipeline.
    -   **Indexing**: Tax law PDFs are loaded using `PyPDFLoader`, split into chunks, and vectorized using **Hugging Face Embeddings** (`sentence-transformers/all-MiniLM-L6-v2`).
    -   **Storage**: The vectors are stored and indexed in a **FAISS** vector store for fast semantic search.
    -   **Retrieval**: On receiving a query, the service retrieves the most relevant document chunks from FAISS.
    -   **Generation**: The retrieved context and the user's query are passed to an LLM (**OpenAI/Gemini**) via **LangChain** to generate a contextually accurate answer.
-   **Tax & Recommendation Service (`/PlakshaRec`)**: A Flask service that exposes a `/generate-report` endpoint. It contains the business logic to calculate tax liabilities for both Old and New regimes and then queries the **Google Gemini** API with a structured prompt to generate personalized financial and investment insights.

## 🛠️ Technology Stack

| Category              | Technologies & Libraries                                                                                             |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Frontend**          | **Next.js 15**, **React 19**, **Redux Toolkit**, **Tailwind CSS 4**, **Framer Motion**, Axios, `react-dropzone`, `lucide-react` |
| **Backend Gateway**   | **Node.js**, Next.js API Routes, Express.js                                                                             |
| **AI Microservices**  | **Python 3**, **Flask**, **OpenCV**, **EasyOCR**                                                                       |
| **Database**          | **MongoDB**, **Mongoose** (for user data)                                                                              |
| **Vector Database**   | **FAISS** (Facebook AI Similarity Search)                                                                              |
| **AI & LLMs**         | **Google Gemini**, **OpenAI GPT-4o**, **LangChain**, **Hugging Face Transformers**                                     |
| **Authentication**    | **JSON Web Tokens (JWT)**, **`bcrypt.js`**, `jsonwebtoken`                                                             |
| **Email Service**     | **Resend** (for email verification)                                                                                    |
| **Tooling & Linting** | **ESLint 9**, `dotenv`, `nodemon`                                                                                      |

## ⚙️ Setup and Installation

### Prerequisites
-   Node.js (v18 or later)
-   Python (v3.9 or later)
-   MongoDB (a local instance or a free cloud service like MongoDB Atlas)

### 1. Environment Configuration
Properly configuring environment variables is crucial for the application to run.

#### A. Root `.env` file (for the Next.js Frontend)
In the project's root directory, create a `.env` file with the following variables. These are used by the Next.js application.
```bash
# .env (Root Directory)

# MongoDB Connection String
MONGODB_URI="ENTER-YOUR-MONGODB-URI"

# JWT Secret for Authentication
JWT_SECRET="this-is-a-very-strong-and-long-secret-key-for-jwt-signing"

# Email Service for Verification
RESEND_API_KEY="your_resend_api_key"
```

#### B. Microservice `.env` files (for Python Backends)
Each Python microservice requires its own `.env` file inside its respective directory (`PlakshaChatbot/`, `PlakshaRec/`, `OCR/`).

-   **For `/PlakshaChatbot`:**
    ```bash
    # PlakshaChatbot/.env
    OPENAI_API_KEY="your_openai_api_key"
    ```
-   **For `/PlakshaRec`:**
    ```bash
    # PlakshaRec/.env
    GEMINI_API_KEY="your_google_gemini_api_key"
    ```
-   **For `/OCR`:**
    ```bash
    # OCR/.env
    GEMINI_API_KEY="your_google_gemini_api_key"
    ```

### 2. Installation & Running the App
1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/your-username/bachatbot.git
    cd bachatbot
    ```
2.  **Install Frontend Dependencies:**
    ```bash
    npm install
    ```
3.  **Setup Python Microservices:**
    For each Python service, create a virtual environment and install its dependencies.
    ```bash
    # Example for the Chatbot service
    cd PlakshaChatbot
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    pip install -r requirements.txt
    cd ..
    ```
    *(Repeat for all Python service directories.)*
4.  **Start the Backend Services:**
    Open separate terminals for each service, activate their environments, and run them.
    ```bash
    # Terminal 1: OCR Document Service (Port 3002)
    cd OCR && npm install && nodemon index.js

    # Terminal 2: Chatbot Service (Port 5000)
    cd PlakshaChatbot && source venv/bin/activate && python app.py

    # Terminal 3: Recommendation Service (Port 7000)
    cd PlakshaRec && source venv/bin/activate && python app.py
    ```
5.  **Start the Frontend:**
    In a new terminal at the project root:
    ```bash
    npm run dev
    ```
6.  **Access BachatBot:** Open your browser and go to `http://localhost:3000`.

## ⚠️ A Note on Intellectual Property and Project Scope
This repository has been prepared for the AI Hiring Show evaluation process. It is designed to showcase our project's architecture, functionality, and the technical expertise of our team.

> To protect our intellectual property and the unique innovations developed during the competition, some of our core AI logic, proprietary scripts, and fine-tuned models have been abstracted or are not included in this public repository. The code provided is sufficient to run a demonstrable version of the platform, but may exceed certain file size limits for direct hosting.
>
> **For a complete, live demonstration of the end-to-end system and a deep dive into our core AI pipeline, please contact a member of our team.**

## 📞 Contact & Technical Support
For any technical questions, setup assistance, or to request a live demonstration, please feel free to reach out to the following:

-   **Email**: [akshatsaraswat1234@gmail.com](mailto:akshatsaraswat1234@gmail.com)
-   **Phone**: `+91 6260109043`


