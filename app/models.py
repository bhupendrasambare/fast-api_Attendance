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

class StudentCreate(BaseModel):
    firstname:str
    middlename:str
    lastname:str
    student_class:str
    section:str
    session:str

class StudentUpdate(BaseModel):
    firstname:Optional[str] = None
    middlename:Optional[str] = None
    lastname:Optional[str] = None
    student_class:Optional[str] = None
    section:Optional[str] = None
    session:Optional[str] = None

