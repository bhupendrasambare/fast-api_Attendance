from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    username:str
    email: EmailStr
    password:str
    first_name:str
    last_name:str
    role:str

class UserUpdate(BaseModel):
    username:str
    email: EmailStr
    password:str
    first_name:str
    last_name:str
    role:str

class UserLogin(BaseModel):
    username_or_email:str
    password:str

