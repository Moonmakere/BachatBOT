import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.runnables import Runnable
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain_core.language_models.llms import LLM
from langchain_core.outputs import LLMResult
from typing import List, Optional
from langchain_core.language_models.llms import LLM
from langchain_core.outputs import Generation, LLMResult
from typing import List, Optional
from pydantic import BaseModel, Field


# 🧠 Custom function that takes a prompt and returns a response
def dummy_model(prompt):
    return f"🤖 Simulated response for: {prompt}"

# ✅ Define a valid Runnable-compatible LLM class
class CustomFunctionLLM(LLM):
    model: callable = Field(..., exclude=True)  # Avoid Pydantic warning

    def _call(self, prompt: str, stop: Optional[List[str]] = None) -> str:
        return self.model(prompt)

    @property
    def _llm_type(self) -> str:
        return "custom-function-llm"

    def _generate(self, prompts: List[str], stop: Optional[List[str]] = None) -> LLMResult:
        generations = []
        for prompt in prompts:
            result = self._call(prompt, stop=stop)
            generations.append([Generation(text=result)])
        return LLMResult(generations=generations)

# 📂 Load and process documents
def load_documents(folder_path):
    documents = []
    for filename in os.listdir(folder_path):
        if filename.endswith(".pdf"):
            loader = PyPDFLoader(os.path.join(folder_path, filename))
            documents.extend(loader.load())
    return documents

# 🔍 Build vector store
def build_vector_store(documents):
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vectorstore = FAISS.from_documents(documents, embeddings)
    return vectorstore

# 💬 Chat function
def chat_with_bot():
    print("✅ Loading documents...")
    documents = load_documents("tax_pdfs")
    print(f"📄 Loaded {len(documents)} documents.")

    print("🔍 Creating vector store...")
    vectorstore = build_vector_store(documents)

    memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

    llm = CustomFunctionLLM(model=dummy_model)

    qa_chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vectorstore.as_retriever(),
        memory=memory
    )

    print("\n🤖 Tax Chatbot Ready! Type 'exit' to quit.\n")

    while True:
        query = input("You: ")
        if query.lower() in ["exit", "quit"]:
            break
        response = qa_chain.invoke({"question": query})
        print(f"Bot: {response['answer']}\n")

if __name__ == "__main__":
    chat_with_bot()