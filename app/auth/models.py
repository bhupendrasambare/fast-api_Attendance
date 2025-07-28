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
    username:Optional[str] = None
    email: Optional[EmailStr] = None
    password:Optional[str] = None
    first_name:Optional[str] = None
    last_name:Optional[str] = None
    role:Optional[str] = None

class UserLogin(BaseModel):
    username_or_email:str
    password:str


