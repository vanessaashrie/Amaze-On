from fastapi import APIRouter
from models.health import HealthLogRequest
from services.dynamodb import save_health_log, get_health_logs, get_health_log_today

router = APIRouter()

@router.post("/")
def log_health(data: HealthLogRequest):
    item = data.model_dump()
    item["userId"] = item.pop("clerk_id")
    log = save_health_log(item)
    return {"message": "Health log saved", "log": log}

@router.get("/{user_id}")
def list_health_logs(user_id: str):
    logs = get_health_logs(user_id)
    return {"logs": logs}

@router.get("/{user_id}/today")
def health_today(user_id: str):
    log = get_health_log_today(user_id)
    if not log:
        return {"log": None}
    return {"log": log}