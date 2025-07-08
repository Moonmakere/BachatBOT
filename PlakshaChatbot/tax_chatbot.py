import os
import google.generativeai as genai
from langchain_google_genai import ChatGoogleGenerativeAI
import faiss
from langchain.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain.document_loaders import TextLoader
from langchain.docstore.document import Document

memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

from dotenv import load_dotenv  # Import dotenv to load environment variables

# Load environment variables from .env file
load_dotenv()

# Retrieve Google Gemini API key
"""GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found. Set it in your environment variables.")

print("✅ API key loaded successfully:", GEMINI_API_KEY[:5] + "*****")  # Masked for security

# Configure Google Gemini AI
genai.configure(api_key=GEMINI_API_KEY)"""

import os
from langchain_google_genai import ChatGoogleGenerativeAI

# ✅ Set API key explicitly
os.environ["GOOGLE_API_KEY"] = "AIzaSyDZvNMkZI-Gbus6rYViWeFkTd0x616hlLw"  # Replace with your actual API key

# ✅ Initialize Gemini API with authentication
llm = ChatGoogleGenerativeAI(model="gemini-pro-vision", temperature=0.7)


# ✅ Load PDF document (Ensure it's a file, not a folder)
import os
from langchain_community.document_loaders import PyPDFLoader

pdf_folder = "C://Users//AkshatSaraswat//Desktop//PUHS//tax_pdfs"  # Corrected to folder path

# Ensure the folder exists
if not os.path.exists(pdf_folder):
    raise FileNotFoundError(f"❌ Folder not found: {pdf_folder}")

# Load all PDF files from the folder
import os
from langchain_community.document_loaders import PyPDFLoader

pdf_folder_path = r"C:\\Users\\AkshatSaraswat\\Desktop\\PUHS\\tax_pdfs"
pdf_files = [os.path.join(pdf_folder_path, f) for f in os.listdir(pdf_folder_path) if f.endswith('.pdf')]

docs = []
for pdf_file in pdf_files:
    loader = PyPDFLoader(pdf_file)
    docs.extend(loader.load())

print(f"✅ Loaded {len(docs)} documents from {pdf_folder_path}")

# ✅ Load or define documents before splitting
docs = [
    Document(page_content="Tax is a compulsory contribution to state revenue."),
    Document(page_content="GST stands for Goods and Services Tax."),
    Document(page_content="Income tax is calculated based on annual earnings."),
]
# ✅ Split text into chunks
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
chunks = text_splitter.split_documents(docs)

# ✅ Create FAISS vector database
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vectorstore = FAISS.from_documents(chunks, embeddings)

# ✅ Save FAISS index for future use
vectorstore.save_local("faiss_index")

# ✅ Initialize conversation memory
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

# ✅ Initialize Gemini LLM
llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro-latest", temperature=0.7)

# ✅ Function to get answers from FAISS or fallback to Gemini
def get_answer(query):
    retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 2})  
    docs = retriever.invoke(query)


    if docs:  # ✅ If FAISS has relevant answers, use them
        qa_chain = ConversationalRetrievalChain.from_llm(llm, retriever=retriever, memory=memory)
        response = qa_chain.invoke({"question": query, "chat_history": memory.chat_memory})

        return response
    else:  # ✅ If no answer is found, fallback to Gemini
        return llm.predict(query)

# ✅ Function to chat with the bot
def chat_with_bot():
    print("\n🤖 **Tax Chatbot Ready!** Type 'exit' to stop.\n")
    while True:
        query = input("You: ")
        if query.lower() == "exit":
            print("👋 Exiting chatbot. Have a great day!")
            break

        response = get_answer(query)
        print("Bot:", response)

# ✅ Run chatbot
if __name__ == "__main__":
    chat_with_bot()
