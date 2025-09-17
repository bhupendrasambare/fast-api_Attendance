import face_recognition
import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.database import students_collection, sessions_collection, classrooms_collection, sections_collection
from pathlib import Path
from bson import ObjectId

router = APIRouter(prefix="/attendance", tags=["3. Attendance"])

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

        enriched_students = []
        for s in matched_students:
            s["_id"] = str(s["_id"])
            sessionData = await sessions_collection.find_one({"_id": ObjectId(s["session"])})
            classroomData = await classrooms_collection.find_one({"_id": ObjectId(s["student_class"])})
            sectionData = await sections_collection.find_one({"_id": ObjectId(s["section"])})

            s["session"] = {"_id": str(sessionData["_id"]), "name": sessionData.get("start_year") + '-' + sessionData.get("end_year")} if sessionData else None
            s["student_class"] = {"_id": str(classroomData["_id"]), "name": classroomData.get("classroom_name")} if classroomData else None
            s["section"] = {"_id": str(sectionData["_id"]), "name": sectionData.get("section_name")} if sectionData else None
            enriched_students.append(s)

        return enriched_students

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
