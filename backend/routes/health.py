from fastapi import APIRouter
from models.health import HealthLogRequest
from services.dynamodb import save_health_log, get_health_logs
from datetime import datetime, timezone

router = APIRouter()


@router.post("/")
def log_health(data: HealthLogRequest):
    item = data.model_dump()
    item["userId"] = item.pop("clerk_id")
    log = save_health_log(item)
    return {"message": "Health log saved", "log": log}


@router.get("/{user_id}/today")
def get_today_log(user_id: str):
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    logs = get_health_logs(user_id)
    today_log = next((l for l in logs if l.get("date", "").startswith(today)), None)
    return {"log": today_log}


@router.get("/{user_id}")
def list_health_logs(user_id: str):
    logs = get_health_logs(user_id)
    return {"logs": logs}