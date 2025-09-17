import  { useEffect, useState } from 'react'
import { Button, Card, Form, Image, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { ADD_STUDENT, CHECK_ATTENDANCE } from '../services/urls';
import api from '../services/api';

function CheckAttendanceForm(props) {

    const [students,setStudents] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState(null);

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

        if (!selectedImage) {
            toast.error("Please add image.");
            return;
        }

        const formData = new FormData();
        formData.append("group_image", selectedImage);

        try {
            const response = await api.post(CHECK_ATTENDANCE, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });

            if (response.data) {
                setStudents(response.data);
            }
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
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Select Image</Form.Label>
                            <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                        </Form.Group>
                    </div> 
                </div>
            </Form>

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
                        Class: {student.student_class.name}, Section: {student.section.name}
                        <br/>
                        Session: {student.session.name}
                        </Card.Text>
                    </Card.Body>
                    </Card>
                ))}
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={props.onHide}>
                Close
            </Button>
            <Button variant="primary" onClick={handelRegister}>
                Check attendance
            </Button>
        </Modal.Footer>
    </Modal>
  )
}

export default CheckAttendanceForm