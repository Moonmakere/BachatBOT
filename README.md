# BachatBot: Your AI-Powered Financial Assistant

<p align="center">
  <img src="Screenshot 2025-07-07 232418.png" alt="BachatBot Banner"/>
</p>

**🏆 1st Place Winner (out of 1000+ Teams) | AI Hiring Show by Rabbitt Learning 🏆**

**BachatBot** is a sophisticated, AI-driven financial assistant designed to demystify personal finance for the Indian market. By integrating advanced AI, a secure microservices architecture, and an intuitive user interface, BachatBot provides personalized banking, insurance, and tax advisory services, empowering users to make brilliant financial decisions with ease and confidence.

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
-   **🤖 AI Document Intelligence**: Securely upload financial documents. Our AI pipeline intelligently analyzes the document's content, extracts key data points, and structures them for further use, eliminating manual entry.
-   **💬 Intelligent Tax Chatbot (RAG-Powered)**: Ask complex questions about Indian tax law in plain English. Our chatbot uses a Retrieval-Augmented Generation (RAG) pipeline to provide accurate, context-aware answers from a specialized knowledge base.
-   **💸 Dual-Regime Tax Calculator & Advisor**: Input your financial data to see a real-time, side-by-side comparison of your tax liability under the Old and New Indian tax regimes.
-   **📈 Personalized AI Reports**: Generate comprehensive financial reports with actionable investment and tax-saving strategies, powered by Google Gemini.
-   **🔒 Secure User Authentication & Profile Management**: A complete auth system with JWT, email verification, and a detailed user profile manager.

## 📊 The Impact: Tangible Financial Benefits

Our solution translates directly into measurable savings for the user.
> In a country where the average income of a middle-class family in a metropolitan area is ₹35,000, BachatBot can help users save approximately **₹15,000 upfront** and **₹8,000 per year** by providing AI-driven financial insights at a fraction of the cost of a traditional advisor. This represents a potential saving of **22.8% of income**.

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

#### 3. AI/ML Microservices (Python, Flask)
-   **Document Intelligence Service**: This microservice is responsible for processing uploaded financial documents. It leverages a powerful Large Language Model (LLM) like **Google Gemini** to understand the context and content of the document, extracting key financial data (like income, expenses, investments) and converting it into a structured JSON format.
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
| **AI Microservices**  | **Python 3**, **Flask**                                                                                                |
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
Create a `.env` file in the root directory and populate it with your credentials.

```bash
# .env (example)

# MongoDB Connection String
MONGODB_URI="mongodb+srv://user:password@cluster.mongodb.net/authDB?retryWrites=true&w=majority"

# JWT Secret for Authentication
JWT_SECRET="this-is-a-very-strong-and-long-secret-key-for-jwt-signing"

# External API Keys for AI Services
GEMINI_API_KEY="your_google_gemini_api_key"
OPENAI_API_KEY="your_openai_api_key"

# Email Service for Verification
RESEND_API_KEY="your_resend_api_key"
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
    For each Python service (`PlakshaChatbot`, `PlakshaRec`), create a virtual environment and install its dependencies.

    ```bash
    # Example for the Chatbot service
    cd PlakshaChatbot
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    pip install -r requirements.txt
    cd ..
    ```
    *(Repeat for all relevant Python service directories.)*

4.  **Start the Backend Services:**
    Open separate terminals for each service, activate their environments, and run them. They are configured to run on different ports.
    ```bash
    # Terminal 1: Chatbot Service (Port 5000)
    cd PlakshaChatbot && source venv/bin/activate && python app.py

    # Terminal 2: Recommendation Service (Port 7000)
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

## 👥 The Team
*   **Akshat Saraswat**
*   **Belo Abhigyaan**
*   **Divyanshu Kasherwal**
*   **Shreshtha Kumar Gupta**
