from fastapi import APIRouter
from pydantic import BaseModel
import boto3
import json
import os
import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

from services.dynamodb import (
    get_journal_entries,
    get_transactions,
    get_health_logs,
    get_goals,
    add_transaction,
    add_health_log,
    update_goal_progress,
)

router = APIRouter()

BEDROCK_MODEL_ID  = "amazon.nova-lite-v1:0"
FALLBACK_MODEL_ID = "amazon.nova-micro-v1:0"

bedrock = boto3.client(
    "bedrock-runtime",
    region_name="eu-north-1",
)


class ChatRequest(BaseModel):
    user_id: str
    message: str
    history: list = []
    friend_name: str = "Nova"


def detect_and_log(user_id: str, message: str) -> str:
    """
    Uses Nova to detect if the user's message contains loggable data.
    Returns a string describing what was logged, or empty string if nothing.
    """
    detection_prompt = f"""
Analyze this message and extract any loggable health or money data.
Message: "{message}"

Reply ONLY with a valid JSON object in this exact format (no explanation, no markdown):
{{
  "expense": {{
    "found": true or false,
    "amount": number or null,
    "category": string or null,
    "description": string or null
  }},
  "health": {{
    "found": true or false,
    "steps": number or null,
    "calories": number or null,
    "sleep_hours": number or null,
    "note": string or null
  }},
  "goal": {{
    "found": true or false,
    "progress": number or null,
    "note": string or null
  }}
}}

Examples:
- "I spent 500 rupees on groceries" → expense found, amount 500, category groceries
- "I walked 8000 steps today" → health found, steps 8000
- "Slept 7 hours last night" → health found, sleep_hours 7
- "I burned 400 calories at the gym" → health found, calories 400
- "I completed 50% of my savings goal" → goal found, progress 50
- "How are you?" → nothing found
"""

    response = bedrock.converse(
        modelId=BEDROCK_MODEL_ID,
        messages=[{"role": "user", "content": [{"text": detection_prompt}]}],
    )

    raw = response["output"]["message"]["content"][0]["text"]

    try:
        clean = raw.strip().replace("```json", "").replace("```", "").strip()
        print("DETECTION RAW:", raw)        # ← add this
        print("DETECTION CLEAN:", clean)    # ← add this
        parsed = json.loads(clean)
    except Exception as e:
        print("Detection parse error:", e, "Raw:", raw)
        return ""

    logged = []

    if parsed.get("expense", {}).get("found"):
        exp = parsed["expense"]
        amount = exp.get("amount")
        category = exp.get("category") or "general"
        description = exp.get("description") or message
        if amount:
            add_transaction(user_id, float(amount), category, description)
            logged.append(f"💸 Logged expense: {amount} on {category}")

    if parsed.get("health", {}).get("found"):
        h = parsed["health"]
        add_health_log(
            user_id,
            steps=h.get("steps"),
            calories=h.get("calories"),
            sleep_hours=h.get("sleep_hours"),
            note=h.get("note") or message,
        )
        parts = []
        if h.get("steps"): parts.append(f"{h['steps']} steps")
        if h.get("calories"): parts.append(f"{h['calories']} calories")
        if h.get("sleep_hours"): parts.append(f"{h['sleep_hours']}h sleep")
        logged.append(f"🏃 Logged health: {', '.join(parts)}")

    if parsed.get("goal", {}).get("found"):
        g = parsed["goal"]
        goals = get_goals(user_id)
        if goals and g.get("progress") is not None:
            goal_id = goals[0].get("goalId") or goals[0].get("goal_id")
            if goal_id:
                update_goal_progress(user_id, goal_id, int(g["progress"]))
                logged.append(f"🎯 Updated goal progress to {g['progress']}%")

    return "\n".join(logged)


@router.post("/chat")
def chat(req: ChatRequest):
    try:
        # Fetch fresh user data
        journals     = get_journal_entries(req.user_id)[:5]
        transactions = get_transactions(req.user_id)[:10]
        health       = get_health_logs(req.user_id)[:10]
        goals        = get_goals(req.user_id)[:10]

        print("USER ID:", req.user_id)
        print("JOURNALS:", len(journals))
        print("TRANSACTIONS:", len(transactions))
        print("HEALTH:", len(health))
        print("GOALS:", len(goals))

        # Detect and log any health/money data in the message
        logged_summary = detect_and_log(req.user_id, req.message)
        if logged_summary:
            print("AUTO-LOGGED:", logged_summary)

        context = f"""
RECENT JOURNALS:
{json.dumps(journals, default=str)}

RECENT TRANSACTIONS:
{json.dumps(transactions, default=str)}

HEALTH LOGS:
{json.dumps(health, default=str)}

GOALS:
{json.dumps(goals, default=str)}
"""

        # Build conversation history — skip leading assistant messages (Bedrock requires user first)
        messages = [
            {"role": t.get("role"), "content": [{"text": t.get("content", "")}]}
            for t in req.history
            if t.get("role") in ("user", "assistant") and t.get("content", "")
        ]
        if messages and messages[0]["role"] == "assistant":
            messages = messages[1:]

        messages.append({
            "role": "user",
            "content": [{"text": req.message}]
        })

        # Add logged confirmation to system prompt if something was saved
        log_note = f"\n\nYou just automatically logged this from the user's message:\n{logged_summary}" if logged_summary else ""

        try:
            response = bedrock.converse(
                modelId=BEDROCK_MODEL_ID,
                system=[{
                    "text": (
                        f"You are {req.friend_name}, a warm and supportive AI companion. "
                        "You have access to the user's personal data below. "
                        "Reference it naturally when relevant. "
                        "When the user mentions spending money or health activity, confirm what was logged. "
                        "Be concise, empathetic, and helpful.\n\n"
                        "User data:\n" + context + log_note
                    )
                }],
                messages=messages,
            )
            reply = response["output"]["message"]["content"][0]["text"]
        except Exception as bedrock_error:
            print("Nova Lite failed, trying Nova Micro:", bedrock_error)
            try:
                response = bedrock.converse(
                    modelId=FALLBACK_MODEL_ID,
                    system=[{
                        "text": "You are Nova, a warm and supportive AI companion. Be concise, empathetic, and helpful."
                    }],
                    messages=messages,
                )
                reply = response["output"]["message"]["content"][0]["text"]
            except Exception as nova_micro_error:
                print("Nova Micro failed, trying Gemini:", nova_micro_error)
                try:
                    gemini_model = genai.GenerativeModel("gemini-1.5-flash")
                    gemini_response = gemini_model.generate_content(
                        f"You are {req.friend_name}, a warm and supportive AI companion. Be concise and helpful.\n\nUser: {req.message}"
                    )
                    reply = gemini_response.text
                except Exception as gemini_error:
                    print("Gemini also failed:", gemini_error)
                    reply = "I'm taking a short break! Try again in a moment 💜"

        return {"reply": reply}

    except Exception as e:
        print("COMPANION ERROR:", e)
        return {"reply": f"Backend Error: {str(e)}"}