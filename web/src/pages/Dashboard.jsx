import { useEffect, useState } from "react";
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
        <NavigationBar>
            <div className="card p-3 rounded-lg">
                <p className="fw-bold fs-4">Sessions</p>
                <div className="d-flex flex-wrap justify-content-around w-100">
                    <div  class="card text-white mb-3 dashboard_card dark_bg_1 shadow-lg" >
                        <div class="card-body">
                            <div className="d-flex justify-content-between w-100">
                                <div className="fs-5">2024-2025</div>
                                <div className="fw-bold fs-5">2000</div>
                            </div>
                        </div>
                    </div>
                    <div  class="card text-white mb-3 dashboard_card dark_bg_2 shadow-lg" >
                        <div class="card-body">
                            <div className="d-flex justify-content-between w-100">
                                <div className="fs-5">2023-2024</div>
                                <div className="fw-bold fs-5">1917</div>
                            </div>
                        </div>
                    </div>
                    <div  class="card text-white mb-3 dashboard_card dark_bg_3 shadow-lg" >
                        <div class="card-body">
                            <div className="d-flex justify-content-between w-100">
                                <div className="fs-5">2022-2023</div>
                                <div className="fw-bold fs-5">1687</div>
                            </div>
                        </div>
                    </div>
                    <div  class="card text-white mb-3 dashboard_card dark_bg_4 shadow-lg" >
                        <div class="card-body">
                            <div className="d-flex justify-content-between w-100">
                                <div className="fs-5">2021-2022</div>
                                <div className="fw-bold fs-5">1587</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </NavigationBar>
    </>
  );
}

export default Dashboard