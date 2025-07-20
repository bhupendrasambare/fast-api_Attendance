from fastapi import HTTPException
from .database import users_collection
from .utils import verify_password, create_access_token
from bson.objectid import ObjectId

async def authenticate_user(username_or_email:str, password:str):
    user = await users_collection.find_one({
        "$or":[{"username":username_or_email}, {"email":username_or_email}]
    })

    if not user or not verify_password(password, user[password]):
        raise HTTPException(status_code=401, detail="Invalid credentails")
    
    token = create_access_token({"sub":str(["_id"])})
    return {"access_token":token, "token_type":"Bearer"}

