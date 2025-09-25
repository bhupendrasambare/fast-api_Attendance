import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Button } from "react-bootstrap";
import api from "../services/api";
import { BASE_LINK } from "../services/urls";

const StudentDataTable = ({ onAdd, sectionId, classroomId, sessionId }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetchStudents = async (pageNum = page, size = perPage, searchTerm = search) => {
    setLoading(true);
    try {
      const res = await api.post("/students/list", {
        page: pageNum,
        size,
        search: searchTerm,
        sectionId,
        classroomId,
        sessionId,
      });

      setStudents(res.data.data || []);
      setTotalRows(res.data.total || 0);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [sectionId, classroomId, sessionId]);

  const handlePageChange = (pageNum) => {
    setPage(pageNum);
    fetchStudents(pageNum);
  };

  const handlePerRowsChange = async (newPerPage, pageNum) => {
    setPerPage(newPerPage);
    fetchStudents(pageNum, newPerPage);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchStudents(1, perPage, value); // reset to page 1 when searching
  };

  const columns = [
    {
      name: "Photo",
      selector: (row) => (
        <img
          className="m-3"
          src={`${BASE_LINK}${row.image_name}`}
          alt={`${row.firstname}'s image`}
          width={100}
        />
      ),
      sortable: false,
    },
    {
      name: "Full Name",
      selector: (row) => `${row.firstname || ""} ${row.middlename || ""} ${row.lastname || ""}`,
      sortable: true,
    },
    {
      name: "Section",
      selector: (row) => row.section?.name || "(Not Set)",
      sortable: true,
    },
    {
      name: "Class",
      selector: (row) => row.student_class?.name || "(Not Set)",
      sortable: true,
    },
    {
      name: "Session",
      selector: (row) => row.session?.name || "(Not Set)",
      sortable: true,
    },
  ];

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
        data={students}
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        highlightOnHover
        striped
        subHeader
        subHeaderComponent={
          <input
            type="text"
            placeholder="Search..."
            className="form-control w-25"
            value={search}
            onChange={handleSearch}
          />
        }
      />
    </div>
  );
};

export default StudentDataTable;