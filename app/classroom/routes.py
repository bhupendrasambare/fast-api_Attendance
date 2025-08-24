from fastapi import Query, APIRouter, HTTPException
from typing import Optional, List
from bson import ObjectId

from app.database import (
    sessions_collection,
    classrooms_collection,
    sections_collection,
)
from app.classroom.modules import CreateSession, UpdateSession, CreateClassRoom, CreateSection

session_router = APIRouter(prefix="/sessions", tags=["4. Sessions"])
classroom_router = APIRouter(prefix="/classrooms", tags=["5. Classrooms"])
section_router = APIRouter(prefix="/sections", tags=["6. Sections"])


# ---------------- SESSION ROUTES ----------------
@session_router.post("/", response_model=dict)
async def create_session(session: CreateSession):
    session = session.dict()
    result = await sessions_collection.insert_one(session)
    return {"id":str(result.inserted_id), "message":"Session created"}


@session_router.get("/", response_model=List[dict])
async def get_sessions():
    sessions = await sessions_collection.find().to_list(100)
    for s in sessions:
        s["_id"] = str(s["_id"])
    return sessions


@session_router.put("/{session_id}", response_model=dict)
async def update_session(session_id: str, session: UpdateSession):
    update_data = {k: v for k, v in session.dict().items() if v is not None}

    duplicate = await sessions_collection.find_one({
        "start_year": update_data["start_year"],
        "end_year": update_data["end_year"],
        "_id": {"$ne": ObjectId(session_id)}  # exclude current session
    })
    if duplicate:
        raise HTTPException(status_code=400, detail="A session with the same start and end year already exists")

    result = await sessions_collection.update_one(
        {"_id": ObjectId(session_id)}, {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Session not found")

    return {"id": session_id, **update_data}


@session_router.delete("/{session_id}", response_model=dict)
async def delete_session(session_id: str):
    result = await sessions_collection.delete_one({"_id": ObjectId(session_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"message": "Session deleted successfully"}


# ---------------- CLASSROOM ROUTES ----------------
@classroom_router.post("/", response_model=dict)
async def create_classroom(classroom: CreateClassRoom):
    data = classroom.dict()

    if "session" in data and data["session"]:
        if not ObjectId.is_valid(data["session"]):
            raise HTTPException(status_code=400, detail="Invalid session id")
        session = await sessions_collection.find_one({"_id": ObjectId(data["session"])})
        if not session:
            raise HTTPException(status_code=400, detail="Session not found")
        data["session"] = str(data["session"])

    existing_classroom = await classrooms_collection.find_one({
        "classroom_name": data["classroom_name"],
        "session": data.get("session")
    })
    if existing_classroom:
        raise HTTPException(
            status_code=400,
            detail="Classroom with this name already exists in the given session"
        )

    result = await classrooms_collection.insert_one(data)
    return {"id": str(result.inserted_id), "message": "Classroom created successfully"}


@classroom_router.get("/", response_model=List[dict])
async def get_classrooms(session_id: Optional[str] = Query(None)):
    query = {}

    if session_id:
        if not ObjectId.is_valid(session_id):
            raise HTTPException(status_code=400, detail="Invalid session_id")
        query["session"] = session_id

    classrooms = await classrooms_collection.find(query).to_list(100)

    results = []
    for c in classrooms:
        c["_id"] = str(c["_id"])
        
        session = await sessions_collection.find_one({"_id": ObjectId(c["session"])})
        if session:
            session["_id"] = str(session["_id"])
            c["session"] = session
        results.append(c)

    return results


# ---------------- SECTION ROUTES ----------------
@section_router.post("/", response_model=dict)
async def create_section(section: CreateSection):
    
    if not ObjectId.is_valid(section.class_room):
        raise HTTPException(status_code=400, detail="Invalid class_room id")
    if not ObjectId.is_valid(section.session):
        raise HTTPException(status_code=400, detail="Invalid session id")

    classroom = await classrooms_collection.find_one({"_id": ObjectId(section.class_room)})
    if not classroom:
        raise HTTPException(status_code=404, detail="Classroom not found")


    duplicate = await sections_collection.find_one({
        "class_room": section.class_room,
        "session": section.session,
        "section_name": section.section_name
    })
    if duplicate:
        raise HTTPException(status_code=400, detail="Section already exists for this classroom in the same session")

    data = section.dict()
    result = await sections_collection.insert_one(data)

    classroom["_id"] = str(classroom["_id"])
    session = await sessions_collection.find_one({"_id": ObjectId(classroom["session"])})
    if session:
        session["_id"] = str(session["_id"])
        classroom["session"] = session

    return {"id": str(result.inserted_id), "class_room": classroom}


@section_router.get("/", response_model=List[dict])
async def get_sections():
    sections = await sections_collection.find().to_list(100)
    results = []
    for s in sections:
        s["_id"] = str(s["_id"])
        classroom = await classrooms_collection.find_one({"_id": ObjectId(s["class_room"])})
        if classroom:
            classroom["_id"] = str(classroom["_id"])
            session = await sessions_collection.find_one({"_id": ObjectId(classroom["session"])})
            if session:
                session["_id"] = str(session["_id"])
                classroom["session"] = session
            s["class_room"] = classroom
        results.append(s)
    return results
