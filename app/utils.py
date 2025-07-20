from passlib.context import CryptContext
from jose import jwt
import os
from datetime import datetime, timedelta


pwd_contexxt = CryptContext(schema=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("JWT_ALGORITHM")

def hash_password(password:str) -> str:
    return pwd_contexxt.hash(password)

def verify_password(plain:str, hashed:str) ->bool:
    return pwd_contexxt.verify(plain, hashed)

def create_access_token(data:disct, expires_delta:timedelta = timedelta(hours=24)):
    to_encode = data.copy()
    to_encode.update({exp:datetime.datetime.timezone.utc + expires_delta})


