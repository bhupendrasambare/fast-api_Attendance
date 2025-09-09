import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { BASE_URL } from "../services/urls";

const ClassroomModal = ({ show, handleClose, refreshClassrooms }) => {
  const [classroomName, setClassroomName] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [sessions, setSessions] = useState([]);

  // Fetch sessions for dropdown
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      classroom_name: classroomName,
      session: sessionId,
    };

    try {
      const res = await fetch(BASE_URL + "/classrooms/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create classroom");

      await res.json();
      refreshClassrooms(); // reload classrooms
      handleClose(); // close modal
      setClassroomName(""); // reset form
      setSessionId("");
    } catch (err) {
      console.error("Error creating classroom:", err);
      alert("Failed to create classroom!");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Classroom</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Classroom Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter classroom name"
              value={classroomName}
              onChange={(e) => setClassroomName(e.target.value)}
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
                <option key={s.id || s._id} value={s.id || s._id}>
                  {s.start_year} - {s.end_year}{" "}
                  {s.active ? "(Active)" : ""}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Button variant="primary" type="submit">
            Save Classroom
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ClassroomModal;