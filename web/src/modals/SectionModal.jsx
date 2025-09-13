import  { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { BASE_URL, GET_CLASSROOM_BY_SESSION } from "../services/urls";

const SectionModal = ({ show, handleClose, refreshClassrooms }) => {
  const [sectionName, setSectionName] = useState("");
  const [classroomId, setCLassroomId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [classrooms, setClassrooms] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (show) {
      fetch(BASE_URL + "/sessions/", {
        headers: {
          accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setSessions(data);
          if (data.length > 0 && !sessionId) {
            setSessionId(data[0].id || data[0]._id); // adjust based on backend response
          }
        })
        .catch((err) => console.error("Error fetching sessions:", err));
    }
  }, [show]);

  // Fetch classrooms for dropdown
  useEffect(() => {
    if(!sessionId){
      return;
    }
    if (show) {
      fetch(GET_CLASSROOM_BY_SESSION(sessionId), {
        headers: {
          accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setClassrooms(data);
          if (data.length > 0) {
            setCLassroomId(data[0]._id);
          }
        })
        .catch((err) => console.error("Error fetching classrooms:", err));
    }
  }, [show, sessionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      section_name: sectionName,
      class_room:classroomId,
    };

    try {
      const res = await fetch(BASE_URL + "/sections/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create section");

      await res.json();
      refreshClassrooms(); // reload classrooms
      handleClose(); // close modal
      setSectionName(""); // reset form
      setCLassroomId("");
    } catch (err) {
      console.error("Error creating classroom:", err);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Section</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Section Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter section name"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Session</Form.Label>
            <Form.Select
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              required
            >
              <option value="">-- Select Session --</option>
              {sessions.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.start_year} - {s.end_year}{" "}
                  {s.active ? "(Active)" : ""}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Classroom</Form.Label>
            <Form.Select
              value={classroomId}
              onChange={(e) => setCLassroomId(e.target.value)}
              required
            >
              <option value="">-- Select Classroom --</option>
              {classrooms.map((s) => (
                <option key={s._id} value={s._id}>
                  {s?.session?.start_year} - {s?.session?.end_year}{" : "}
                  {s.classroom_name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Button variant="primary" type="submit">
            Save Section
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default SectionModal;