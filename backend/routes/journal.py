from fastapi import APIRouter
from models.journal import JournalEntryRequest
from services.dynamodb import create_journal_entry, get_journal_entries

router = APIRouter()

@router.post("/")
def save_journal(data: JournalEntryRequest):
    item = data.model_dump()
    item["userId"] = item.pop("clerk_id")
    entry = create_journal_entry(item)
    return {"message": "Journal entry saved", "entry": entry}

@router.get("/{user_id}")
def list_journal(user_id: str):
    entries = get_journal_entries(user_id)
    return {"entries": entries}