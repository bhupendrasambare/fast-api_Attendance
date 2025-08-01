import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import api from "../services/api";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/students")
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4">
      <h3>Student Dashboard</h3>
      {loading ? (
        <ClipLoader color="#0d6efd" loading={true} size={50} />
      ) : (
        <ul>
          {data.map((student) => (
            <li key={student._id}><i className="fas fa-user-graduate me-2"></i>{student.firstname}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
