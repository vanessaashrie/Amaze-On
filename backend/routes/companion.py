from fastapi import APIRouter
from pydantic import BaseModel
import boto3
import json
import os

from services.dynamodb import (
    get_journal_entries,
    get_transactions,
    get_health_logs,
    get_goals,
)

router = APIRouter()

BEDROCK_MODEL_ID ="amazon.nova-lite-v1:0"

bedrock = boto3.client(
    "bedrock-runtime",
    region_name="eu-north-1",
)


class ChatRequest(BaseModel):
    userId: str
    message: str
    history: list = []


@router.post("/chat")
def chat(req: ChatRequest):
    try:
        journals = get_journal_entries(req.userId)[:5]
        transactions = get_transactions(req.userId)[:10]
        health = get_health_logs(req.userId)
        goals = get_goals(req.userId)

        context = f"""
JOURNALS:
{json.dumps(journals, default=str)}

TRANSACTIONS:
{json.dumps(transactions, default=str)}

HEALTH:
{json.dumps(health, default=str)}

GOALS:
{json.dumps(goals, default=str)}
"""

        messages = [
    {
        "role": "user",
        "content": [
            {
                "text": f"""
You are Nova, a supportive AI companion.

Use this user data when relevant:

{context}

User says:
{req.message}
"""
            }
        ]
    }
]

        response = bedrock.converse(
            modelId=BEDROCK_MODEL_ID,
            messages=messages,
        )

        reply = response["output"]["message"]["content"][0]["text"]

        return {"reply": reply}

    except Exception as e:
        print("COMPANION ERROR:", e)
        return {"reply": f"Backend Error: {str(e)}"}