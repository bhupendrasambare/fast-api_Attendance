import React, { useEffect, useState } from 'react'
import NavigationBar from '../components/Navbar'
import { Table } from 'react-bootstrap';
import { BASE_URL } from '../services/urls';

const Settings = () => {

const [sessionId, setSessionId] = useState("");
  const [classroomId, setClassroomId] = useState("");
  const [sectionId, setSectionId] = useState("");

  const [sessions, setSessions] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [sections, setSections] = useState([]);

  // 1. Fetch sessions on component load
  useEffect(() => {
    fetch(BASE_URL+"/sessions/", {
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
    var url = "";
    if (!sessionId){
        url = BASE_URL+`/classrooms/`
    }else{
        url = BASE_URL+`/classrooms/?session_id=${sessionId}`;
    }

    fetch(url, {
      headers: {
        accept: "application/json",
      },
    })
        .then((res) => res.json())
        .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
            setClassrooms(data);
        } else {
            setClassrooms([]);
        }
        })
      .catch((err) => console.error("Error fetching classrooms:", err));
  }, [sessionId]);


    useEffect(() => {
    fetch(BASE_URL+"/sections/", {
        headers: {
        accept: "application/json",
        },
    })
        .then((res) => res.json())
        .then((data) => {
        setSections(data);
        })
        .catch((err) => console.error("Error fetching sections:", err));
    }, []);


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
                                {classrooms.map((classroom) => (

                                    <tr>
                                        <td><input type="radio" name="" id="" /></td>
                                        <td>{classroom?.session?.start_year} - {classroom?.session?.end_year}</td>
                                        <td>Active</td>
                                        <td>{classroom?.classroom_name}</td>
                                    </tr>
                                ))}
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
                                <th>Session</th>
                                <th>Session status</th>
                                <th>Class name</th>
                                <th>Section name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sections.map((section) => (

                                    <tr>
                                        <td>{section.section_name}</td>
                                        <td>{section?.class_room?.session?.start_year}
                                             - {section?.class_room?.session?.end_year}</td>
                                        <td>Active</td>
                                        <td>{section.class_room?.classroom_name}</td>
                                    </tr>
                                ))}
                                
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