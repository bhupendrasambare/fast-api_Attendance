from fastapi import APIRouter, HTTPException, Depends
from .models import UserCreate, UserUpdate, UserLogin, StudentCreate, StudentUpdate
from .database import users_collection
from .utils import hash_password
from .auth import authenticate_user
from bson import ObjectId
from .auth import get_current_user

router = APIRouter()

@router.post("/register")
async def register_user(user: UserCreate):
    if await users_collection.find_one({"$or": [{"username": user.username}, {"email": user.email}]}):
        raise HTTPException(status_code=400, detail="User already exists")

    user_dict = user.dict()
    user_dict["password"] = hash_password(user.password)
    result = await users_collection.insert_one(user_dict)
    return {"id": str(result.inserted_id), "message": "User registered successfully"}

@router.put("/update/{user_id}")
async def update_user(user_id: str, user: UserUpdate, userData: dict = Depends(get_current_user)):
    updates = {k: v for k, v in user.dict().items() if v is not None}
    if "password" in updates:
        updates["password"] = hash_password(updates["password"])
    result = await users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": updates})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found or data unchanged")
    return {"message": "User updated successfully"}

@router.post("/login")
async def login_user(login_data: UserLogin):
    return await authenticate_user(login_data.username_or_email, login_data.password)


@router.post("/students/")
async def add_student(student:StudentCreate, image:UploadFile = File(...)):
    filename = f"{student.firstname}_{student.lastname}.{image.filename.split(".")[-1]}"
    dir_path = Path(BASE_UPLOAD_DIR) / studnet.session / f"{student.firstname}_{student.lastname}"
    dir_path.mkdir(parent=True, exist_ok=True)
    file_path = dir_path / filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    student_dict = student.dict()
    student_dict["image_name"] = str(file_path)
    result = await students_collection.inset_one(student_dist)
    return {"id": str(result.inserted_id), "messaqe":"Student created"}