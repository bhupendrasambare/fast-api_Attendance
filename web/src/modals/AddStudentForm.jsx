import { useEffect, useState } from 'react'
import { Button, Form, Image, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { ADD_STUDENT } from '../services/urls';
import api from '../services/api';
import { fetchClassroom, fetchSections, fetchSessions } from '../services/apiresponse';

function AddStudentForm(props) {

    const [firstname,setFirstName] = useState("");
    const [middlename,setMiddleName] = useState("");
    const [lastname,setLastName] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const [sessionId, setSessionId] = useState("");
    const [classroomId, setClassroomId] = useState("");
    const [sectionId, setSectionId] = useState("");

    const [sessions, setSessions] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [sections, setSections] = useState([]);

    useEffect(() => {
        const loadSessions = async () => {
            const data = await fetchSessions();
            setSessions(data);
            if (data.length > 0) {
                setSessionId(data[0]?._id);
            }
        };
        loadSessions();
    }, []);

    // Fetch classrooms when sessionId changes
    useEffect(() => {
    const loadClassrooms = async () => {
        const data = await fetchClassroom(sessionId);
        setClassrooms(Array.isArray(data) ? data : []);
        if (data.length > 0) {
            setClassroomId(data[0]?._id);
        }
    };
    loadClassrooms();
    }, [sessionId]);

    // Fetch sections when classroomId (or classrooms list) changes
    useEffect(() => {
    const loadSections = async () => {
        const data = await fetchSections(classroomId, sessionId);
        setSections(Array.isArray(data) ? data : []);
        if (data.length > 0) {
            setSectionId(data[0]?._id);
        }
    };
    loadSections();
    }, [classroomId, classrooms, sessionId]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedImage(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    const handelRegister = async (e) => {
        e.preventDefault();

        if (!firstname || !lastname || !classroomId || !sectionId || !selectedImage) {
            toast.error("Please fill all required fields and select an image.");
            return;
        }

        const formData = new FormData();
        formData.append("firstname", firstname);
        formData.append("middlename", middlename);
        formData.append("lastname", lastname);
        formData.append("student_class", classroomId);
        formData.append("section", sectionId);
        formData.append("session", sessionId);
        formData.append("image", selectedImage);

        try {
            const response = await api.post(ADD_STUDENT, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });

            toast.success("Student added successfully!");
            props.onHide();
        } catch (err) {
            toast.error("Failed to add student.");
            console.error(err);
        }
    };

  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
            <Modal.Title>Add student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={handelRegister}>

                <div className="row">
                    <div className="col-sm-6">
                        {preview && (
                        <div className="mb-3">
                            <Image src={preview} style={{width:"200px"}} alt="Preview" thumbnail fluid />
                        </div>
                        )}
                    </div>
                    <div className="col-sm-6">
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-6">
                        <Form.Group className="mb-3" controlId="forFirstName">
                            <Form.Label>First name</Form.Label>
                            <Form.Control placeholder="Enter first name"  onChange={(e) => setFirstName(e.target.value)} />
                        </Form.Group>
                    </div>
                    <div className="col-sm-6">
                        <Form.Group className="mb-3" controlId="forMiddleName">
                            <Form.Label>Middle name</Form.Label>
                            <Form.Control placeholder="Enter middle name"  onChange={(e) => setMiddleName(e.target.value)} />
                        </Form.Group>
                    </div>
                </div>

                <div className="row">
                {/* Last Name */}
                    <div className="col-sm-6">
                        <Form.Group className="mb-3" controlId="forLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter last name"
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        </Form.Group>
                    </div>

                    {/* Session Dropdown */}
                    <div className="col-sm-6">
                        <Form.Group className="mb-3" controlId="forSession">
                        <Form.Label>Session</Form.Label>
                        <Form.Select
                            value={sessionId}
                            onChange={(e) => setSessionId(e.target.value)}
                        >
                            <option value="">Select Session</option>
                            {sessions.map((s) => (
                            <option key={s._id} value={s._id}>
                                {s.start_year} - {s.end_year}
                            </option>
                            ))}
                        </Form.Select>
                        </Form.Group>
                    </div>

                    {/* Classroom Dropdown */}
                    <div className="col-sm-6">
                        <Form.Group className="mb-3" controlId="forClassroom">
                        <Form.Label>Classroom</Form.Label>
                        <Form.Select
                            value={classroomId}
                            onChange={(e) => setClassroomId(e.target.value)}
                        >
                            <option value="">Select Classroom</option>
                            {classrooms.map((c) => (
                            <option key={c._id} value={c._id}>
                                {c.classroom_name}
                            </option>
                            ))}
                        </Form.Select>
                        </Form.Group>
                    </div>

                    {/* Section Dropdown */}
                    <div className="col-sm-6">
                        <Form.Group className="mb-3" controlId="forSection">
                        <Form.Label>Section</Form.Label>
                        <Form.Select
                            value={sectionId}
                            onChange={(e) => setSectionId(e.target.value)}
                        >
                            <option value="">Select Section</option>
                            {sections.map((sec) => (
                            <option key={sec._id} value={sec._id}>
                                {sec.section_name}
                            </option>
                            ))}
                        </Form.Select>
                        </Form.Group>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-6">
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Select Image</Form.Label>
                            <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                        </Form.Group>
                    </div> 
                </div>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={props.onHide}>
                Close
            </Button>
            <Button variant="primary" onClick={handelRegister}>
                Add Student
            </Button>
        </Modal.Footer>
    </Modal>
  )
}

export default AddStudentForm