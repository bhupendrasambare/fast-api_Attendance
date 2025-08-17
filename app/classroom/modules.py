from pydantic import BaseModel
from typing import Optional
from bson.objectid import ObjectId

class createSession(BaseModel):
    start_year:str
    end_year:str
    active:bool

class updateSession(BaseModel):
    start_year:str
    end_year:str
    active:bool

class createClassRoom(BaseModel):
    class_name:str
    session: ObjectId
    
class createSection(BaseModel):
    class_room:ObjectId
    secction_name:str
    session: ObjectId