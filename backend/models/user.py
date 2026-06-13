from pydantic import BaseModel, EmailStr
from typing import Optional

class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    ai_name: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# Used after Clerk authentication — saves full profile to DynamoDB
class OnboardingRequest(BaseModel):
    clerk_id: str
    email: EmailStr
    name: str
    age: Optional[int] = ""
    phone: Optional[str] = ""
    gender: Optional[str] = ""
    status: Optional[str] = ""          # Student / Working Professional
    friend_name: Optional[str] = ""     # AI companion name
    emergency_contact: Optional[str] = ""
    relationship: Optional[str] = ""
    emergency_phone: Optional[str] = ""