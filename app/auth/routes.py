from fastapi import APIRouter, HTTPException, Depends
from app.auth.models import UserCreate, UserUpdate, UserLogin
from app.database import users_collection
from app.utils import hash_password
from app.auth.auth import authenticate_user
from bson import ObjectId
from app.auth.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["1. Auth"])

@router.post("/register")
async def register_user(user: UserCreate):
    if await users_collection.find_one({"$or": [{"username": user.username}, {"email": user.email}]}):
        raise HTTPException(status_code=400, detail="User already exists")

    user_dict = user.dict()
    user_dict["password"] = hash_password(user.password)
    result = await users_collection.insert_one(user_dict)
    return {"id": str(result.inserted_id), "message": "User registered successfully"}

@router.put("/update/{user_id}")
async def update_user(user_id: str, user: UserUpdate, userData: dict = Depends(get_current_user)):
    updates = {k: v for k, v in user.dict().items() if v is not None}
    if "password" in updates:
        updates["password"] = hash_password(updates["password"])
    result = await users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": updates})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found or data unchanged")
    return {"message": "User updated successfully"}

@router.post("/login")
async def login_user(login_data: UserLogin):
    return await authenticate_user(login_data.username_or_email, login_data.password)
