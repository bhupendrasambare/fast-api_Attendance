import React, { useEffect, useState } from 'react'
import NavigationBar from '../components/Navbar'
import { Table } from 'react-bootstrap';

const Settings = () => {

const [sessionId, setSessionId] = useState("");
  const [classroomId, setClassroomId] = useState("");
  const [sectionId, setSectionId] = useState("");

  const [sessions, setSessions] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [sections, setSections] = useState([]);

  // 1. Fetch sessions on component load
  useEffect(() => {
    fetch("http://localhost:8000/api/v1/sessions/", {
      headers: {
        accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSessions(data);
      })
      .catch((err) => console.error("Error fetching sessions:", err));
  }, []);

  // 2. Fetch classrooms whenever sessionId changes
  useEffect(() => {
    if (!sessionId) return;

    fetch(BASE_URL+`/classrooms/?session_id=${sessionId}`, {
      headers: {
        accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setClassrooms(data);
      })
      .catch((err) => console.error("Error fetching classrooms:", err));
  }, [sessionId]);




  return (
    <NavigationBar>

        <div className="w-100 ps-2">
            
            <div className="d-flex justify-content-between my-3">
                <div className="session-section">
                    {sessions.map((session) => (
                        <button onClick={()=>setSessionId(session._id)}
                         className={("btn shadow-lg rounded-pill mx-2" +
                            ((sessionId == session._id)?" btn-success ":" btn-light")
                         )}>
                       {session.start_year} - {session.end_year} </button>
                    ))}
                </div>
                <div className="add-sessions">
                    <button className="btn btn-primary shadow-lg rounded-pill mx-2"> Add Session </button>
                </div>
            </div>

            <div className="row d-flex flwx-wrap justify-content-center ">
                <div className="col-sm-6">
                    <div className="shadow-lg py-3 px-1 mx-1 rounded">
                        <h5 className="fw-bold m-2">Classrooms</h5>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                <th>Sr no.</th>
                                <th>Session</th>
                                <th>Session status</th>
                                <th>Class name</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1.</td>
                                    <td>2019 - 2023</td>
                                    <td>Active</td>
                                    <td>XII</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="shadow-lg py-3 px-1 mx-1 rounded">
                        <h5 className="fw-bold m-2">Section</h5>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                <th>Sr no.</th>
                                <th>Session</th>
                                <th>Session status</th>
                                <th>Class name</th>
                                <th>Section name</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1.</td>
                                    <td>2019 - 2023</td>
                                    <td>Active</td>
                                    <td>XII</td>
                                    <td>A</td>
                                </tr>
                                <tr>
                                    <td>1.</td>
                                    <td>2019 - 2023</td>
                                    <td>Active</td>
                                    <td>XII</td>
                                    <td>B</td>
                                </tr>
                                <tr>
                                    <td>1.</td>
                                    <td>2019 - 2023</td>
                                    <td>Active</td>
                                    <td>XII</td>
                                    <td>C</td>
                                </tr>
                                <tr>
                                    <td>1.</td>
                                    <td>2019 - 2023</td>
                                    <td>Active</td>
                                    <td>XII</td>
                                    <td>D</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>

    </NavigationBar>
  )
}

export default Settings