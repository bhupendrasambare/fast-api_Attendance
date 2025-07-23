from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
import os
from .database import users_collection
from .utils import verify_password, create_access_token
from dotenv import load_dotenv
from bson.objectid import ObjectId

load_dotenv()

oauth2_schema = OAuth2PasswordBearer(tokenUrl="/api/v1/login")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("JWT_ALGORITHM")

async def authenticate_user(username_or_email:str, password:str):
    user = await users_collection.find_one({
        "$or":[{"username":username_or_email}, {"email":username_or_email}]
    })

    if not user or not verify_password(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentails")
    
    token = create_access_token({"sub": str(user["_id"])})
    return {"access_token":token, "token_type":"Bearer"}

async def get_current_user(token:str = Depends(oauth2_schema)):
    credentails_expections = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Cout not validate credentails",
        headers={"WW-Authenticate": "Bearer"}
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentails_expections
        user = await users_collection.find_one({"_id":ObjectId(user_id)})
        if not user:
            raise credentails_expections
        return user_id
    except JWTError:
        raise credentails_expections
