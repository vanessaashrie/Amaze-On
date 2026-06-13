from fastapi import APIRouter

from models.user import SignupRequest, LoginRequest
from services.dynamodb import users_table
from utils.security import hash_password, verify_password
from utils.auth import create_access_token

from uuid import uuid4

router = APIRouter()

# -------------------
# SIGNUP
# -------------------
@router.post("/signup")
def signup(user: SignupRequest):

    user_id = str(uuid4())

    users_table.put_item(
        Item={
            "user_id": user_id,
            "name": user.name,
            "email": user.email,
            "password_hash": hash_password(user.password),
            "ai_name": user.ai_name
        }
    )

    return {
        "message": "User created successfully",
        "user_id": user_id
    }


# -------------------
# LOGIN
# -------------------
@router.post("/login")
def login(data: LoginRequest):

    response = users_table.scan()

    users = response.get("Items", [])

    user = next(
        (
            u for u in users
            if u["email"] == data.email
        ),
        None
    )

    if not user:
        return {"error": "Invalid credentials"}

    if not verify_password(
        data.password,
        user["password_hash"]
    ):
        return {"error": "Invalid credentials"}

    token = create_access_token(
        {
            "user_id": user["user_id"]
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }