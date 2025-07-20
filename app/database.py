import motor.motor_asyncio
import os
from doenv import load_dotenv

load_dotenv()

client = motor.motor_asyncio.AsyncIoMotorClient(os.getenv("MONGO_ENV"))
db = client("auth_db")
users_collection = db["users"]
