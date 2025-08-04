import React, { useEffect, useState } from 'react'
import { Button, Form, Image, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { ADD_STUDENT } from '../services/urls';
import api from '../services/api';

function AddStudentForm(props) {

    const [firstname,setFirstName] = useState("");
    const [middlename,setMiddleName] = useState("");
    const [lastname,setLastName] = useState("");
    const [student_class,setStudentClass] = useState("");
    const [section,setSection] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 41 }, (_, i) => currentYear - 20 + i);

    const [startYear, setStartYear] = useState(currentYear);
    const [endYear, setEndYear] = useState(currentYear);

    useEffect(() => {
        if (endYear < startYear) {
        setEndYear(startYear);
        }
    }, [startYear]);

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

        if (!firstname || !lastname || !student_class || !section || !selectedImage) {
            toast.error("Please fill all required fields and select an image.");
            return;
        }

        const session = `${startYear}-${endYear}`;

        const formData = new FormData();
        formData.append("firstname", firstname);
        formData.append("middlename", middlename);
        formData.append("lastname", lastname);
        formData.append("student_class", student_class);
        formData.append("section", section);
        formData.append("session", session);
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
                    <div className="col-sm-6">
                        <Form.Group className="mb-3" controlId="forLastName">
                            <Form.Label>LastName</Form.Label>
                            <Form.Control placeholder="Enter last name"  onChange={(e) => setLastName(e.target.value)} />
                        </Form.Group>
                    </div> 
                    <div className="col-sm-6">
                        <Form.Group className="mb-3" controlId="forClassName">
                            <Form.Label>Class name</Form.Label>
                            <Form.Control placeholder="Enter class name"  onChange={(e) => setStudentClass(e.target.value)} />
                        </Form.Group>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-6">
                        <Form.Group className="mb-3" controlId="forSection">
                            <Form.Label>Section</Form.Label>
                            <Form.Control placeholder="Enter last name"  onChange={(e) => setSection(e.target.value)} />
                        </Form.Group>
                    </div> 
                    <div className="col-sm-6 d-flex gap-3">
                        <Form.Group controlId="startYear">
                            <Form.Label>Start Year</Form.Label>
                            <Form.Select value={startYear} onChange={(e) => setStartYear(parseInt(e.target.value))}>
                            {years.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="endYear">
                            <Form.Label>End Year</Form.Label>
                            <Form.Select value={endYear} onChange={(e) => setEndYear(parseInt(e.target.value))}>
                            {years
                                .filter((year) => year >= startYear)
                                .map((year) => (
                                <option key={year} value={year}>{year}</option>
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
                Save Changes
            </Button>
        </Modal.Footer>
    </Modal>
  )
}

export default AddStudentForm