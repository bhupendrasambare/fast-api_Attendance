from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from app.auth.auth import get_current_user
from app.database import students_collection
from app.students.modules import StudentCreate, StudentUpdate
from bson import ObjectId
from pathlib import Path
import shutil, os

import dotenv
dotenv.load_dotenv()

router = APIRouter(prefix="/students", tags=["Students"])
BASE_UPLOAD_DIR = os.getenv("LOCAL_LOCATION")

@router.post("/add")
async def create_student(student:StudentCreate, image:UploadFile = File(...), user: dict = Depends(get_current_user)):
    filename = f"{student.firstname}_{student.lastname}.{image.filename.split(".")[-1]}"
    dir_path = Path(BASE_UPLOAD_DIR) / student.session / f"{student.firstname}_{student.lastname}"
    dir_path.mkdir(parents=True, exist_ok=True)
    file_path = dir_path / filename

    with open(file_path, "wb") as f:
        shutil.copyfileobj(image.file, f)

    student_dist = student.dict()
    student_dist["image_name"] = str(file_path)
    student_dist["created_by"] = str(user["_id"])
    result = await students_collection.insert_one(student_dist)
    return {"id":result.inserted_id, "message":"Student created"}
