from pydantic import BaseModel, EmailStr

class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    ai_name: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str