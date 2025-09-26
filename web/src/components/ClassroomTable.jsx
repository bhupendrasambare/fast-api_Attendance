import React from "react";
import { Table, Button } from "react-bootstrap";

const ClassroomTable = ({ classrooms, setClassroomId, onAdd, classroomId }) => {
  return (
    <div className="shadow-lg py-3 px-1 mx-1 rounded">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="fw-bold m-2">Classrooms</h5>
        <Button
          variant="primary"
          className="shadow-sm rounded-pill btn-sm mx-3"
          onClick={onAdd}
        >
          Add Classroom
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th></th>
            <th>Session</th>
            <th>Status</th>
            <th>Class Name</th>
          </tr>
        </thead>
        <tbody>
          {classrooms.map((classroom) => (
            <tr key={classroom._id}>
              <td>
                <input
                  checked={(classroomId == classroom?._id)?"checked":""}
                  type="radio"
                  name="classroom-radio"
                  onClick={() => setClassroomId(classroom._id)}
                />
              </td>
              <td>
                {classroom?.session?.start_year} - {classroom?.session?.end_year}
              </td>
              <td>{classroom?.session?.active ? "Active" : "Inactive"}</td>
              <td>{classroom?.classroom_name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ClassroomTable;