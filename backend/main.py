from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allows React to connect
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

class PromptRequest(BaseModel):
    prompt: str


@app.get("/")
def root():
    return {"message": "Hello Hackathon"}


@app.post("/ask")
def ask(request: PromptRequest):
    return {
        "answer": f"Mock AI response: {request.prompt}"
    }