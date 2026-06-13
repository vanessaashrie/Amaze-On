from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routes.auth import router as auth_router
from routes.journal import router as journal_router
from routes.money import router as money_router
from routes.health import router as health_router
from routes.goals import router as goals_router

load_dotenv()

app = FastAPI(title="Pocket Buddy API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Pocket Buddy backend running 🚀"}

# ✅ PREFIX ONLY HERE
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(journal_router, prefix="/journal", tags=["Journal"])
app.include_router(money_router, prefix="/money", tags=["Money"])
app.include_router(health_router, prefix="/health", tags=["Health"])
app.include_router(goals_router, prefix="/goals", tags=["Goals"])