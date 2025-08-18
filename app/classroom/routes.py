from fastapi import APIRouter, HTTPException
from typing import List
from bson import ObjectId

from app.database import (
    sessions_collection,
    classrooms_collection,
    sections_collection,
)
from app.classroom.modules import CreateSession, UpdateSession, CreateClassRoom, CreateSection

session_router = APIRouter(prefix="/sessions", tags=["Sessions"])
classroom_router = APIRouter(prefix="/classrooms", tags=["Classrooms"])
section_router = APIRouter(prefix="/sections", tags=["Sections"])


# ---------------- SESSION ROUTES ----------------
@session_router.post("/", response_model=dict)
async def create_session(session: CreateSession):
    session_data = session.dict()
    result = await sessions_collection.insert_one(session_data)
    return {"id": str(result.inserted_id), **session_data}


@session_router.get("/", response_model=List[dict])
async def get_sessions():
    sessions = await sessions_collection.find().to_list(100)
    for s in sessions:
        s["_id"] = str(s["_id"])
    return sessions


@session_router.put("/{session_id}", response_model=dict)
async def update_session(session_id: str, session: UpdateSession):
    update_data = {k: v for k, v in session.dict().items() if v is not None}
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
    result = await classrooms_collection.insert_one(data)
    return {"id": str(result.inserted_id), **data}


@classroom_router.get("/", response_model=List[dict])
async def get_classrooms():
    classrooms = await classrooms_collection.find().to_list(100)
    for c in classrooms:
        c["_id"] = str(c["_id"])
    return classrooms


# ---------------- SECTION ROUTES ----------------
@section_router.post("/", response_model=dict)
async def create_section(section: CreateSection):
    data = section.dict()
    result = await sections_collection.insert_one(data)
    return {"id": str(result.inserted_id), **data}


@section_router.get("/", response_model=List[dict])
async def get_sections():
    sections = await sections_collection.find().to_list(100)
    for s in sections:
        s["_id"] = str(s["_id"])
    return sections