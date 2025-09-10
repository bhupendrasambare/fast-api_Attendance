import React, { useState } from "react";
import { Table } from "react-bootstrap";

const SectionTable = ({ sections, setSectionId, sectionId }) => {
  const [page, setPage] = useState(1);
  const perPage = 5;
  const totalPages = Math.ceil(sections.length / perPage);

  const paginated = sections.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="shadow-lg py-3 px-1 mx-1 rounded">
      <h5 className="fw-bold m-2">Sections</h5>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Section name</th>
            <th>Class name</th>
            <th>Session</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((section) => (
            <tr key={section._id}>
              <td>
                <input
                  checked={(sectionId == section?._id)?"checked":""}
                  type="radio"
                  name="section-radio"
                  onClick={() => setSectionId(section._id)}
                />
              </td>
              <td>{section.section_name}</td>
              <td>{section.class_room?.classroom_name}</td>
              <td>
                {section?.class_room?.session?.start_year} -{" "}
                {section?.class_room?.session?.end_year}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <div className="d-flex justify-content-between">
        <button
          className="btn btn-outline-primary btn-sm"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages || 1}
        </span>
        <button
          className="btn btn-outline-primary btn-sm"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SectionTable;