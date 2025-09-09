import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { BASE_URL } from "../services/urls";

const SessionModal = ({ show, handleClose, refreshSessions }) => {
  const currentYear = new Date().getFullYear();

  const [startYear, setStartYear] = useState(currentYear.toString());
  const [endYear, setEndYear] = useState((currentYear + 1).toString());
  const [active, setActive] = useState(true);

  // Generate start years from 1900 to current year
  const startYearOptions = Array.from(
    { length: currentYear - 1900 + 1 },
    (_, i) => 1900 + i
  );

  // Generate end years dynamically based on selected startYear
  const endYearOptions = Array.from(
    { length: currentYear + 10 - parseInt(startYear, 10) + 1 },
    (_, i) => parseInt(startYear, 10) + i
  );

  // Ensure endYear is always >= startYear
  useEffect(() => {
    if (parseInt(endYear, 10) < parseInt(startYear, 10)) {
      setEndYear(startYear);
    }
  }, [startYear]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      start_year: startYear,
      end_year: endYear,
      active: active,
    };

    try {
      const res = await fetch(BASE_URL + "/sessions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create session");

      await res.json();
      refreshSessions(); // reload sessions
      handleClose(); // close modal
    } catch (err) {
      console.error("Error creating session:", err);
      alert("Failed to create session!");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Session</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Start Year</Form.Label>
            <Form.Select
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              required
            >
              {startYearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>End Year</Form.Label>
            <Form.Select
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
              required
            >
              {endYearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3 d-flex align-items-center">
            <Form.Check
              type="checkbox"
              label="Active"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Save Session
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default SessionModal;