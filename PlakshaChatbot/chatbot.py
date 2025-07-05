import os
import time
from dotenv import load_dotenv

from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain_openai import ChatOpenAI

# === 1. Load environment variables from .env file ===
load_dotenv()
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise EnvironmentError(
        "❌ OPENAI_API_KEY not found in environment. Please set it in your .env file."
    )

# === 2. Initialize LLM (OpenAI GPT-4o) ===
llm = ChatOpenAI(
    openai_api_key=OPENAI_API_KEY,
    model="gpt-4o",
    temperature=0.7
)

# === 3. Load and process PDF documents ===
pdf_folder = r"C:\Users\aksha\EZTax-INDIA\PlakshaChatbot\tax_pdfs"
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

# === 4. Split and index documents ===
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
chunks = text_splitter.split_documents(docs)
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vectorstore = FAISS.from_documents(chunks, embeddings)
vectorstore.save_local("faiss_index")

# === 5. Conversation memory ===
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True, max_token_limit=500)

# === 6. Utility functions ===

def is_finance_tax_related(query):
    """Check if the query is finance or tax related."""
    keywords = [
        "tax", "gst", "income", "itr", "capital gain", "deduction",
        "filing", "assessment", "refund", "audit", "financial year",
        "finance", "exemption", "tds", "income tax", "taxable", "section", "investment"
    ]
    query_lower = query.lower()
    return any(kw in query_lower for kw in keywords)

def call_llm_with_retry(query, max_retries=3):
    """Retry LLM call on failure (e.g., rate limit)."""
    for attempt in range(max_retries):
        try:
            return llm.predict(query)
        except Exception as e:
            if "429" in str(e):
                wait_time = 2 ** attempt
                print(f"⏳ Rate limit reached. Retrying in {wait_time} seconds...")
                time.sleep(wait_time)
            else:
                print(f"❌ API Error: {e}")
                return "Sorry, I encountered an error processing your request."
    return "I am currently experiencing issues. Please try again later."

def get_answer(query):
    """Main logic to get answer from retriever or fallback to LLM."""
    retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 5})
    try:
        retrieved_docs = retriever.invoke(query)
    except Exception as e:
        print(f"❌ Retrieval error: {e}")
        retrieved_docs = []

    if retrieved_docs and any(doc.page_content.strip() for doc in retrieved_docs):
        print("🔍 FAISS retrieval successful!")
        qa_chain = ConversationalRetrievalChain.from_llm(llm, retriever=retriever, memory=memory)
        try:
            response = qa_chain.invoke({"question": query, "chat_history": memory.chat_memory})
            faiss_answer = response.get("answer", "").strip()
            if "not mention" in faiss_answer.lower() or "does not contain" in faiss_answer.lower():
                if is_finance_tax_related(query):
                    print("⚠️ FAISS incomplete. Fallback to LLM (Finance related).")
                    llm_answer = call_llm_with_retry(query)
                    return f"{faiss_answer}\n\n🔹 Additional info from LLM:\n{llm_answer}"
                else:
                    return "⚠️ I can only answer finance or tax-related queries. Please try again with a relevant question."
            return faiss_answer
        except Exception as e:
            print(f"⚠️ FAISS chain error: {e}")
            if is_finance_tax_related(query):
                return call_llm_with_retry(query)
            else:
                return "⚠️ I can only answer finance or tax-related queries."
    else:
        print("⚠️ No relevant results in FAISS.")
        if is_finance_tax_related(query):
            return call_llm_with_retry(query)
        else:
            return "⚠️ I can only answer finance or tax-related queries. Please ask something related to tax or finance."

# === 7. Chat interface ===

def chat_with_bot():
    """Simple chat interface."""
    print("\n🤖 Tax Chatbot Ready! Type 'exit' to stop.\n")
    while True:
        query = input("You: ")
        if query.lower() == "exit":
            print("👋 Exiting chatbot. Have a great day!")
            break
        response = get_answer(query)
        print("Bot:", response)
        time.sleep(1.5)

if __name__ == "__main__":
    chat_with_bot()
