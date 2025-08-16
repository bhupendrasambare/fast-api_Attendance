from pydantic import BaseModel
from typing import Optional

class createSession(BaseModel):
    start_year:str
    end_year:str
    active:bool

class updateSession(BaseModel):
    start_year:str
    end_year:str
    active:bool

class createClassRoom(BaseModel):
    