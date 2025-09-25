from pydantic import BaseModel
from typing import Optional

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

class StudentFilter(BaseModel):
    page: int = 1
    size: int = 10
    search: Optional[str] = None
    sectionId: Optional[str] = None
    classroomId: Optional[str] = None
    sessionId: Optional[str] = None

