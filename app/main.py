from fastapi import FastAPI
from app.auth.routes import router as auth_router
from app.students.routes import router as student_router

app = FastAPI()
app.include_router(auth_router, prefix="/api/v1")
app.include_router(student_router, prefix="/api/v1")
