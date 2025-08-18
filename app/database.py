from motor import motor_asyncio
import os
from dotenv import load_dotenv

load_dotenv()

client = motor_asyncio.AsyncIOMotorClient(os.getenv("MONGO_ENV"))
db = client["auth_db"]
users_collection = db["users"]
students_collection = db["students"]
sessions_collection = db["sessions"]
classrooms_collection = db["classrooms"]
sections_collection = db["sections"]

