import boto3
import os
import uuid
from datetime import datetime, timezone
from boto3.dynamodb.conditions import Key
from dotenv import load_dotenv

load_dotenv()

dynamodb = boto3.resource(
    "dynamodb",
    region_name=os.getenv("AWS_REGION", "eu-north-1"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
)

users_table   = dynamodb.Table("AmazeOnUsers")
journal_table = dynamodb.Table("JournalEntries")
money_table   = dynamodb.Table("Money")
health_table  = dynamodb.Table("Health")
goals_table   = dynamodb.Table("Goals")


def create_or_update_user(data: dict):
    users_table.put_item(Item=data)
    return data

def get_user(user_id: str):
    response = users_table.get_item(Key={"userId": user_id})
    return response.get("Item")


def create_journal_entry(data: dict) -> dict:
    item = {
        "userId":    data["userId"],
        "entry_id":  str(uuid.uuid4()),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "mood":      data.get("mood", "Okay"),
        "text":      data["text"],
        "tags":      data.get("tags", []),
    }
    journal_table.put_item(Item=item)
    return item

def get_journal_entries(user_id: str) -> list:
    response = journal_table.query(
        KeyConditionExpression=Key("userId").eq(user_id)
    )
    items = response.get("Items", [])
    return sorted(items, key=lambda x: x.get("timestamp", ""), reverse=True)


def create_transaction(data: dict) -> dict:
    item = {
        "userId":         data["userId"],
        "transaction_id": str(uuid.uuid4()),
        "date":           data.get("date") or datetime.now(timezone.utc).isoformat(),
        "name":           data["name"],
        "amount":         data["amount"],
        "category":       data["category"],
        "type":           data["type"],
    }
    money_table.put_item(Item=item)
    return item

def get_transactions(user_id: str) -> list:
    response = money_table.query(
        KeyConditionExpression=Key("userId").eq(user_id)
    )
    items = response.get("Items", [])
    return sorted(items, key=lambda x: x.get("date", ""), reverse=True)

def add_transaction(user_id: str, amount: float, category: str, description: str, transaction_type: str = "expense"):
    item = {
        "userId":         user_id,
        "transaction_id": str(uuid.uuid4()),
        "date":           datetime.now(timezone.utc).isoformat(),
        "name":           description,
        "amount":         str(amount),
        "category":       category,
        "type":           transaction_type,
    }
    money_table.put_item(Item=item)


def save_health_log(data: dict) -> dict:
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    item = {
        "userId":        data["userId"],
        "date":          data.get("date") or today,
        "sleep_hours":   data.get("sleep_hours", ""),
        "steps":         data.get("steps", ""),
        "water_glasses": data.get("water_glasses", ""),
        "heart_rate":    data.get("heart_rate", ""),
        "bmi":           data.get("bmi", ""),
        "habits":        data.get("habits", {}),
        "updated_at":    datetime.now(timezone.utc).isoformat(),
    }
    health_table.put_item(Item=item)
    return item

def get_health_logs(user_id: str, limit: int = 7) -> list:
    response = health_table.query(
        KeyConditionExpression=Key("userId").eq(user_id),
        ScanIndexForward=False,
        Limit=limit
    )
    return response.get("Items", [])

def get_health_log_today(user_id: str) -> dict:
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    response = health_table.get_item(
        Key={"userId": user_id, "date": today}
    )
    return response.get("Item")

def add_health_log(user_id: str, steps: int = None, calories: int = None, sleep_hours: float = None, note: str = ""):
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    existing = get_health_log_today(user_id) or {}
    item = {
        "userId":        user_id,
        "date":          today,
        "steps":         str(steps) if steps is not None else existing.get("steps", ""),
        "sleep_hours":   str(sleep_hours) if sleep_hours is not None else existing.get("sleep_hours", ""),
        "water_glasses": existing.get("water_glasses", ""),
        "heart_rate":    existing.get("heart_rate", ""),
        "bmi":           existing.get("bmi", ""),
        "habits":        existing.get("habits", {}),
        "updated_at":    datetime.now(timezone.utc).isoformat(),
    }
    health_table.put_item(Item=item)


def create_goal(data: dict) -> dict:
    item = {
        "userId":       data["userId"],
        "goal_id":      str(uuid.uuid4()),
        "title":        data["title"],
        "category":     data["category"],
        "icon":         data.get("icon", "🎯"),
        "target":       data.get("target", "100"),
        "current":      data.get("current", "0"),
        "due_date":     data.get("due_date", ""),
        "is_completed": False,
        "created_at":   datetime.now(timezone.utc).isoformat(),
    }
    goals_table.put_item(Item=item)
    return item

def get_goals(user_id: str) -> list:
    response = goals_table.query(
        KeyConditionExpression=Key("userId").eq(user_id)
    )
    return response.get("Items", [])

def update_goal_progress(user_id: str, goal_id: str, current: str, is_completed: bool = False) -> dict:
    response = goals_table.update_item(
        Key={"userId": user_id, "goal_id": goal_id},
        UpdateExpression="SET #cur = :c, is_completed = :done",
        ExpressionAttributeNames={"#cur": "current"},
        ExpressionAttributeValues={":c": current, ":done": is_completed},
        ReturnValues="ALL_NEW"
    )
    return response.get("Attributes", {})