from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form, Query
from app.auth.auth import get_current_user
from app.database import students_collection, sessions_collection, classrooms_collection, sections_collection
from app.students.modules import StudentFilter, StudentUpdate
from bson import ObjectId
from pathlib import Path
from typing import Optional
import shutil, os

import dotenv
dotenv.load_dotenv()

router = APIRouter(prefix="/students", tags=["2. Students"])
BASE_UPLOAD_DIR = os.getenv("LOCAL_LOCATION")

def safe_object_id(id_str: Optional[str]) -> Optional[ObjectId]:
    """Convert to ObjectId if valid, else return None"""
    if id_str and ObjectId.is_valid(id_str):
        return ObjectId(id_str)
    return None

@router.post("/add")
async def create_student(
    firstname: str = Form(...),
    middlename: str = Form(...),
    lastname: str = Form(...),
    student_class: str = Form(...),
    section: str = Form(...),
    session: str = Form(...),
    image: UploadFile = File(...),
    user: dict = Depends(get_current_user)
):
    # Save file
    filename = f"{firstname}_{lastname}.{image.filename.split('.')[-1]}"
    dir_path = Path(BASE_UPLOAD_DIR) / session / f"{firstname}_{lastname}"
    dir_path.mkdir(parents=True, exist_ok=True)
    file_path = dir_path / filename

    with open(file_path, "wb") as f:
        shutil.copyfileobj(image.file, f)

    # Validate related IDs
    sessionData = await sessions_collection.find_one({"_id": ObjectId(session)})
    if not sessionData:
        raise HTTPException(detail="Invalid session id", status_code=404)

    classroomData = await classrooms_collection.find_one({"_id": ObjectId(student_class)})
    if not classroomData:
        raise HTTPException(detail="Invalid classroom id", status_code=404)

    sectionData = await sections_collection.find_one({"_id": ObjectId(section)})
    if not sectionData:
        raise HTTPException(detail="Invalid section id", status_code=404)

    student_dict = {
        "firstname": firstname,
        "middlename": middlename,
        "lastname": lastname,
        "student_class": student_class,
        "section": section,
        "session": session,
        "image_name": str(file_path),
        "created_by": str(user)
    }

    result = await students_collection.insert_one(student_dict)
    return {"id": str(result.inserted_id), "message": "Student created"}


@router.get("/get")
async def get_students(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1),
    sectionId:str | None = Query(default=None, description="An optional sectionId string"),
    classroomId:str | None = Query(default=None, description="An optional clasrromId string"),
    sessionId:str | None = Query(default=None, description="An optional sessionId string"),
    user: dict = Depends(get_current_user)
):
    skip = (page - 1) * size

    section_oid = safe_object_id(sectionId)
    classroom_oid = safe_object_id(classroomId)
    session_oid = safe_object_id(sessionId)

    query = {}
    if section_oid:
        query["section"] = section_oid
    if classroom_oid:
        query["student_class"] = classroom_oid
    if session_oid:
        query["session"] = session_oid

    total = await students_collection.count_documents(query)

    students = (
        await students_collection.find(query)
        .skip(skip)
        .limit(size)
        .to_list(length=size)
    )

    enriched_students = []
    for s in students:
        s["_id"] = str(s["_id"])
        sessionData = await sessions_collection.find_one({"_id": ObjectId(s["session"])})
        classroomData = await classrooms_collection.find_one({"_id": ObjectId(s["student_class"])})
        sectionData = await sections_collection.find_one({"_id": ObjectId(s["section"])})

        s["session"] = {"_id": str(sessionData["_id"]), "name": sessionData.get("start_year") + '-' + sessionData.get("end_year")} if sessionData else None
        s["student_class"] = {"_id": str(classroomData["_id"]), "name": classroomData.get("classroom_name")} if classroomData else None
        s["section"] = {"_id": str(sectionData["_id"]), "name": sectionData.get("section_name")} if sectionData else None
        enriched_students.append(s)

    return {
        "page": page,
        "size": size,
        "total": total,
        "pages": (total + size - 1) // size,
        "data": enriched_students
    }

@router.post("/list")
async def list_students(
    filters: StudentFilter,
    user: dict = Depends(get_current_user)
):
    skip = (filters.page - 1) * filters.size

    section_oid = safe_object_id(filters.sectionId)
    classroom_oid = safe_object_id(filters.classroomId)
    session_oid = safe_object_id(filters.sessionId)

    query = {}
    if section_oid:
        query["section"] = section_oid
    if classroom_oid:
        query["student_class"] = classroom_oid
    if session_oid:
        query["session"] = session_oid

    if filters.search:
        query["$or"] = [
            {"firstname": {"$regex": filters.search, "$options": "i"}},
            {"middlename": {"$regex": filters.search, "$options": "i"}},
            {"lastname": {"$regex": filters.search, "$options": "i"}}
        ]

    total = await students_collection.count_documents(query)

    students = (
        await students_collection.find(query)
        .skip(skip)
        .limit(filters.size)
        .to_list(length=filters.size)
    )

    enriched_students = []
    for s in students:
        s["_id"] = str(s["_id"])
        sessionData = await sessions_collection.find_one({"_id": ObjectId(s["session"])})
        classroomData = await classrooms_collection.find_one({"_id": ObjectId(s["student_class"])})
        sectionData = await sections_collection.find_one({"_id": ObjectId(s["section"])})

        s["session"] = {
            "_id": str(sessionData["_id"]),
            "name": f"{sessionData.get('start_year')}-{sessionData.get('end_year')}"
        } if sessionData else None

        s["student_class"] = {
            "_id": str(classroomData["_id"]),
            "name": classroomData.get("classroom_name")
        } if classroomData else None

        s["section"] = {
            "_id": str(sectionData["_id"]),
            "name": sectionData.get("section_name")
        } if sectionData else None

        enriched_students.append(s)

    return {
        "page": filters.page,
        "size": filters.size,
        "total": total,
        "pages": (total + filters.size - 1) // filters.size,
        "data": enriched_students
    }

@router.put("/update/{student_id}")
async def update_student(
    student_id: str,
    student: StudentUpdate,
    user: dict = Depends(get_current_user)
):
    updates = {k: v for k, v in student.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No valid fields to update")

    result = await students_collection.update_one({"_id": ObjectId(student_id)}, {"$set": updates})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"message": "Student updated"}


@router.delete("/delete/{student_id}")
async def delete_student(student_id: str, user: dict = Depends(get_current_user)):
    result = await students_collection.delete_one({"_id": ObjectId(student_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"message": "Student deleted"}