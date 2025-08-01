import face_recognition
import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.database import students_collection
from pathlib import Path

router = APIRouter(prefix="/attendance", tags=["Attendance"])

@router.post("/check-attendance")
async def check_attendance_by_image(group_image: UploadFile = File(...)):
    temp_filename = f"temp_{uuid.uuid4().hex}_{group_image.filename}"
    temp_path = Path(temp_filename)
    with open(temp_path, "wb") as f:
        f.write(await group_image.read())

    try:
        group_img = face_recognition.load_image_file(temp_path)
        group_encodings = face_recognition.face_encodings(group_img)

        if not group_encodings:
            raise HTTPException(status_code=400, detail="No face detected in uploaded image")

        students = await students_collection.find().to_list(100)
        matched_students = []
        matched_face_indexes = set()

        for student in students:
            image_path = student.get("image_name")
            if not image_path or not os.path.exists(image_path):
                continue

            try:
                known_image = face_recognition.load_image_file(image_path)
                known_encodings = face_recognition.face_encodings(known_image)
                if not known_encodings:
                    continue
                known_encoding = known_encodings[0]

                for idx, group_face_encoding in enumerate(group_encodings):
                    if idx in matched_face_indexes:
                        continue  # Skip already matched face

                    result = face_recognition.compare_faces(
                        [known_encoding], group_face_encoding, tolerance=0.5
                    )
                    if result[0]:
                        student["_id"] = str(student["_id"])
                        matched_students.append(student)
                        matched_face_indexes.add(idx)
                        break
            except Exception:
                continue

        return matched_students

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
