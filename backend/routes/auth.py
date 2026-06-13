from fastapi import APIRouter
from pydantic import BaseModel
from services.dynamodb import create_or_update_user, get_user

router = APIRouter()

class OnboardingRequest(BaseModel):
    clerk_id: str
    email: str
    name: str
    age: str
    phone: str | None = None
    gender: str | None = None
    status: str | None = None
    friend_name: str
    emergency_contact: str
    relationship: str
    emergency_phone: str


@router.post("/onboarding")
def onboard_user(data: OnboardingRequest):
    item = data.dict()
    item["userId"] = item.pop("clerk_id")  # match DynamoDB partition key
    create_or_update_user(item)
    return {"message": "onboarding saved", "userId": item["userId"]}


@router.get("/profile/{clerk_id}")
def get_profile(clerk_id: str):
    profile = get_user(clerk_id)
    if not profile:
        return {}
    return profile