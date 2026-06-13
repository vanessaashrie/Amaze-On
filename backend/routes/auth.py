from fastapi import APIRouter, HTTPException
from fastapi import Body
from models.user import OnboardingRequest
from services.dynamodb import create_or_update_user, get_user

router = APIRouter()


# POST /auth/onboarding — save full profile after Clerk sign-in
@router.post("/onboarding")
def onboarding(data: OnboardingRequest):
    user = create_or_update_user(data.model_dump())
    return {"message": "User saved", "user": user}


# GET /auth/profile/{clerk_id} — fetch profile by Clerk ID
@router.get("/profile/{clerk_id}")
def profile(clerk_id: str):
    user = get_user(clerk_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user