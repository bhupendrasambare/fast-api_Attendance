from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from app.auth.auth import get_current_user
from app.database import students_collection
from app.students.modules import StudentCreate, StudentUpdate
from bson import ObjectId
from pathlib import Path
import shutil, os

import dotenv
dotenv.load_dotenv()

router = APIRouter(prefix="/students", tags=["2. Students"])
BASE_UPLOAD_DIR = os.getenv("LOCAL_LOCATION")

@router.post("/add")
async def create_student(firstname: str = Form(...), middlename: str = Form(...), lastname: str = Form(...), student_class: str = Form(...),
                        section: str = Form(...), session: str = Form(...), image: UploadFile = File(...), user: dict = Depends(get_current_user)
):
    filename = f"{firstname}_{lastname}.{image.filename.split('.')[-1]}"
    dir_path = Path(BASE_UPLOAD_DIR) / session / f"{firstname}_{lastname}"
    dir_path.mkdir(parents=True, exist_ok=True)
    file_path = dir_path / filename

    with open(file_path, "wb") as f:
        shutil.copyfileobj(image.file, f)

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
    return {"id":str(result.inserted_id), "message":"Student created"}

@router.get("/get")
async def get_students(user: dict = Depends(get_current_user)):
    students = await students_collection.find().to_list()
    return [transform_student(s) for s in students]

@router.put("/update/{student_id}")
async def update_student(student_id:str, student:StudentUpdate, user :dict = Depends(get_current_user)):
    updated = {k: v for k, v in student.model_dump().items() if v is not None}
    restult = await students_collection.update_one({"_id":ObjectId(student_id)}, {"$set": updates})
    if restult.modified_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")
    return {message:"Student updated"}

@router.delete("/delete/{student_id}")
async def delete_student(student_id:str, user: dict= Depends(get_current_user)):
    restult = await students_collection.delete_one({"_id":ObjectId(student_id)})
    if restult.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"message":"Student deleted"}

def transform_student(student):
    student["_id"] = str(student["_id"])
    return student