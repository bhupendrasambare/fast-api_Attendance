import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Button } from "react-bootstrap";
import api from "../services/api";

const StudentDataTable = ({ setStudentId, onAdd, studentId }) => {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("/students/get"); // 👈 no need to add baseURL or token
        console.log("Full API response:", res.data);
        console.log("First student:", res.data.data?.[0]);

        setStudents(res.data.data || []);
        setFiltered(res.data.data || []);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

const columns = [
  {
    name: "#",
    selector: (row) => (
      <input
        checked={studentId === row._id}
        type="radio"
        name="student-radio"
        onChange={() => setStudentId(row._id)}
      />
    ),
    width: "70px",
  },
  {
    name: "Full Name",
    selector: (row) =>
      `${row.firstname || ""} ${row.middlename || ""} ${row.lastname || ""}`,
    sortable: true,
  },
  {
  name: "Class",
  selector: (row) =>
    row.student_class?.name ||
    row.student_class?.classroom_name ||
    row.student_class?.class_name ||
    "(Not Set)",
  sortable: true,
},
{
  name: "Section",
  selector: (row) =>
    row.section?.name ||
    row.section?.section_name ||
    "(Not Set)",
  sortable: true,
},
{
  name: "Session",
  selector: (row) =>
    row.session?.name ||
    `${row.session?.start_year || ""} - ${row.session?.end_year || ""}` ||
    "(Not Set)",
  sortable: true,
},
];

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const result = students.filter((s) =>
      `${s.firstname} ${s.middlename} ${s.lastname}`
        .toLowerCase()
        .includes(value)
    );
    setFiltered(result);
  };

  return (
    <div className="shadow-lg py-3 px-1 mx-1 rounded">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="fw-bold m-2">Students</h5>
        <Button
          variant="primary"
          className="shadow-sm rounded-pill btn-sm mx-3"
          onClick={onAdd}
        >
          Add Student
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        progressPending={loading}
        pagination
        highlightOnHover
        pointerOnHover
        striped
        subHeader
        subHeaderComponent={
          <input
            type="text"
            placeholder="Search..."
            className="form-control w-25"
            onChange={handleSearch}
          />
        }
      />
    </div>
  );
};

export default StudentDataTable;
