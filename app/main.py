from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.auth.routes import router as auth_router
from app.students.routes import router as student_router
from app.attendance.routes import router as attendance_router
import os
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    "http://localhost:3000",  # React dev server
    "http://127.0.0.1:3000",
    # Add more domains or frontend URLs as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1")
app.include_router(student_router, prefix="/api/v1")
app.include_router(attendance_router, prefix="/api/v1")

UPLOAD_DIR = os.getenv("LOCAL_LOCATION")  # should be absolute path
app.mount("/upload", StaticFiles(directory=UPLOAD_DIR), name="upload")