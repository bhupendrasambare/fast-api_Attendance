import NavigationBar from '../components/Navbar'
import { BiPlusCircle } from "react-icons/bi";
import { useEffect, useState } from 'react';
import AddStudentForm from '../modals/AddStudentForm';
import api from '../services/api';
import { Card } from 'react-bootstrap';
import CheckAttendanceForm from './CheckAttendanceForm';
import { GET_STUDENTS } from '../services/urls';

function Students() {
    const [addStudentModal, setAddStudentModal] = useState(false);
    const [attendanceModal, setAttendanceModal] = useState(false);
    const [students,setStudents] = useState([]);

    useEffect(() => {
        getStudents();
    }, [addStudentModal]);

    const getStudents = async () => {
        try {
            const response = await api.get(GET_STUDENTS);
            if (response.data) {
                setStudents(response.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch students:", err);
        }
    };

  return (
    <>
        <NavigationBar>
            
            <div className="card m-2 p-3">
                <div className="d-flex w-100 justify-content-between">
                    <h4 className="fw-bold">
                        Students
                    </h4>
                    <div className="button-section">
                        <button className="btn btn-success rounded-lg btn-sm mx-1" onClick={()=>setAddStudentModal(true)}>
                            <BiPlusCircle size={20} className='fw-bold me-1'/>Add Student
                        </button>
                        <button className="btn btn-success rounded-lg btn-sm mx-1" onClick={()=>setAttendanceModal(true)}>
                            <BiPlusCircle size={20} className='fw-bold me-1'/>Check Attendance
                        </button>
                    </div>
                </div>
                <div className="mt-4 d-flex flex-wrap gap-3">
                    {students.map((student) => (
                        <Card style={{ width: '12rem' }} key={student._id}>
                        <Card.Img
                            variant="top"
                            src={`http://localhost:8000/${student.image_name}`}
                            alt={`${student.firstname}'s image`}
                        />
                        <Card.Body>
                            <Card.Title>{student.firstname} {student.lastname}</Card.Title>
                            <Card.Text>
                            Class: {student.student_class?.name}, Section: {student.section?.name}
                            <br/>
                            Session: {student.session?.name}
                            </Card.Text>
                        </Card.Body>
                        </Card>
                    ))}
                </div>
            </div>


        </NavigationBar>
        <AddStudentForm
            show={addStudentModal}
            onHide={() => setAddStudentModal(false)}
        />
        <CheckAttendanceForm
            show={attendanceModal}
            onHide={() => setAttendanceModal(false)}
        />
    </>
  )
}

export default Students