import os
import time
import google.generativeai as genai
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from dotenv import load_dotenv

# ✅ Load environment variables from the specified .env file
load_dotenv(r"C:\\Users\\aksha\\OneDrive\\Desktop\\EZTax-Plaksha-main\\PlakshaChatbot\\.env")

# ✅ Retrieve second Google Gemini API key from environment
api_key = os.getenv("GEMINI_API_KEY_2")
if not api_key:
    raise ValueError("❌ ERROR: GEMINI_API_KEY_2 is not set in the .env file!")

os.environ["GOOGLE_API_KEY"] = api_key

# ✅ Initialize Gemini LLM
llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro-latest", temperature=0.7)

# ✅ Load PDFs from folder
pdf_folder = r"C:\\Users\\aksha\\OneDrive\\Desktop\\EZTax-Plaksha-main\\PlakshaChatbot\\tax_pdfs"

if not os.path.exists(pdf_folder):
    raise FileNotFoundError(f"❌ Folder not found: {pdf_folder}")

pdf_files = [os.path.join(pdf_folder, f) for f in os.listdir(pdf_folder) if f.endswith('.pdf')]

if not pdf_files:
    raise FileNotFoundError(f"❌ No PDF files found in {pdf_folder}")

docs = []
for pdf_file in pdf_files:
    loader = PyPDFLoader(pdf_file)
    docs.extend(loader.load())

print(f"✅ Loaded {len(docs)} documents from {pdf_folder}")

# ✅ Split text into chunks for efficient retrieval
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
chunks = text_splitter.split_documents(docs)

# ✅ Create FAISS vector store
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vectorstore = FAISS.from_documents(chunks, embeddings)

# ✅ Save FAISS index
vectorstore.save_local("faiss_index")

# ✅ Initialize conversation memory
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True, max_token_limit=500)

# ✅ Function to handle Gemini API rate limits
def call_gemini_with_retry(query, max_retries=3):
    """Retries Gemini API calls with exponential backoff in case of a 429 error."""
    for attempt in range(max_retries):
        try:
            return llm.predict(query)
        except Exception as e:
            if "429" in str(e):
                wait_time = 2 ** attempt  # Exponential backoff (2s, 4s, 8s)
                print(f"⏳ Rate limit reached. Retrying in {wait_time} seconds...")
                time.sleep(wait_time)
            else:
                print(f"❌ API Error: {e}")
                return "Sorry, I encountered an error processing your request."
    
    print("⚠ Too many API failures. Please try again later.")
    return "I am currently experiencing issues. Please try again later."

# ✅ Function to get answers from FAISS or fallback to Gemini
def get_answer(query):
    retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 5})
    retrieved_docs = retriever.invoke(query)

    if retrieved_docs and any(doc.page_content.strip() for doc in retrieved_docs):
        print("🔍 FAISS retrieval successful!")

        qa_chain = ConversationalRetrievalChain.from_llm(
            llm, retriever=retriever, memory=memory
        )
        try:
            response = qa_chain.invoke({"question": query, "chat_history": memory.chat_memory})
            faiss_answer = response.get("answer", "").strip()

            if "not mention" in faiss_answer.lower() or "does not contain" in faiss_answer.lower():
                print("⚠ FAISS response is incomplete. Using hybrid answer with Gemini...")
                gemini_answer = call_gemini_with_retry(query)
                return f"{faiss_answer}\n\n🔹 Additional info from Gemini:\n{gemini_answer}"

            return faiss_answer

        except Exception as e:
            print(f"⚠ FAISS chain error: {e}. Falling back to Gemini...")
            return call_gemini_with_retry(query)

    else:
        print("⚠ No relevant results found in FAISS. Falling back to Gemini...")
        return call_gemini_with_retry(query)

# ✅ Function to chat with the bot
def chat_with_bot():
    print("\n🤖 *Tax Chatbot Ready!* Type 'exit' to stop.\n")
    while True:
        query = input("You: ")
        if query.lower() == "exit":
            print("👋 Exiting chatbot. Have a great day!")
            break

        response = get_answer(query)
        print("Bot:", response)
        time.sleep(1.5)

# ✅ Run chatbot
if _name_ == "_main_":
    chat_with_bot()