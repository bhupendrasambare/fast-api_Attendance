import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import api from "../services/api";
import NavigationBar from "../components/Navbar";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/students")
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
        <NavigationBar/>
        <div className="container">

        </div>
    </>
  );
}

export default Dashboard