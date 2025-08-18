from pydantic import BaseModel
from typing import Optional
from bson import ObjectId

# ---------------- SESSION ----------------
class CreateSession(BaseModel):
    start_year: str
    end_year: str
    active: bool

class UpdateSession(BaseModel):
    start_year: Optional[str] = None
    end_year: Optional[str] = None
    active: Optional[bool] = None

# ---------------- CLASSROOM ----------------
class CreateClassRoom(BaseModel):
    classroom_name: str
    session: ObjectId

# ---------------- SECTION ----------------
class CreateSection(BaseModel):
    class_room: ObjectId
    section_name: str
    session: ObjectId